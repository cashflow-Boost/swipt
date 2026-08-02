import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { planById } from "@/lib/plans";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Souscription",
  description: "Récapitulatif de votre offre Gildra avant paiement.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planId } = await searchParams;
  const plan = planById(planId);
  if (!plan) notFound();

  return (
    <main className="min-h-screen bg-w">
      <nav className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-6 py-4">
          <Logo />
          <Link href="/tarifs" className="text-[14px] text-soft transition-colors hover:text-nv">
            ← Changer d&apos;offre
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-[clamp(30px,4.5vw,44px)] font-bold leading-[1.08] tracking-tighter">
          Votre offre {plan.name}
        </h1>

        <div className="mt-10 rounded-lg border border-line p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{plan.name}</p>
              <p className="mt-1 text-[14px] font-light text-soft">{plan.who}</p>
            </div>
            <div className="text-[40px] font-bold leading-none tracking-tighter text-nv">
              {plan.price} €<span className="text-[14px] font-light tracking-normal text-faint"> /mois HT</span>
            </div>
          </div>

          <ul className="mt-6 space-y-2.5">
            {plan.feats.map((f) => (
              <li key={f} className="text-[15px] font-light tracking-wide text-soft">{f}</li>
            ))}
          </ul>

          <div className="mt-6 rounded-[10px] bg-or-wash px-4 py-3 text-[13.5px] text-or-t">
            Vos 7 premiers appels sont offerts. Rien n&apos;est prélevé aujourd&apos;hui, et aucun
            abonnement ne démarre automatiquement à la fin de l&apos;essai.
          </div>
        </div>

        <CheckoutForm planId={plan.id} />
      </div>
    </main>
  );
}
