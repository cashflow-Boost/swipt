import { StatusTag, type TagVariant } from "@/components/StatusTag";

// « Afficher ce que les relances ont rapporté » — le chiffre qui fait
// renouveler l'abonnement (SPEC §4.5).
const KPIS: { k: string; v: string; d: string; hot?: boolean }[] = [
  { k: "Relances envoyées", v: "14", d: "ce mois-ci, sans intervention" },
  { k: "Ont abouti", v: "6", d: "devis signés ou factures réglées" },
  { k: "Récupéré", v: "1 890 €", d: "qui seraient restés dormants", hot: true },
  { k: "Temps économisé", v: "≈ 2 h", d: "au tarif d'un appel par relance" },
];

const RULES: { k: string; v: string; h: string }[] = [
  { k: "Devis sans réponse", v: "Relance courtoise à J+5, puis J+12", h: "Deux relances maximum, puis le devis est classé sans suite" },
  { k: "Facture à échéance", v: "Rappel le jour de l'échéance, puis à J+7 et J+15", h: "Le ton se durcit progressivement ; vous validez le troisième envoi" },
  { k: "Client sans nouvelle depuis 6 mois", v: "Aucune relance", h: "Désactivé — vous ne voulez pas de démarchage" },
];

const HISTORY: { t: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { t: "Hier", ti: "Devis 2411-08 — M. Lopes", sb: "1ʳᵉ relance, J+5", tag: "Envoyée", v: "gr" },
  { t: "11 nov", ti: "Facture F-2410-19 — Mme Sauvage", sb: "2ᵉ relance, J+7", tag: "Sans réponse", v: "rd" },
  { t: "9 nov", ti: "Devis 2411-02 — M. Aubry", sb: "1ʳᵉ relance → signé le lendemain", tag: "A abouti", v: "gr" },
];

export default function RelancesPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Relances automatiques</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Ce qui est parti tout seul, et ce que ça a rapporté. Vous fixez les
            règles une fois.
          </p>
        </div>
        <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Modifier les règles
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
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
      <div className="overflow-hidden rounded-[11px] border border-line">
        {HISTORY.map((r) => (
          <div key={r.ti} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4">
            <div className="font-mono text-[12.5px] text-faint">{r.t}</div>
            <div>
              <div className="text-[14.5px] font-[550]">{r.ti}</div>
              <div className="text-[13px] text-soft">{r.sb}</div>
            </div>
            <div className="sm:justify-self-end"><StatusTag variant={r.v}>{r.tag}</StatusTag></div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. Envoi journalisé via{" "}
        <code className="font-mono text-faint">sendReminder</code> — le 3ᵉ rappel
        de facture exige la validation de l&apos;artisan (SPEC §4.5).
      </p>
    </div>
  );
}
