import { StatusTag, type TagVariant } from "@/components/StatusTag";

// Quatre indicateurs, pas plus (SPEC §4.7). Un seul en orange : celui qui
// demande une action. Données de référence jusqu'au branchement Supabase.
const KPIS: { k: string; v: string; d: string; hot?: boolean }[] = [
  { k: "Appels traités aujourd'hui", v: "7", d: "dont 2 hors zone, refusés poliment" },
  { k: "Rendez-vous posés", v: "3", d: "mercredi et jeudi" },
  { k: "Devis qui vous attendent", v: "2", d: "à valider — 1 340 € au total", hot: true },
  { k: "Argent qui dort", v: "2 180 €", d: "1 devis sans réponse, 1 facture en retard" },
];

const FEED: { t: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { t: "20:38", ti: "Mme Réaux — fuite sous évier", sb: "Rendez-vous mercredi 8 h – 10 h", tag: "Devis à valider", v: "or" },
  { t: "18:12", ti: "M. Bourdin — chaudière en sécurité", sb: "Rendez-vous jeudi 14 h", tag: "Traité", v: "gr" },
  { t: "17:04", ti: "Relance automatique", sb: "Devis n° 2411-08 — 5 jours sans réponse", tag: "Envoyée", v: "gr" },
  { t: "15:47", ti: "Mme Trinh — porte claquée", sb: "Urgence — appel transféré vers vous", tag: "Transféré", v: "rd" },
  { t: "11:20", ti: "Numéro masqué", sb: "Hors zone d'intervention (Mantes)", tag: "Refusé", v: "neutral" },
];

export default function TableauDeBordPage() {
  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Tableau de bord</h1>
        <p className="mt-1 max-w-[56ch] text-sm text-soft">
          Ce qui s&apos;est passé pendant que vous travailliez, et ce qui attend
          une décision de votre part.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.k} className="rounded-[11px] border border-line bg-w p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">
              {k.k}
            </div>
            <div
              className={`mt-1.5 text-[30px] font-[650] tracking-[-0.035em] ${k.hot ? "text-or-t" : ""}`}
            >
              {k.v}
            </div>
            <div className="mt-0.5 text-[12.5px] text-soft">{k.d}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-6 text-[15px] font-semibold">Derniers événements</h2>
      <div className="overflow-hidden rounded-[11px] border border-line">
        {FEED.map((r) => (
          <div
            key={r.t}
            className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4"
          >
            <div className="font-mono text-[12.5px] text-faint">{r.t}</div>
            <div>
              <div className="text-[14.5px] font-[550]">{r.ti}</div>
              <div className="text-[13px] text-soft">{r.sb}</div>
            </div>
            <div className="sm:justify-self-end">
              <StatusTag variant={r.v}>{r.tag}</StatusTag>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
