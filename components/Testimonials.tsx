/**
 * Témoignages clients.
 *
 * ⚠ VOLONTAIREMENT VIDE. Publier de faux avis (nom, métier, ville, résultat
 * chiffré inventés) sur un site marchand est une pratique commerciale
 * trompeuse — art. L121-2 et L132-2 du Code de la consommation : jusqu'à
 * 300 000 € d'amende et 2 ans d'emprisonnement, portés à 10 % du chiffre
 * d'affaires pour une personne morale.
 *
 * Dès que vous avez de vrais clients : demandez-leur un accord écrit, puis
 * ajoutez-les ci-dessous. La section apparaît toute seule.
 *
 *   const TESTIMONIALS: Testimonial[] = [
 *     { name: "…", trade: "…", city: "…", quote: "…", result: "…" },
 *   ];
 */

type Testimonial = {
  name: string;
  trade: string;
  city: string;
  quote: string;
  /** Résultat chiffré — uniquement s'il est vérifiable et attesté par le client. */
  result?: string;
};

const TESTIMONIALS: Testimonial[] = [];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="temoignages" className="border-b border-line bg-w2 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Témoignages</div>
          <h2 className="mx-auto mt-3 max-w-[20ch] text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
            Ils ne perdent plus d&apos;appels
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-lg border border-line bg-w p-6 shadow-sh">
              {t.result && (
                <div className="mb-3 inline-flex self-start rounded-pill bg-gr-wash px-3 py-1 text-[13px] font-[650] text-gr">
                  {t.result}
                </div>
              )}
              <blockquote className="flex-1 text-[15px] text-soft">« {t.quote} »</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nv-wash text-[13px] font-[680] text-nv">
                  {initials(t.name)}
                </span>
                <span className="text-[13.5px]">
                  <span className="block font-[600] text-ink">{t.name}</span>
                  <span className="block text-faint">
                    {t.trade} à {t.city}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
