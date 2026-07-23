import { StatusTag, type TagVariant } from "@/components/StatusTag";

const KPIS: { k: string; v: string; d: string; hot?: boolean }[] = [
  { k: "Encaissé ce mois", v: "3 420 €", d: "6 factures réglées" },
  { k: "En attente", v: "890 €", d: "2 factures dans les délais" },
  { k: "En retard", v: "640 €", d: "1 facture — relancée 2 fois", hot: true },
  { k: "Format", v: "Factur-X", d: "via plateforme agréée" },
];

const ROWS: { n: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { n: "F-2411-06", ti: "M. Bourdin — entretien chaudière", sb: "Émise le 9 nov — 189 € TTC", tag: "Payée", v: "gr" },
  { n: "F-2411-05", ti: "Mme Trinh — cylindre", sb: "Émise le 7 nov — 240 € TTC", tag: "Payée", v: "gr" },
  { n: "F-2411-04", ti: "M. Ferreira — acompte chantier", sb: "Échéance le 20 nov — 890 € TTC", tag: "En attente", v: "neutral" },
  { n: "F-2410-19", ti: "Mme Sauvage — débouchage", sb: "Échéance dépassée de 12 jours — 640 € TTC", tag: "En retard", v: "rd" },
];

export default function FacturesPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Factures</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Elles découlent du devis signé. Format Factur-X, conforme à
            l&apos;échéance de septembre 2026.
          </p>
        </div>
        <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Exporter pour le comptable
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

      <div className="overflow-hidden rounded-[11px] border border-line">
        {ROWS.map((r) => (
          <div key={r.n} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[92px_1fr_auto] sm:items-center sm:gap-4">
            <div className="font-mono text-[12.5px] text-faint">{r.n}</div>
            <div>
              <div className="text-[14.5px] font-[550]">{r.ti}</div>
              <div className="text-[13px] text-soft">{r.sb}</div>
            </div>
            <div className="sm:justify-self-end"><StatusTag variant={r.v}>{r.tag}</StatusTag></div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. Émission Factur-X et statut de paiement via{" "}
        <code className="font-mono text-faint">markPaid</code>{" "}
        (<code className="font-mono text-faint">lib/actions/invoices.ts</code>) ;
        contrôle des mentions obligatoires avant envoi (SPEC §8).
      </p>
    </div>
  );
}
