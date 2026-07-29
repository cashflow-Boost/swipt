import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PlanCards } from "@/components/PlanCards";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Solo 99 €, Pro 199 €, Agence 399 € par mois. Sept jours d'essai sans carte bancaire.",
};

export default function TarifsPage() {
  return (
    <main className="bg-w">
      <nav className="sticky top-0 z-50 border-b border-line bg-w/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-8">
          <Logo />
          <Link href="/signup" className="rounded-full bg-or px-5 py-2 text-[14px] font-medium text-w transition-colors duration-300 hover:bg-or-h">
            Essai gratuit
          </Link>
        </div>
      </nav>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h1 className="text-center text-[clamp(36px,5.5vw,56px)] font-bold leading-[1.06] tracking-tighter">
            Un tarif. Pas de surprise.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[19px] font-light leading-relaxed tracking-wide text-soft">
            Sept jours pour essayer, sans carte bancaire. Vous choisissez votre offre seulement
            ensuite.
          </p>
          <div className="mt-16">
            <PlanCards mode="checkout" />
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center text-[13px] text-faint">
        <Link href="/" className="transition-colors hover:text-nv">← Retour à l&apos;accueil</Link>
      </footer>
    </main>
  );
}
