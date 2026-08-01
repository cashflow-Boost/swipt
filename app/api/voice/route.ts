import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Webhook de l'agent vocal (Vapi → AlloChantier).
 *
 * L'agent parle au client au téléphone ; quand il doit AGIR (poser un
 * rendez-vous, vérifier la zone), Vapi appelle cette route. On identifie
 * l'artisan par le numéro appelé (organizations.phone_number), puis on écrit
 * en base via le client service-role — en filtrant TOUJOURS par org_id, la RLS
 * étant contournée ici (cf. lib/supabase/admin.ts).
 *
 * Configuration côté Vapi : Server URL = https://<domaine>/api/voice, et un
 * secret partagé (header X-Vapi-Secret) = variable d'env VAPI_SERVER_SECRET.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolResult = { toolCallId: string; result: string };

// ── Utilitaires ────────────────────────────────────────────────────────────

/** Ne garde que les chiffres, et compare sur les 9 derniers (indépendant du +33/0). */
function normPhone(v: unknown): string {
  return String(v ?? "").replace(/\D/g, "").slice(-9);
}

/** Récupère la charge utile d'un appel d'outil, quelle que soit la version d'API Vapi. */
function extractToolCalls(
  message: Record<string, unknown>,
): Array<{ id: string; name: string; args: Record<string, unknown> }> {
  const parse = (a: unknown): Record<string, unknown> => {
    if (a && typeof a === "object") return a as Record<string, unknown>;
    if (typeof a === "string") {
      try {
        return JSON.parse(a) as Record<string, unknown>;
      } catch {
        return {};
      }
    }
    return {};
  };

  // Format récent : message.toolCallList = [{ id, function: { name, arguments } }]
  const list = (message.toolCallList ?? message.toolCalls) as unknown;
  if (Array.isArray(list)) {
    return list.map((t) => {
      const tc = t as Record<string, unknown>;
      const fn = (tc.function ?? {}) as Record<string, unknown>;
      return {
        id: String(tc.id ?? ""),
        name: String(fn.name ?? ""),
        args: parse(fn.arguments),
      };
    });
  }

  // Format hérité : message.functionCall = { name, parameters }
  const fc = message.functionCall as Record<string, unknown> | undefined;
  if (fc && typeof fc === "object") {
    return [{ id: "", name: String(fc.name ?? ""), args: parse(fc.parameters) }];
  }

  return [];
}

/** Cherche l'organisation par le numéro appelé, avec repli sur une org par défaut. */
async function resolveOrgId(
  admin: ReturnType<typeof createAdminClient>,
  message: Record<string, unknown>,
): Promise<string | null> {
  // 1) org_id explicite passé dans les métadonnées de l'assistant (multi-tenant propre).
  const call = (message.call ?? {}) as Record<string, unknown>;
  const overrides = (call.assistantOverrides ?? {}) as Record<string, unknown>;
  const meta = (overrides.metadata ?? (message.assistant as Record<string, unknown>)?.metadata ?? {}) as Record<string, unknown>;
  const metaOrg = meta.orgId ?? meta.org_id;
  if (metaOrg) return String(metaOrg);

  // 2) numéro appelé → organizations.phone_number
  const phoneObj = (message.phoneNumber ?? call.phoneNumber ?? {}) as Record<string, unknown>;
  const dialed = normPhone(phoneObj.number ?? call.phoneNumberId ?? "");
  if (dialed) {
    const { data } = await admin
      .from("organizations")
      .select("id, phone_number")
      .not("phone_number", "is", null);
    const hit = (data ?? []).find((o) => normPhone(o.phone_number) === dialed);
    if (hit) return hit.id as string;
  }

  // 3) repli : une seule org en test (variable d'env). L'ancien nom SWIPT_*
  // reste accepté pour ne pas casser les déploiements déjà configurés.
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

// ── Registre interne : l'assistant est fabriqué par AlloChantier à chaque appel ─────
//
// Vapi ne stocke AUCUNE configuration métier : quand un appel arrive, il envoie
// « assistant-request » et AlloChantier répond avec l'assistant complet, construit à
// partir des Réglages de l'artisan (nom annoncé, métier, zone, urgences,
// refus). La personnalisation vit dans le SaaS, pas chez le prestataire.

type OrgProfile = {
  name: string;
  agent_paused: boolean;
  /** Faux si l'essai est terminé sans abonnement actif : AlloChantier ne décroche plus. */
  access_open: boolean;
  announced_name: string | null;
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
      .select("announced_name, trade, greeting, custom_instructions, zone_center, zone_radius_km, urgent_triggers, refusal_rules, callout_fee_cents, business_hours")
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
  const trialEnd = org.trial_ends_at ? new Date(String(org.trial_ends_at)).getTime() : null;
  return {
    name: org.name as string,
    agent_paused: Boolean(org.agent_paused),
    access_open:
      org.subscription_status === "active" || trialEnd === null || trialEnd > Date.now(),
    announced_name: (s?.announced_name as string) ?? null,
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
  const tarifs =
    p.price_items.length > 0
      ? `\n\nGRILLE DE PRIX (HT) — donne un ORDRE DE GRANDEUR, jamais un prix ferme, et précise toujours que l'artisan confirme le devis :\n${p.price_items
          .map((i) => `- ${i.label}${i.unit ? ` (par ${i.unit})` : ""} : ${(i.cents / 100).toLocaleString("fr-FR")} €`)
          .join("\n")}`
      : "\n\nAucune grille de prix n'est enregistrée : ne donne AUCUN chiffre, dis que l'artisan établira le devis.";

  return `Tu es l'assistant téléphonique de ${nom}, entreprise artisanale de dépannage.${metier} Tu réponds à la place de l'artisan quand il est en intervention.

RÈGLES
- Français naturel, chaleureux, efficace. Phrases courtes, une question à la fois.
- Tu es un assistant automatique : simple et humain, jamais robotique.
- Ne promets jamais un prix ferme ni un délai non garanti ; l'artisan confirme le devis.${refus}${deplacement}

DÉROULÉ
1. Comprends le problème : quoi, où, depuis quand.
2. Urgences (${urgences}) : dis que tu alertes immédiatement l'artisan et qu'on rappelle très vite — pas de rendez-vous lointain.
3. ${zone} Hors zone : décline poliment.
4. Recueille : nom, numéro de rappel, adresse, description du besoin.
5. Propose un créneau UNIQUEMENT dans ces horaires : ${horaires}. En dehors, ne promets rien : note la demande et dis que l'artisan rappellera.
6. Confirme le créneau à voix haute (jour et heure), puis enregistre-le avec l'outil « poser_rendez_vous » (date ISO 8601, fuseau Europe/Paris, calculée depuis la date actuelle fournie).
7. Récapitule, remercie, termine poliment.${tarifs}${
    p.custom_instructions && p.custom_instructions.trim()
      ? `\n\nCONSIGNES DE L'ARTISAN (elles priment sur le reste, sauf sécurité et honnêteté des prix) :\n${p.custom_instructions.trim()}`
      : ""
  }

Tu représentes un artisan de confiance : rassurant et professionnel.`;
}

/** Réponse à « assistant-request » : l'assistant complet, personnalisé, à la volée. */
function buildAssistant(p: OrgProfile, orgId: string, selfUrl: string) {
  const nom = p.announced_name || p.name;
  const secret = process.env.VAPI_SERVER_SECRET;

  const systemPrompt = p.agent_paused
    ? `Tu es l'assistant téléphonique de ${nom}. L'artisan a repris la main et gère ses appels lui-même en ce moment. Explique-le poliment, propose de rappeler plus tard ou prends le nom et le numéro de l'appelant pour qu'on le rappelle. Ne pose AUCUN rendez-vous.`
    : buildPrompt(p);

  const tools = [
    {
      type: "function",
      function: {
        name: "poser_rendez_vous",
        description:
          "Enregistre un rendez-vous dans l'agenda de l'artisan une fois le créneau confirmé avec le client.",
        parameters: {
          type: "object",
          properties: {
            nom_client: { type: "string", description: "Nom de l'appelant" },
            telephone: { type: "string", description: "Numéro de rappel" },
            adresse: { type: "string", description: "Adresse de l'intervention" },
            description_besoin: { type: "string", description: "Ce qu'il faut réparer" },
            debut: { type: "string", description: "Début en ISO 8601, fuseau Europe/Paris" },
            duree_minutes: { type: "number", description: "Durée estimée en minutes (défaut 60)" },
          },
          required: ["nom_client", "debut"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "verifier_zone",
        description: "Vérifie si une ville est dans la zone d'intervention de l'artisan.",
        parameters: {
          type: "object",
          properties: { ville: { type: "string", description: "Ville ou commune du client" } },
          required: ["ville"],
        },
      },
    },
  ];

  return {
    name: `AlloChantier — ${p.name}`,
    firstMessage: p.agent_paused
      ? `Bonjour, vous êtes bien chez ${nom}. Un instant, je vous explique comment nous joindre.`
      : (p.greeting && p.greeting.trim())
        ? p.greeting.trim()
        : `Bonjour, vous êtes bien chez ${nom}, je suis l'assistant qui prend vos appels. Que puis-je faire pour vous ?`,
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [{ role: "system", content: systemPrompt }],
      tools,
    },
    voice: { provider: "azure", voiceId: "fr-FR-DeniseNeural" },
    transcriber: { provider: "deepgram", model: "nova-2", language: "fr" },
    server: { url: selfUrl, ...(secret ? { secret } : {}) },
    metadata: { orgId },
  };
}

/** Journalise l'appel terminé (transcription, résumé, enregistrement, durée). */
async function logEndOfCall(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string,
  message: Record<string, unknown>,
): Promise<void> {
  const call = (message.call ?? {}) as Record<string, unknown>;
  const artifact = (message.artifact ?? {}) as Record<string, unknown>;
  const startedAt = call.createdAt ?? message.startedAt ?? null;
  const durationSeconds = message.durationSeconds != null ? Math.round(Number(message.durationSeconds)) : null;
  const recording = (artifact.recordingUrl ?? message.recordingUrl ?? null) as string | null;
  const summary = (message.summary ?? null) as string | null;
  const transcript = (artifact.messages ?? message.transcript ?? null) as unknown;

  await admin.from("calls").insert({
    org_id: orgId,
    started_at: startedAt ? new Date(String(startedAt)).toISOString() : new Date().toISOString(),
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
  // Vérification du secret partagé, si configuré.
  const expected = process.env.VAPI_SERVER_SECRET;
  if (expected) {
    const got = req.headers.get("x-vapi-secret");
    if (got !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const message = (body.message ?? body) as Record<string, unknown>;
  const type = String(message.type ?? "");

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    // Sans clé service-role, on ne peut rien écrire : on répond proprement.
    return NextResponse.json({ results: [] });
  }

  const orgId = await resolveOrgId(admin, message);

  // Un appel entre : Vapi demande QUI doit répondre. AlloChantier fabrique l'assistant
  // à la volée depuis les Réglages de l'artisan — le registre interne du SaaS.
  if (type === "assistant-request") {
    if (!orgId) {
      return NextResponse.json({
        error: "Numéro non rattaché à un compte AlloChantier.",
      });
    }
    const profile = await loadProfile(admin, orgId);
    if (!profile) {
      return NextResponse.json({ error: "Compte artisan introuvable." });
    }
    // Essai terminé sans abonnement : le service ne décroche plus (SPEC §6).
    if (!profile.access_open) {
      return NextResponse.json({ error: "Abonnement AlloChantier inactif pour ce compte." });
    }
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
    const selfUrl = `${proto}://${host}/api/voice`;
    return NextResponse.json({ assistant: buildAssistant(profile, orgId, selfUrl) });
  }

  // Appel terminé : on journalise, sans réponse d'outil.
  if (type === "end-of-call-report") {
    if (orgId) {
      try {
        await logEndOfCall(admin, orgId, message);
      } catch {
        /* best-effort */
      }
    }
    return NextResponse.json({ ok: true });
  }

  // Appels d'outils.
  if (type === "tool-calls" || type === "function-call") {
    const calls = extractToolCalls(message);
    if (calls.length === 0) return NextResponse.json({ ok: true });

    // « Je reprends la main » (SPEC §4.9) : si l'artisan a mis l'agent en pause,
    // on ne pose rien — il gère ses appels lui-même.
    let paused = false;
    if (orgId) {
      const { data: org } = await admin
        .from("organizations")
        .select("agent_paused")
        .eq("id", orgId)
        .maybeSingle();
      paused = Boolean(org?.agent_paused);
    }

    const results: ToolResult[] = [];
    for (const c of calls) {
      let result = "Outil inconnu.";
      if (!orgId) {
        result = "Compte artisan introuvable pour ce numéro. Un conseiller rappellera.";
      } else if (paused) {
        result = "L'artisan gère ses appels en direct en ce moment. Invitez l'appelant à rappeler ou à laisser ses coordonnées ; ne posez pas de rendez-vous.";
      } else if (c.name === "poser_rendez_vous") {
        result = await poserRendezVous(admin, orgId, c.args);
      } else if (c.name === "verifier_zone") {
        result = await verifierZone(admin, orgId, c.args);
      }
      results.push({ toolCallId: c.id, result });
    }

    // Format hérité (function-call) : réponse à plat.
    if (type === "function-call") {
      return NextResponse.json({ result: results[0]?.result ?? "" });
    }
    return NextResponse.json({ results });
  }

  // Tous les autres messages (status-update, transcript, speech-update…) : 200 vide.
  return NextResponse.json({ ok: true });
}
