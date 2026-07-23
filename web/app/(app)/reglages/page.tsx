import { getSessionOrg } from "@/lib/auth";
import { getAgentSettings } from "@/lib/actions/agent-settings";
import { createClient } from "@/lib/supabase/server";
import { formatEuros } from "@/lib/money";

type Settings = {
  announced_name: string | null;
  trade: string | null;
  zone_center: string | null;
  zone_radius_km: number | null;
  business_hours: Record<string, string> | null;
  ring_count: number | null;
  callout_fee_cents: number | null;
  urgent_triggers: string[] | null;
  refusal_rules: string[] | null;
} | null;

const DAY_LABELS: Record<string, string> = {
  lun_ven: "Lun–ven",
  sam: "Samedi",
  dim: "Dimanche",
};

function formatHours(bh: Record<string, string> | null): string {
  if (!bh || Object.keys(bh).length === 0) return "—";
  return Object.entries(bh)
    .map(([k, v]) => `${DAY_LABELS[k] ?? k} ${v}`)
    .join(" · ");
}

export default async function ReglagesPage() {
  const session = await getSessionOrg();
  const s = (session
    ? await getAgentSettings.withContext({ orgId: session.orgId })({})
    : null) as Settings;

  // Bibliothèque de prix : compte réel des ouvrages de l'organisation.
  let priceItemsCount = 0;
  if (session) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("price_items")
      .select("*", { count: "exact", head: true })
      .eq("org_id", session.orgId);
    priceItemsCount = count ?? 0;
  }

  const rows: { k: string; v: string; h: string }[] = [
    { k: "Nom annoncé", v: s?.announced_name || "—", h: "Suivi de la mention d'accueil automatique" },
    { k: "Métier", v: s?.trade || "—", h: "Détermine le questionnement et le vocabulaire" },
    {
      k: "Zone d'intervention",
      v: s?.zone_center ? `${s.zone_center} et ${s.zone_radius_km ?? 0} km alentour` : "—",
      h: "Au-delà, SWIPT refuse poliment et l'indique à l'appelant",
    },
    { k: "Horaires de rendez-vous", v: formatHours(s?.business_hours ?? null), h: "SWIPT ne propose rien en dehors" },
    { k: "Déclenchement", v: `Après ${s?.ring_count ?? 4} sonneries sans réponse`, h: "Votre téléphone sonne toujours en premier" },
    { k: "Forfait de déplacement", v: formatEuros(s?.callout_fee_cents ?? 0), h: "Annoncé systématiquement pendant l'appel" },
    { k: "Bibliothèque de prix", v: `${priceItemsCount} ouvrage${priceItemsCount > 1 ? "s" : ""} renseigné${priceItemsCount > 1 ? "s" : ""}`, h: "Base du chiffrage automatique des devis" },
    { k: "Urgences à transférer", v: s?.urgent_triggers?.join(" · ") || "—", h: "Alerte immédiate au lieu du résumé du soir" },
    { k: "Ce que SWIPT refuse", v: s?.refusal_rules?.join(" · ") || "—", h: "Vous ajoutez vos propres règles quand vous voulez" },
  ];

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Réglages de l&apos;agent</h1>
        <p className="mt-1 text-sm text-soft">
          Ce qui transforme un service générique en votre standard à vous.
        </p>
      </div>

      <div className="overflow-hidden rounded-[11px] border border-line">
        {rows.map((r) => (
          <div
            key={r.k}
            className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[210px_1fr] sm:items-baseline sm:gap-5"
          >
            <div className="text-[13.5px] text-soft">{r.k}</div>
            <div>
              <div className="text-[14.5px] font-medium">{r.v}</div>
              <div className="mt-0.5 text-[12.5px] text-soft">{r.h}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Données lues en direct depuis Supabase via{" "}
        <code className="font-mono text-faint">getAgentSettings</code> (RLS
        active) ; modification via{" "}
        <code className="font-mono text-faint">updateAgentSettings</code>.
      </p>
    </div>
  );
}
