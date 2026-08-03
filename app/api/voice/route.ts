import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { FREE_CALL_QUOTA } from "@/lib/plans";

/**
 * Webhook de l'agent vocal (Retell AI → Rimova).
 *
 * Rimova tient le « registre interne » : Retell ne stocke AUCUNE
 * configuration métier. Un seul agent Retell existe, dont le prompt vaut
 * littéralement « {{system_prompt}} » et le message d'accueil « {{greeting}} ».
 * Tout le contenu personnalisé (script, horaires, grille de prix, consignes de
 * l'artisan) est calculé ICI, à chaque appel, depuis les Réglages de l'artisan,
 * puis injecté dans Retell via les variables dynamiques du webhook entrant.
 *
 * Trois familles de requêtes arrivent sur cette route :
 *  1. Appel entrant  (event = "call_inbound")  → on identifie l'artisan par le
 *     numéro appelé et on renvoie { call_inbound: { dynamic_variables, metadata } }.
 *  2. Appel d'outil  (payload avec « name » + « args ») → poser_rendez_vous /
 *     verifier_zone : on écrit en base et on renvoie un résultat au LLM.
 *  3. Fin d'appel     (event = "call_ended")   → on journalise l'appel.
 *
 * Côté Retell (à configurer une seule fois, cf. README de déploiement) :
 *  - Numéro de téléphone : Inbound Webhook URL = https://<domaine>/api/voice
 *  - Agent : General Prompt = {{system_prompt}}, Begin Message = {{greeting}}
 *  - Deux « custom functions » (poser_rendez_vous, verifier_zone) → même URL
 *  - Agent Webhook URL = https://<domaine>/api/voice (événements call_ended)
 *  - Variable d'env RETELL_API_KEY = clé API Retell (badge « webhook ») pour
 *    vérifier la signature X-Retell-Signature des requêtes entrantes.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Utilitaires ────────────────────────────────────────────────────────────

/** Ne garde que les chiffres, et compare sur les 9 derniers (indépendant du +33/0). */
function normPhone(v: unknown): string {
  return String(v ?? "").replace(/\D/g, "").slice(-9);
}

/**
 * Convertit un numéro français en E.164 (+33…) pour le transfert Retell, qui
 * exige un format international appelable. Repli : renvoie l'entrée nettoyée.
 */
function toE164FR(v: string | null): string {
  const d = String(v ?? "").replace(/[^\d+]/g, "");
  if (!d) return "";
  if (d.startsWith("+")) return d;
  if (d.startsWith("0033")) return "+" + d.slice(2);
  if (d.startsWith("33") && d.length >= 11) return "+" + d;
  if (d.startsWith("0") && d.length === 10) return "+33" + d.slice(1);
  return d;
}

/**
 * Vérifie la signature d'un webhook Retell : HMAC-SHA256(rawBody) avec la clé
 * API en secret, comparé en temps constant à l'en-tête X-Retell-Signature.
 * Retenu par défaut dès que RETELL_API_KEY est configurée ; RETELL_SKIP_VERIFY=1
 * offre une échappatoire de dépannage sans redéployer.
 */
function verifyRetellSignature(raw: string, signature: string | null, apiKey: string): boolean {
  if (!signature) return false;
  const digest = createHmac("sha256", apiKey).update(raw).digest("hex");
  // Certaines versions préfixent la signature (« v=…,d=<hex> ») : on isole le hex.
  const provided = signature.includes("d=")
    ? signature.slice(signature.lastIndexOf("d=") + 2).trim()
    : signature.trim();
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(provided, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Identifie l'organisation : d'abord les métadonnées posées au décroché, puis
 * le numéro Rimova appelé (organizations.phone_number), enfin le repli
 * d'env pour les tests. L'ancien nom SWIPT_* reste accepté.
 */
async function resolveOrgId(
  admin: ReturnType<typeof createAdminClient>,
  metadata: Record<string, unknown> | null,
  dialedNumber: unknown,
): Promise<string | null> {
  const metaOrg = metadata?.org_id ?? metadata?.orgId;
  if (metaOrg) return String(metaOrg);

  const dialed = normPhone(dialedNumber);
  if (dialed) {
    const { data } = await admin
      .from("organizations")
      .select("id, phone_number")
      .not("phone_number", "is", null);
    const hit = (data ?? []).find((o) => normPhone(o.phone_number) === dialed);
    if (hit) return hit.id as string;
  }

  return (
    process.env.ALLOCHANTIER_DEFAULT_ORG_ID ??
    process.env.SWIPT_DEFAULT_ORG_ID ??
    null
  );
}

// ── Outils appelables par l'agent ───────────────────────────────────────────

async function poserRendezVous(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string,
  args: Record<string, unknown>,
): Promise<string> {
  const nom = String(args.nom_client ?? "").trim() || "Client";
  const phone = String(args.telephone ?? "").trim() || null;
  const adresse = String(args.adresse ?? "").trim() || null;
  const besoin = String(args.description_besoin ?? "").trim() || null;
  const debutRaw = String(args.debut ?? "").trim();
  const duree = Number(args.duree_minutes ?? 60) || 60;

  const debut = new Date(debutRaw);
  if (!debutRaw || isNaN(debut.getTime())) {
    return "Je n'ai pas pu enregistrer le rendez-vous : la date proposée est incomplète. Reformulez le créneau (jour et heure).";
  }
  const fin = new Date(debut.getTime() + duree * 60_000);

  // Anti double-réservation : on refuse un créneau qui en chevauche un autre.
  const { data: clash } = await admin
    .from("appointments")
    .select("id")
    .eq("org_id", orgId)
    .lt("starts_at", fin.toISOString())
    .gt("ends_at", debut.toISOString())
    .limit(1);
  if (clash && clash.length > 0) {
    return "Ce créneau est déjà pris dans l'agenda. Propose un autre horaire au client.";
  }

  // Client existant (par téléphone) ou création.
  let customerId: string | null = null;
  if (phone) {
    const norm = normPhone(phone);
    const { data: existing } = await admin
      .from("customers")
      .select("id, phone")
      .eq("org_id", orgId);
    const found = (existing ?? []).find((c) => normPhone(c.phone) === norm);
    customerId = found?.id ?? null;
  }
  if (!customerId) {
    const { data: created, error } = await admin
      .from("customers")
      .insert({ org_id: orgId, full_name: nom, phone, address: adresse, first_seen_at: new Date().toISOString() })
      .select("id")
      .single();
    if (error) return "Je n'ai pas pu enregistrer le client. Un conseiller vous rappellera.";
    customerId = created.id;
  }

  const { error: apptErr } = await admin.from("appointments").insert({
    org_id: orgId,
    customer_id: customerId,
    starts_at: debut.toISOString(),
    ends_at: fin.toISOString(),
    source: "agent",
    locked: false,
    status: "scheduled",
    notes: besoin,
  });
  if (apptErr) return "Je n'ai pas pu poser le rendez-vous dans l'agenda. Un conseiller vous rappellera.";

  const quand = debut.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Rendez-vous confirmé pour ${nom} le ${quand}. C'est noté dans l'agenda.`;
}

async function verifierZone(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string,
  args: Record<string, unknown>,
): Promise<string> {
  const ville = String(args.ville ?? args.adresse ?? "").trim().toLowerCase();
  if (!ville) return "Précisez la ville pour que je vérifie la zone.";
  const { data } = await admin
    .from("agent_settings")
    .select("zone_center, zone_radius_km")
    .eq("org_id", orgId)
    .maybeSingle();
  const centre = String(data?.zone_center ?? "").trim().toLowerCase();
  if (!centre) return "Zone couverte : à confirmer avec l'artisan.";
  const dansLaZone = ville.includes(centre) || centre.includes(ville);
  return dansLaZone
    ? `${args.ville} est dans la zone d'intervention.`
    : `${args.ville} est probablement hors de la zone habituelle (centrée sur ${data?.zone_center}). Proposez un rappel de l'artisan plutôt qu'un rendez-vous ferme.`;
}

// ── Registre interne : le script est fabriqué par Rimova à chaque appel ─────

type OrgProfile = {
  name: string;
  agent_paused: boolean;
  /** Faux si l'essai est terminé sans abonnement actif : Rimova ne décroche plus. */
  access_open: boolean;
  announced_name: string | null;
  business_phone: string | null;
  trade: string | null;
  zone_center: string | null;
  zone_radius_km: number | null;
  urgent_triggers: string[] | null;
  refusal_rules: string[] | null;
  callout_fee_cents: number | null;
  business_hours: Record<string, [string, string][]> | null;
  greeting: string | null;
  custom_instructions: string | null;
  price_items: { label: string; unit: string | null; cents: number }[];
};

async function loadProfile(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string,
): Promise<OrgProfile | null> {
  const [{ data: org }, { data: s }] = await Promise.all([
    admin
      .from("organizations")
      .select("name, agent_paused, trial_ends_at, subscription_status")
      .eq("id", orgId)
      .maybeSingle(),
    admin
      .from("agent_settings")
      .select("announced_name, business_phone, trade, greeting, custom_instructions, zone_center, zone_radius_km, urgent_triggers, refusal_rules, callout_fee_cents, business_hours")
      .eq("org_id", orgId)
      .maybeSingle(),
  ]);
  // La grille de prix est ce qui permet d'annoncer un ordre de grandeur.
  const { data: prices } = await admin
    .from("price_items")
    .select("label, unit, unit_price_cents")
    .eq("org_id", orgId)
    .order("label")
    .limit(40);
  if (!org) return null;
  // Offre de découverte : accès ouvert tant que l'abonnement est actif OU que
  // le quota d'appels TRAITÉS offerts n'est pas épuisé (plus de limite de temps).
  const { count: handledCount } = await admin
    .from("calls")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId)
    .eq("status", "handled");
  return {
    name: org.name as string,
    agent_paused: Boolean(org.agent_paused),
    access_open:
      org.subscription_status === "active" || (handledCount ?? 0) < FREE_CALL_QUOTA,
    announced_name: (s?.announced_name as string) ?? null,
    business_phone: (s?.business_phone as string) ?? null,
    trade: (s?.trade as string) ?? null,
    zone_center: (s?.zone_center as string) ?? null,
    zone_radius_km: (s?.zone_radius_km as number) ?? null,
    urgent_triggers: (s?.urgent_triggers as string[]) ?? null,
    refusal_rules: (s?.refusal_rules as string[]) ?? null,
    callout_fee_cents: (s?.callout_fee_cents as number) ?? null,
    business_hours: (s?.business_hours as Record<string, [string, string][]>) ?? null,
    greeting: (s?.greeting as string) ?? null,
    custom_instructions: (s?.custom_instructions as string) ?? null,
    price_items: (prices ?? []).map((p) => ({
      label: p.label as string,
      unit: (p.unit as string) ?? null,
      cents: p.unit_price_cents as number,
    })),
  };
}

const DAY_LABELS: Record<string, string> = {
  mon: "lundi", tue: "mardi", wed: "mercredi", thu: "jeudi",
  fri: "vendredi", sat: "samedi", sun: "dimanche",
};
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** Horaires en une phrase lisible ; gère la pause déjeuner ; repli lun–ven 8 h – 18 h. */
function formatHours(h: Record<string, [string, string][]> | null): string {
  const entries = DAY_ORDER.filter((d) => h?.[d]?.length);
  if (!h || entries.length === 0) return "du lundi au vendredi de 8 h à 18 h";
  const slot = ([from, to]: [string, string]) =>
    `de ${from.replace(":", " h ")} à ${to.replace(":", " h ")}`;
  return entries
    .map((d) => `${DAY_LABELS[d]} ${h[d].map(slot).join(" et ")}`)
    .join(", ");
}

/** Construit le script (system prompt) français depuis les réglages de l'org. */
function buildPrompt(p: OrgProfile): string {
  const nom = p.announced_name || p.name;
  const metier = p.trade ? ` Métier : ${p.trade}.` : "";
  const zone = p.zone_center
    ? `Zone d'intervention : ${p.zone_center}${p.zone_radius_km ? ` et environ ${p.zone_radius_km} km autour` : ""}. En cas de doute sur une ville, utilise l'outil « verifier_zone ».`
    : "En cas de doute sur la couverture d'une ville, utilise l'outil « verifier_zone ».";
  const urgences =
    p.urgent_triggers && p.urgent_triggers.length > 0
      ? p.urgent_triggers.join(", ")
      : "fuite d'eau active, odeur de gaz, coupure totale de courant, personne bloquée, danger immédiat";
  const refus =
    p.refusal_rules && p.refusal_rules.length > 0
      ? `\n- Tu déclines poliment : ${p.refusal_rules.join(", ")}.`
      : "";
  const deplacement =
    p.callout_fee_cents && p.callout_fee_cents > 0
      ? `\n- Si on te demande le prix du déplacement : ${(p.callout_fee_cents / 100).toLocaleString("fr-FR")} € TTC, le reste sur devis confirmé par l'artisan.`
      : "";

  const horaires = formatHours(p.business_hours);
  const maintenant = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const tarifs =
    p.price_items.length > 0
      ? `\n\nGRILLE DE PRIX (HT) — donne un ORDRE DE GRANDEUR, jamais un prix ferme, et précise toujours que l'artisan confirme le devis :\n${p.price_items
          .map((i) => `- ${i.label}${i.unit ? ` (par ${i.unit})` : ""} : ${(i.cents / 100).toLocaleString("fr-FR")} €`)
          .join("\n")}`
      : "\n\nAucune grille de prix n'est enregistrée : ne donne AUCUN chiffre, dis que l'artisan établira le devis.";

  return `Tu es l'assistant téléphonique de ${nom}, entreprise artisanale de dépannage.${metier} Tu réponds à la place de l'artisan quand il est en intervention.

DATE ACTUELLE (Europe/Paris) : ${maintenant}. Calcule tout créneau relatif (« demain », « lundi prochain », « dans une heure ») à partir de cette date, et transmets la date à l'outil au format ISO 8601.

RÈGLES
- Parle EXCLUSIVEMENT en français, jamais un mot d'anglais. Français naturel, chaleureux, efficace. Phrases courtes, une question à la fois.
- Dis toujours les heures au format français 24 heures : « dix-huit heures », « treize heures trente », jamais « six heures du soir » ni un format anglais (pas de « three to six », pas de « PM/AM »). Prononce les nombres, montants (« quarante-cinq euros ») et dates en toutes lettres, à la française.
- Tu es un assistant automatique : simple et humain, jamais robotique.
- Une seule question à la fois ; laisse l'appelant finir, ne l'interromps pas, reformule pour montrer que tu as compris.
- Confirme les informations importantes en les répétant : fais épeler le nom en cas de doute, redis l'adresse et le numéro de rappel chiffre par chiffre.
- N'invente JAMAIS un prix, un délai ou une disponibilité que tu n'as pas : en cas de doute, dis simplement que l'artisan confirmera.
- Si l'appelant demande expressément à parler à l'artisan (un humain), transfère l'appel avec l'outil « transferer_appel ».
- Ne promets jamais un prix ferme ni un délai non garanti ; l'artisan confirme le devis.${refus}${deplacement}

DÉROULÉ — suis cet ordre :
1. Tu as déjà salué. Demande ce qui l'amène : quel est le problème, depuis quand.
2. SÉCURITÉ D'ABORD (prioritaire sur tout le reste) : si c'est une urgence (${urgences}), n'attends pas — transfère l'appel à l'artisan avec l'outil « transferer_appel ». Si le transfert n'aboutit pas, prends le nom et le numéro, dis que tu alertes immédiatement l'artisan et qu'on rappelle en urgence. Ne déroule ni le budget ni un rendez-vous lointain.
3. Annonce un ORDRE DE GRANDEUR du budget à partir de la grille de prix, adapté à son besoin. Dis TOUJOURS que c'est une estimation « environ », jamais un prix ferme, et que l'artisan confirme le devis.
4. Demande sa ville ou son secteur, et vérifie la zone (outil « verifier_zone »). ${zone} Hors zone : décline poliment ou propose que l'artisan rappelle.
5. Recueille ses coordonnées : nom, numéro de rappel, adresse précise.
6. Propose un créneau UNIQUEMENT dans ces horaires : ${horaires}. En dehors, ne promets rien : note la demande et dis que l'artisan rappellera. Confirme le créneau à voix haute (jour et heure en français, format 24 h), puis enregistre-le avec l'outil « poser_rendez_vous » (date ISO 8601, fuseau Europe/Paris, calculée depuis la date actuelle fournie).
7. Récapitule, remercie, termine poliment.${tarifs}${
    p.custom_instructions && p.custom_instructions.trim()
      ? `\n\nCONSIGNES DE L'ARTISAN (elles priment sur le reste, sauf sécurité et honnêteté des prix) :\n${p.custom_instructions.trim()}`
      : ""
  }

Tu représentes un artisan de confiance : rassurant et professionnel.`;
}

/** Phrase d'accueil : celle réglée par l'artisan, sinon un repli au nom de l'entreprise. */
function buildGreeting(p: OrgProfile): string {
  const nom = p.announced_name || p.name;
  if (p.agent_paused) {
    return `Bonjour, vous êtes bien chez ${nom}. Un instant, je vous explique comment nous joindre.`;
  }
  if (p.greeting && p.greeting.trim()) return p.greeting.trim();
  return `Bonjour, vous êtes bien chez ${nom}, je suis l'assistant qui prend vos appels. Que puis-je faire pour vous ?`;
}

/**
 * Variables dynamiques renvoyées à Retell au décroché. Le prompt de l'agent
 * Retell vaut « {{system_prompt}} » et son message d'accueil « {{greeting}} » :
 * tout le contenu métier est donc calculé ici.
 */
function buildDynamicVariables(p: OrgProfile): { system_prompt: string; greeting: string; business_phone: string } {
  const nom = p.announced_name || p.name;
  const greeting = buildGreeting(p);
  const base = p.agent_paused
    ? `Tu es l'assistant téléphonique de ${nom}. L'artisan a repris la main et gère ses appels lui-même en ce moment. Explique-le poliment, propose de rappeler plus tard ou prends le nom et le numéro de l'appelant pour qu'on le rappelle. Ne pose AUCUN rendez-vous.`
    : buildPrompt(p);
  // La phrase d'accueil est intégrée AU PROMPT : l'agent Retell n'a donc pas
  // besoin d'un champ « Begin Message » séparé (absent de certaines UI). La
  // variable {{greeting}} reste renvoyée pour qui voudrait l'utiliser à part.
  const opening = `Tu ouvres l'appel : ta TOUTE PREMIÈRE parole, dès le décroché, doit être exactement, mot pour mot : « ${greeting} » — ne dis rien d'autre avant, puis enchaîne naturellement.\n\n`;
  // business_phone alimente l'outil « transferer_appel » de Retell (destination
  // du transfert = {{business_phone}}), pour joindre l'artisan en cas d'urgence.
  return { system_prompt: opening + base, greeting, business_phone: toE164FR(p.business_phone) };
}

/** Script de repli quand le numéro n'est rattaché à aucun compte Rimova actif. */
function fallbackVariables(reason: "unknown" | "inactive"): { system_prompt: string; greeting: string; business_phone: string } {
  const greeting = "Bonjour, merci de votre appel.";
  const base =
    reason === "inactive"
      ? "Le compte Rimova associé à ce numéro n'est pas actif actuellement. Explique poliment que la ligne n'est pas disponible pour le moment, invite l'appelant à réessayer plus tard, puis termine l'appel. Ne pose aucun rendez-vous et ne donne aucun prix."
      : "Ce numéro n'est pas encore rattaché à un compte. Explique poliment que tu ne peux pas traiter la demande pour l'instant, invite l'appelant à réessayer plus tard, puis termine l'appel. Ne pose aucun rendez-vous et ne donne aucun prix.";
  const opening = `Ta toute première parole doit être, mot pour mot : « ${greeting} ». Puis :\n`;
  return { system_prompt: opening + base, greeting, business_phone: "" };
}

/** Journalise l'appel terminé (transcription, résumé, enregistrement, durée). */
async function logEndOfCall(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string,
  call: Record<string, unknown>,
): Promise<void> {
  const start = call.start_timestamp != null ? Number(call.start_timestamp) : null;
  const end = call.end_timestamp != null ? Number(call.end_timestamp) : null;
  const durationSeconds =
    start != null && end != null && end >= start ? Math.round((end - start) / 1000) : null;
  const recording = (call.recording_url ?? null) as string | null;
  const analysis = (call.call_analysis ?? {}) as Record<string, unknown>;
  const summary = (analysis.call_summary ?? null) as string | null;
  const transcript = (call.transcript_object ?? call.transcript ?? null) as unknown;

  await admin.from("calls").insert({
    org_id: orgId,
    started_at: start != null ? new Date(start).toISOString() : new Date().toISOString(),
    duration_seconds: durationSeconds,
    direction: "inbound",
    status: "handled",
    recording_url: recording,
    transcript: transcript ?? null,
    extraction: summary ? { summary } : null,
  });

  // Compteur du forfait : volume inclus puis dépassement facturable (SPEC §6).
  await admin.rpc("count_handled_call", { p_org: orgId });
}

// ── Point d'entrée ──────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Corps brut d'abord : la signature Retell porte sur les octets reçus.
  const raw = await req.text();

  const apiKey = process.env.RETELL_API_KEY;
  if (apiKey && process.env.RETELL_SKIP_VERIFY !== "1") {
    const ok = verifyRetellSignature(raw, req.headers.get("x-retell-signature"), apiKey);
    if (!ok) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const event = typeof body.event === "string" ? body.event : "";
  const fnName = typeof body.name === "string" ? body.name : "";
  const call = (body.call ?? {}) as Record<string, unknown>;

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    // Sans clé service-role, on ne peut rien écrire : réponse neutre.
    return NextResponse.json({ error: "service unavailable" }, { status: 200 });
  }

  // 1) Appel entrant : Retell demande la configuration de CET appel. Rimova
  //    fabrique le script à la volée depuis les Réglages de l'artisan.
  if (event === "call_inbound") {
    const inbound = (body.call_inbound ?? {}) as Record<string, unknown>;
    const orgId = await resolveOrgId(admin, null, inbound.to_number);
    if (!orgId) {
      return NextResponse.json({ call_inbound: { dynamic_variables: fallbackVariables("unknown") } });
    }
    const profile = await loadProfile(admin, orgId);
    if (!profile) {
      return NextResponse.json({ call_inbound: { dynamic_variables: fallbackVariables("unknown") } });
    }
    if (!profile.access_open) {
      return NextResponse.json({ call_inbound: { dynamic_variables: fallbackVariables("inactive") } });
    }
    return NextResponse.json({
      call_inbound: {
        dynamic_variables: buildDynamicVariables(profile),
        metadata: { org_id: orgId },
      },
    });
  }

  // 2) Fin d'appel : on journalise (événement terminal, garanti).
  if (event === "call_ended") {
    const metadata = (call.metadata ?? null) as Record<string, unknown> | null;
    const orgId = await resolveOrgId(admin, metadata, call.to_number);
    if (orgId) {
      try {
        await logEndOfCall(admin, orgId, call);
      } catch {
        /* best-effort */
      }
    }
    return NextResponse.json({ ok: true });
  }

  // 3) Appel d'un outil (custom function) : pas d'« event », mais un « name ».
  if (fnName) {
    const args = (body.args ?? {}) as Record<string, unknown>;
    const metadata = (call.metadata ?? null) as Record<string, unknown> | null;
    const orgId = await resolveOrgId(admin, metadata, call.to_number);

    if (!orgId) {
      return NextResponse.json({
        result: "Compte artisan introuvable pour ce numéro. Un conseiller rappellera.",
      });
    }

    // « Je reprends la main » (SPEC §4.9) : agent en pause → on ne pose rien.
    const { data: org } = await admin
      .from("organizations")
      .select("agent_paused")
      .eq("id", orgId)
      .maybeSingle();
    if (org?.agent_paused) {
      return NextResponse.json({
        result:
          "L'artisan gère ses appels en direct en ce moment. Invitez l'appelant à rappeler ou à laisser ses coordonnées ; ne posez pas de rendez-vous.",
      });
    }

    // Association tolérante : on reconnaît l'outil par mot-clé, quel que soit le
    // nom exact donné dans Retell (« verifier_zone », « zone_de_verification »,
    // « poser_rendez_vous », « prendre_rdv »…), pour ne pas dépendre d'un libellé.
    const lname = fnName.toLowerCase().replace(/[^a-z]/g, "");
    let result = "Outil inconnu.";
    if (lname.includes("rendez") || lname.includes("rdv") || lname.includes("appointment")) {
      result = await poserRendezVous(admin, orgId, args);
    } else if (lname.includes("zone")) {
      result = await verifierZone(admin, orgId, args);
    }
    return NextResponse.json({ result });
  }

  // Autres événements (call_started, call_analyzed, ping…) : 200 vide.
  return NextResponse.json({ ok: true });
}
