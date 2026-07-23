import { StatusTag, type TagVariant } from "@/components/StatusTag";

// File « à valider » : la seule qui demande l'attention de l'artisan (SPEC §4.3).
// Objectif produit : valider un devis en moins de 30 s sur mobile.
const TO_VALIDATE = [
  { n: "2411-12", ti: "Mme Réaux — fuite sous évier", sb: "Déplacement 45 € + siphon 120 € — TVA 10 %" },
  { n: "2411-11", ti: "M. Ferreira — salle de bain", sb: "Rénovation complète — TVA 10 %, 1 175 € HT" },
];
const SENT: { n: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { n: "2411-08", ti: "M. Lopes — robinet thermostatique", sb: "Envoyé il y a 5 jours — relancé automatiquement", tag: "Relancé", v: "or" },
  { n: "2411-07", ti: "Mme Kadri — WC suspendu", sb: "Envoyé il y a 2 jours", tag: "En attente", v: "neutral" },
];
const SIGNED: { n: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { n: "2411-05", ti: "M. Bourdin — entretien chaudière", sb: "Signé le 8 novembre — 189 € TTC", tag: "Facturé", v: "gr" },
  { n: "2411-04", ti: "Mme Trinh — cylindre de serrure", sb: "Signé le 6 novembre — 240 € TTC", tag: "Facturé", v: "gr" },
];

function Row({ n, ti, sb, right }: { n: string; ti: string; sb: string; right: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[84px_1fr_auto] sm:items-center sm:gap-4">
      <div className="font-mono text-[12.5px] text-faint">{n}</div>
      <div>
        <div className="text-[14.5px] font-[550]">{ti}</div>
        <div className="text-[13px] text-soft">{sb}</div>
      </div>
      <div className="sm:justify-self-end">{right}</div>
    </div>
  );
}

export default function DevisPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Devis</h1>
          <p className="mt-1 text-sm text-soft">
            Trois files. La première est la seule qui demande votre attention.
          </p>
        </div>
        <button type="button" className="rounded-pill border border-ink bg-ink px-3.5 py-2 text-[13.5px] font-semibold text-w">
          Nouveau devis
        </button>
      </div>

      {/* À valider — mise en avant */}
      <div className="mb-4 rounded-[11px] border border-or-line bg-or-wash p-4">
        <h2 className="mb-2.5 text-[15px] font-semibold text-or-t">
          À valider — 2 devis, 1 340 € au total
        </h2>
        <div className="overflow-hidden rounded-[10px] border border-or-line bg-w">
          {TO_VALIDATE.map((d) => (
            <Row
              key={d.n}
              {...d}
              right={
                <button type="button" className="rounded-pill border border-or bg-or px-3.5 py-2 text-[13px] font-semibold text-ink">
                  Valider et envoyer
                </button>
              }
            />
          ))}
        </div>
      </div>

      <h2 className="mb-2.5 mt-5 text-[15px] font-semibold">Envoyés — en attente de signature</h2>
      <div className="overflow-hidden rounded-[11px] border border-line">
        {SENT.map((d) => (
          <Row key={d.n} {...d} right={<StatusTag variant={d.v}>{d.tag}</StatusTag>} />
        ))}
      </div>

      <h2 className="mb-2.5 mt-5 text-[15px] font-semibold">Signés — prêts à facturer</h2>
      <div className="overflow-hidden rounded-[11px] border border-line">
        {SIGNED.map((d) => (
          <Row key={d.n} {...d} right={<StatusTag variant={d.v}>{d.tag}</StatusTag>} />
        ))}
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. Chiffrage et envoi via{" "}
        <code className="font-mono text-faint">createQuote</code> /{" "}
        <code className="font-mono text-faint">sendQuote</code> (TVA ligne par
        ligne, montants en centimes — <code className="font-mono text-faint">lib/actions/quotes.ts</code>).
      </p>
    </div>
  );
}
