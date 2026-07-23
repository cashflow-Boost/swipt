import { StatusTag, type TagVariant } from "@/components/StatusTag";
import { getReminders } from "@/lib/data";

const OUTCOME: Record<string, { label: string; v: TagVariant }> = {
  pending: { label: "Envoyée", v: "neutral" },
  converted: { label: "A abouti", v: "gr" },
  no_reply: { label: "Sans réponse", v: "rd" },
};

const RULES: { k: string; v: string; h: string }[] = [
  { k: "Devis sans réponse", v: "Relance à J+5, puis J+12", h: "Deux relances maximum, puis classé sans suite" },
  { k: "Facture à échéance", v: "Rappel à l'échéance, puis J+7 et J+15", h: "Le 3ᵉ envoi requiert votre validation" },
];

export default async function RelancesPage() {
  const reminders = await getReminders();
  const sent = reminders.length;
  const converted = reminders.filter((r) => r.outcome === "converted").length;

  const kpis: { k: string; v: string; d: string; hot?: boolean }[] = [
    { k: "Relances envoyées", v: String(sent), d: "sans intervention" },
    { k: "Ont abouti", v: String(converted), d: "devis signés ou factures réglées" },
    { k: "En attente", v: String(reminders.filter((r) => r.outcome === "pending").length), d: "réponse attendue", hot: true },
    { k: "Sans réponse", v: String(reminders.filter((r) => r.outcome === "no_reply").length), d: "à escalader" },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Relances automatiques</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Ce qui est parti tout seul, et ce que ça a rapporté. Vous fixez les règles une fois.
          </p>
        </div>
        <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Modifier les règles
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.k} className="rounded-[11px] border border-line bg-w p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">{k.k}</div>
            <div className={`mt-1.5 text-[30px] font-[650] tracking-[-0.035em] ${k.hot ? "text-or-t" : ""}`}>{k.v}</div>
            <div className="mt-0.5 text-[12.5px] text-soft">{k.d}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-2.5 text-[15px] font-semibold">Règles actives</h2>
      <div className="mb-5 overflow-hidden rounded-[11px] border border-line">
        {RULES.map((r) => (
          <div key={r.k} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-5">
            <div className="text-[13.5px] text-soft">{r.k}</div>
            <div>
              <div className="text-[14.5px] font-medium">{r.v}</div>
              <div className="mt-0.5 text-[12.5px] text-soft">{r.h}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-2.5 text-[15px] font-semibold">Historique récent</h2>
      {reminders.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-8 text-center text-sm text-soft">Aucune relance envoyée.</p>
      ) : (
        <div className="overflow-hidden rounded-[11px] border border-line">
          {reminders.map((r) => {
            const o = OUTCOME[r.outcome ?? "pending"] ?? OUTCOME.pending;
            return (
              <div key={r.id} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:gap-4">
                <div className="font-mono text-[12.5px] text-faint">
                  {r.sentAt ? new Date(r.sentAt).toLocaleDateString("fr-FR") : "—"}
                </div>
                <div>
                  <div className="text-[14.5px] font-[550]">{r.targetType === "quote" ? "Devis" : "Facture"}</div>
                  <div className="text-[13px] text-soft">Relance n° {r.sequenceIndex + 1}</div>
                </div>
                <div className="sm:justify-self-end"><StatusTag variant={o.v}>{o.label}</StatusTag></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
