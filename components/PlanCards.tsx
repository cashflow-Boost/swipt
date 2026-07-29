import Link from "next/link";
import { PLANS } from "@/lib/plans";

/**
 * Les trois offres. `href` décide de la destination : l'essai gratuit depuis
 * la landing, le tunnel d'achat depuis /tarifs.
 */
export function PlanCards({ mode = "trial" }: { mode?: "trial" | "checkout" }) {
  return (
    <>
      <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-3">
        {PLANS.map((p) => {
          const top = "top" in p && p.top;
          return (
            <div
              key={p.id}
              className={`ac-card rounded-lg bg-w p-8 ${
                top ? "border-2 border-or-line shadow-sh3 md:scale-[1.04]" : "border border-line"
              }`}
            >
              {top && (
                <span className="mb-4 inline-block rounded-full bg-or-wash px-4 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-or-t">
                  Recommandé
                </span>
              )}
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{p.name}</h3>
              <p className="mt-1 text-[14px] font-light text-soft">{p.who}</p>
              <div className="mt-6 text-[48px] font-bold leading-none tracking-tighter text-nv">
                {p.price} €<span className="text-[14px] font-light tracking-normal text-faint"> /mois HT</span>
              </div>
              <ul className="mt-8 space-y-3">
                {p.feats.map((f) => (
                  <li key={f} className="text-[15px] font-light tracking-wide text-soft">{f}</li>
                ))}
              </ul>
              <Link
                href={mode === "checkout" ? `/checkout?plan=${p.id}` : "/signup"}
                className={`mt-10 block rounded-full py-3 text-center text-[15px] font-medium transition-colors duration-300 ${
                  top ? "bg-or text-w hover:bg-or-h" : "border border-or text-or hover:bg-nv-wash"
                }`}
              >
                {mode === "checkout" ? "Choisir cette offre" : p.cta}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mx-auto mt-8 max-w-[68ch] text-center text-[14px] font-light tracking-wide text-faint">
        Au-delà du forfait Solo : 0,79 € par appel. Sept jours d&apos;essai sans carte bancaire, sans
        engagement.
      </p>
    </>
  );
}
