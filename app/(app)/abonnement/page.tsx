const PLANS = [
  { n: "Solo", who: "Artisan seul", price: 99, feats: ["80 appels traités / mois", "Devis et factures illimités", "Relance des impayés"] },
  { n: "Pro", who: "2 à 3 personnes", price: 199, top: true, feats: ["Appels illimités", "3 utilisateurs", "Planning partagé", "Plusieurs zones"] },
  { n: "Agence", who: "Équipe complète", price: 399, feats: ["Appels illimités", "Utilisateurs illimités", "Affectation automatique", "Interlocuteur dédié"] },
];

export default function AbonnementPage() {
  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Abonnement</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-soft">
          Choisissez votre offre pour continuer après l&apos;essai — sans perdre votre compte ni vos données.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.n} className={`relative flex flex-col rounded-[14px] border bg-w p-6 ${p.top ? "border-or shadow-[0_0_0_1px_var(--or)]" : "border-line shadow-sh"}`}>
            {p.top && <span className="absolute -top-3 left-6 rounded-pill bg-or px-3 py-1 text-[11px] font-[650] text-w">Recommandé</span>}
            <div className="text-[17px] font-[650]">{p.n}</div>
            <div className="text-[14px] text-faint">{p.who}</div>
            <div className="mt-4 text-[34px] font-[650] tracking-[-0.035em]">{p.price} €<span className="text-[13px] font-[500] text-faint"> /mois HT</span></div>
            <ul className="mt-5 flex-1 space-y-2 text-[14px] text-soft">
              {p.feats.map((f) => <li key={f} className="flex gap-2 border-t border-line pt-2"><span className="text-or-t">✓</span>{f}</li>)}
            </ul>
            <button type="button" disabled className="mt-6 cursor-not-allowed rounded-pill border border-line2 bg-w2 px-4 py-2.5 text-center text-[14px] font-semibold text-soft">
              Choisir cette offre
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[11px] border border-or-line bg-or-wash p-4 text-[13.5px] text-or-t">
        💳 Le paiement (Stripe) est en cours de branchement. Dès qu&apos;il sera actif, ces boutons
        lanceront l&apos;abonnement — votre compte et vos données restent en place.
      </div>

      <p className="mt-4 text-[13px] text-soft">
        Au-delà du volume inclus dans Solo : 0,79 € par appel traité, facturé le mois suivant. Sans
        engagement, résiliable au mois.
      </p>
    </div>
  );
}
