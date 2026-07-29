import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Logo } from "@/components/Logo";
import { DemoCallModal } from "@/components/DemoCallModal";
import { FloatingHelp } from "@/components/FloatingHelp";
import { Testimonials } from "@/components/Testimonials";
import { HeroVisual } from "@/components/HeroVisual";
import { Reveal } from "@/components/Reveal";

const CAPABILITIES = [
  {
    t: "Elle décroche en 2 secondes",
    d: "Votre téléphone sonne quatre fois, puis Lia répond au nom de votre entreprise. Annoncée comme automatique. Transfert immédiat en cas d'urgence.",
  },
  {
    t: "Elle fixe le rendez-vous",
    d: "Lia consulte votre agenda, propose les créneaux libres, confirme par SMS. Refus poli si le chantier est hors de votre zone.",
  },
  {
    t: "Elle prépare le devis",
    d: "Chiffré depuis votre grille de prix. Vous validez d'un clic depuis votre téléphone. La facture suit automatiquement.",
  },
];

const VS_LEFT = [
  "1 400 € par mois",
  "Congés, absences, formation",
  "Présente de 9 h à 17 h",
  "Poste à pourvoir, à gérer",
];

const VS_RIGHT = [
  "99 € par mois",
  "Disponible 24 heures sur 24",
  "7 jours sur 7, week-ends compris",
  "Déployé en une heure",
];

const STEPS = [
  {
    t: "Configurez",
    d: "Une heure. Vos horaires, votre zone, votre grille de prix.",
  },
  {
    t: "Lia décroche",
    d: "Votre ligne sonne quatre fois, puis elle répond au nom de votre entreprise.",
  },
  {
    t: "Vous recevez tout",
    d: "Résumé, rendez-vous, devis. Sur votre téléphone. Vous ne touchez à rien.",
  },
];

const PLANS = [
  {
    n: "Solo",
    who: "Artisan seul",
    price: 99,
    feats: [
      "80 appels inclus",
      "Devis illimités",
      "1 utilisateur",
      "Prise de rendez-vous",
      "Relance des impayés",
    ],
  },
  {
    n: "Pro",
    who: "Jusqu'à 3 personnes",
    price: 199,
    top: true,
    feats: [
      "Appels illimités",
      "Devis illimités",
      "Jusqu'à 3 utilisateurs",
      "Planning partagé",
      "Relance des impayés",
      "Plusieurs zones d'intervention",
    ],
  },
];

const FAQ = [
  {
    q: "Mes clients savent-ils qu'ils parlent à une machine ?",
    a: "Oui. C'est annoncé dès le décroché, avec le nom de votre entreprise. Si l'appelant demande à vous parler, l'appel vous est transféré.",
  },
  {
    q: "Est-ce que je change de numéro ?",
    a: "Non. Un renvoi conditionnel est activé sur votre ligne : votre téléphone sonne normalement, et l'appel ne bascule qu'après quatre sonneries sans réponse.",
  },
  {
    q: "Et si c'est une urgence grave ?",
    a: "Fuite active, odeur de gaz, coupure de courant, personne bloquée : vous recevez une alerte immédiate, et l'appel peut vous être transféré directement.",
  },
  {
    q: "Combien de temps pour démarrer ?",
    a: "Environ une heure pour enregistrer votre zone, vos horaires et vos prix. AlloChantier décroche le soir même.",
  },
];

export default function Home() {
  return (
    <main className="bg-w">
      {/* 1 — Navbar */}
      <nav className="sticky top-0 z-50 border-b border-line bg-w/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#fonctionnalites" className="text-[14px] text-soft transition-colors hover:text-ink">Fonctionnalités</a>
            <a href="#tarifs" className="text-[14px] text-soft transition-colors hover:text-ink">Tarifs</a>
            <a href="#questions" className="text-[14px] text-soft transition-colors hover:text-ink">FAQ</a>
            <Link href="/login" className="text-[14px] text-soft transition-colors hover:text-ink">Se connecter</Link>
          </div>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-5 py-2 text-[14px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
          >
            Essai gratuit
          </Link>
        </div>
      </nav>

      {/* 2 — Hero */}
      <header className="flex min-h-[calc(100vh-65px)] items-center bg-w">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="text-center lg:text-left">
            <h1 className="ac-rise ac-d1 mx-auto max-w-[16ch] text-[clamp(44px,7vw,76px)] font-bold leading-[1.02] lg:mx-0">
              Vous ne perdez plus un seul appel.
            </h1>
            <p className="ac-rise ac-d2 mx-auto mt-7 max-w-[54ch] text-[20px] font-light leading-relaxed text-soft lg:mx-0">
              AlloChantier répond à votre place, qualifie vos clients et fixe vos rendez-vous. Vous
              recevez tout sur votre téléphone. Même à 21 heures, même le dimanche.
            </p>
            <div className="ac-rise ac-d3 mt-11">
              <Link
                href="/signup"
                className="inline-block rounded-full bg-ink px-8 py-4 text-[16px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
              >
                Démarrer mon essai
              </Link>
              <a
                href="#fonctionnement"
                className="mt-5 block text-[14px] text-faint transition-colors hover:text-soft"
              >
                Voir comment ça marche ↓
              </a>
            </div>
          </div>
          <div className="ac-rise ac-d3 flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>
      </header>

      {/* 3 — Ce qu'elle fait */}
      <section id="fonctionnalites" className="border-t border-line py-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="max-w-[18ch] text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Un seul outil. Zéro appel manqué.
          </h2>
          <div className="mt-16">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.t} delay={i * 100}>
                <div className={i > 0 ? "mt-20" : ""}>
                  <h3 className="text-[24px] font-semibold">{c.t}</h3>
                  <p className="mt-3 max-w-[62ch] text-[17px] font-light leading-relaxed text-soft">
                    {c.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Comparatif */}
      <section className="border-t border-line py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="max-w-[20ch] text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Moins cher qu&apos;une demi-journée de secrétaire.
          </h2>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 sm:gap-16">
            <Reveal>
              <div>
                <h3 className="text-[15px] font-medium text-faint">Assistante à mi-temps</h3>
                <ul className="mt-6 space-y-4">
                  {VS_LEFT.map((x) => (
                    <li key={x} className="border-b border-line pb-4 text-[17px] font-light text-faint">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <h3 className="text-[15px] font-medium text-ink">AlloChantier</h3>
                <ul className="mt-6 space-y-4">
                  {VS_RIGHT.map((x, i) => (
                    <li key={x} className="border-b border-line pb-4 text-[17px] font-light">
                      {i === 0 ? (
                        <span className="text-[36px] font-bold leading-none tracking-[-0.03em] text-or-t">
                          99 €
                          <span className="text-[15px] font-light text-soft"> par mois</span>
                        </span>
                      ) : (
                        x
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5 — Comment ça marche */}
      <section id="fonctionnement" className="border-t border-line py-32">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">Opérationnel ce soir.</h2>
          <ol className="mt-16 grid gap-12 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 110}>
                <li>
                  <div className="font-mono text-[76px] font-bold leading-[0.85] tracking-[-0.05em] text-line">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold">{s.t}</h3>
                  <p className="mt-2 text-[16px] font-light leading-relaxed text-soft">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-16 text-[14px] text-faint">
            Vous préférez l&apos;entendre d&apos;abord ?{" "}
            <DemoCallModal
              label="Écouter un appel de démonstration"
              className="text-ink underline underline-offset-4 transition-colors hover:text-or-t"
            />
          </p>
        </div>
      </section>

      {/* 6 — Calculateur */}
      <section id="calcul" className="border-t border-line py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="max-w-[20ch] text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Combien vous coûte un appel manqué ?
          </h2>
          <div className="mt-16">
            <Calculator />
          </div>
        </div>
      </section>

      {/* Témoignages — masqués tant qu'il n'y a pas de vrais clients */}
      <Testimonials />

      {/* 7 — Tarifs */}
      <section id="tarifs" className="border-t border-line py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Un tarif. Pas de surprise.
          </h2>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 sm:gap-0">
            {PLANS.map((p, i) => (
              <div key={p.n} className={i > 0 ? "sm:border-l sm:border-line2 sm:pl-16" : "sm:pr-16"}>
                <div className="flex items-center gap-3">
                  <h3 className="text-[20px] font-semibold">{p.n}</h3>
                  {p.top && (
                    <span className="rounded-full bg-or-wash px-3 py-1 text-[11.5px] font-medium text-or-t">
                      Recommandé
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] text-faint">{p.who}</p>
                <div className="mt-6 text-[48px] font-bold leading-none tracking-[-0.035em]">
                  {p.price} €
                  <span className="text-[15px] font-light text-soft"> /mois HT</span>
                </div>
                <ul className="mt-8 space-y-3.5">
                  {p.feats.map((f) => (
                    <li key={f} className="text-[16px] font-light text-soft">{f}</li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-10 inline-block rounded-full px-7 py-3.5 text-[15px] font-medium transition-colors duration-300 ${
                    p.top
                      ? "bg-ink text-w hover:bg-or-h"
                      : "border border-line2 text-ink hover:border-ink"
                  }`}
                >
                  Démarrer mon essai
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-16 max-w-[70ch] text-[14px] font-light leading-relaxed text-faint">
            Au-delà du forfait Solo : 0,79 € par appel traité, facturé le mois suivant — le service ne
            se coupe jamais. Sept jours d&apos;essai sans carte bancaire, sans engagement, résiliable
            au mois. Une offre Agence est disponible pour les équipes de plus de trois personnes.
          </p>
        </div>
      </section>

      {/* 8 — FAQ */}
      <section id="questions" className="border-t border-line py-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Les points sur lesquels on nous attend.
          </h2>
          <div className="mt-14">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 text-[18px] font-medium">
                  {f.q}
                  <span
                    className="shrink-0 text-[22px] font-light text-faint transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[68ch] pb-7 text-[16.5px] font-light leading-relaxed text-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — CTA final */}
      <section className="border-t border-line py-40 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-[clamp(40px,6.5vw,76px)] font-bold leading-[1.02]">
            Le prochain appel arrive.
          </h2>
          <p className="mt-5 text-[20px] font-light text-soft">Décidez qui décroche.</p>
          <Link
            href="/signup"
            className="mt-11 inline-block rounded-full bg-ink px-10 py-4 text-[16px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
          >
            Démarrer mon essai gratuit
          </Link>
          <p className="mt-5 text-[14px] text-faint">Sans engagement · Sans carte bancaire</p>
        </div>
      </section>

      {/* 10 — Footer */}
      <footer className="border-t border-line py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
          <Logo href={null} />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] text-faint">
            <a href="#tarifs" className="transition-colors hover:text-ink">Tarifs</a>
            <a href="#questions" className="transition-colors hover:text-ink">FAQ</a>
            <Link href="/mentions-legales" className="transition-colors hover:text-ink">Mentions légales</Link>
            <Link href="/cgv" className="transition-colors hover:text-ink">CGV</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-ink">Confidentialité</Link>
          </div>
          <p className="text-[14px] text-faint">Conçu en France</p>
        </div>
      </footer>

      <FloatingHelp phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
    </main>
  );
}
