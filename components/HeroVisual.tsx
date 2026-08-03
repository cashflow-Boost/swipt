/**
 * Maquette produit du hero — ce que l'artisan reçoit après un appel pris par
 * Sonia. Pas une illustration : l'interface réelle, en filets fins et texte, dans
 * la même palette que la page.
 */
export function HeroVisual() {
  return (
    <div className="w-full max-w-[300px] select-none" aria-hidden="true">
      <div className="rounded-[28px] border border-line2 p-2.5">
        <div className="rounded-[20px] border border-line px-5 py-6">
          <div className="mx-auto h-1 w-9 rounded-full bg-line2" />

          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Appel traité · 19 h 04
          </p>

          <p className="mt-4 text-[15px] font-semibold leading-snug">Mme Dupont</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-soft">
            Fuite sous l&apos;évier, cuisine.
            <br />
            14 rue des Lilas, Poissy.
          </p>

          <div className="mt-6 border-t border-line pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-soft">Rendez-vous</span>
              <span className="font-mono text-[13px] font-medium">Jeudi 9 h 00</span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-soft">Devis</span>
              <span className="font-mono text-[13px] font-medium">185,00 €</span>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <span className="text-[12.5px] font-medium text-or-t">Confirmé par SMS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
