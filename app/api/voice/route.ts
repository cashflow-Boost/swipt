import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Webhook de l'agent vocal (Vapi → SWIPT).
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

  // 3) repli : une seule org en test (variable d'env).
  return process.env.SWIPT_DEFAULT_ORG_ID ?? null;
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
