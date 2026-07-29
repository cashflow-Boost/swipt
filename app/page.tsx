import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Logo } from "@/components/Logo";
import { DemoCallModal } from "@/components/DemoCallModal";
import { FloatingHelp } from "@/components/FloatingHelp";
import { Testimonials } from "@/components/Testimonials";
import { HeroVisual } from "@/components/HeroVisual";
import { Reveal } from "@/components/Reveal";

const TRADES = [
  { e: "🔧", n: "Plombiers" },
  { e: "🏠", n: "Couvreurs" },
  { e: "⚡", n: "Électriciens" },
  { e: "🪚", n: "Menuisiers" },
  { e: "🎨", n: "Peintres" },
];

const BENEFITS = [
  {
    e: "📞",
    t: "Elle décroche",
    d: "En moins de 2 secondes, 24 h/24. Annoncée comme automatique. Transfert si urgence.",
  },
  {
    e: "📅",
    t: "Elle organise",
    d: "Rendez-vous posés dans votre agenda. Confirmation SMS. Refus poli hors-zone.",
  },
  {
    e: "💶",
    t: "Elle facture",
    d: "Devis chiffré depuis vos prix. Validation au doigt. Facture Factur-X. Relance impayés.",
  },
  {
    e: "🔔",
    t: "Elle relance",
    d: "Vos clients reçoivent le devis par message. Relance automatique si pas de réponse.",
  },
];

const VS_LEFT = [
  "1 400 € par mois",
  "Congés payés à financer",
  "Arrêts maladie",
  "Présente de 9 h à 17 h seulement",
  "Formation à assurer",
];

const VS_RIGHT = [
  "Dès 99 € par mois",
  "Jamais de congés",
  "Jamais malade",
  "Disponible 24 h/24, 7 j/7",
  "Aucune formation",
];

const STEPS = [
  {
    e: "⚙️",
    t: "Configurez",
    d: "Une heure. Vos horaires, votre zone, vos prix. AlloChantier décroche le soir même.",
  },
  {
    e: "🎧",
    t: "Lia décroche",
    d: "Votre téléphone sonne quatre fois, puis Lia répond au nom de votre entreprise.",
  },
  {
    e: "💬",
    t: "Vous recevez tout",
    d: "Résumé, rendez-vous, devis. Directement sur votre téléphone. Vous ne touchez à rien.",
  },
];

const PLANS = [
  {
    n: "Solo",
    who: "Artisan seul",
    price: 99,
    feats: ["80 appels traités / mois", "Devis illimités", "Prise de rendez-vous", "Relance des impayés"],
  },
  {
    n: "Pro",
    who: "2 à 3 personnes",
    price: 199,
    top: true,
    feats: ["Appels illimités", "3 utilisateurs", "Planning partagé", "Plusieurs zones d'intervention"],
  },
  {
    n: "Agence",
    who: "Équipe complète",
    price: 399,
    feats: ["Appels illimités", "Utilisateurs illimités", "Affectation automatique", "Interlocuteur dédié"],
  },
];

const FAQ = [
  {
    q: "Mes clients savent-ils qu'ils parlent à une machine ?",
    a: "Oui — c'est annoncé dès le décroché, avec le nom de votre entreprise. Si l'appelant demande à vous parler, l'appel vous est transféré.",
  },
  {
    q: "Est-ce que je change de numéro ?",
    a: "Non. Un renvoi conditionnel est activé sur votre ligne : votre téléphone sonne normalement, et l'appel ne bascule sur AlloChantier qu'après quatre sonneries sans réponse.",
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
      <nav className="sticky top-0 z-50 border-b border-line bg-w/95 shadow-sh backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Logo />
          <div className="hidden items-center gap-7 md:flex">
            <a href="#fonctionnalites" className="text-[14.5px] font-medium text-soft transition-colors hover:text-nv">Fonctionnalités</a>
            <a href="#tarifs" className="text-[14.5px] font-medium text-soft transition-colors hover:text-nv">Tarifs</a>
            <a href="#questions" className="text-[14.5px] font-medium text-soft transition-colors hover:text-nv">FAQ</a>
            <Link href="/login" className="text-[14.5px] font-medium text-soft transition-colors hover:text-nv">Se connecter</Link>
          </div>
          <Link
            href="/signup"
            className="rounded-full bg-or px-5 py-2.5 text-[14px] font-semibold text-w transition-all duration-300 hover:bg-or-h"
          >
            Essai gratuit
          </Link>
        </div>
      </nav>

      {/* 2 — Hero */}
      <header className="bg-w">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr]">
          <div className="text-center lg:text-left">
            <h1 className="ac-rise ac-d1 mx-auto max-w-[15ch] text-[clamp(38px,6.5vw,60px)] font-bold leading-[1.03] tracking-[-0.035em] lg:mx-0">
              Ne perdez plus un seul appel
            </h1>
            <p className="ac-rise ac-d2 mx-auto mt-6 max-w-[52ch] text-[19px] leading-relaxed text-soft lg:mx-0">
              AlloChantier, c&apos;est votre secrétaire téléphonique intelligente. Elle décroche à votre
              place, fixe vos rendez-vous et prépare vos devis. Même le week-end.
            </p>
            <div className="ac-rise ac-d3 mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/signup"
                className="w-full rounded-full bg-or px-8 py-4 text-center text-[17px] font-semibold text-w shadow-[0_8px_24px_-8px_rgba(255,107,53,.7)] transition-all duration-300 hover:bg-or-h hover:shadow-[0_10px_30px_-8px_rgba(255,107,53,.85)] sm:w-auto"
              >
                🚀 Essai gratuit 7 jours
              </Link>
              <DemoCallModal className="w-full rounded-full border border-line2 bg-w px-8 py-4 text-[17px] font-semibold text-nv transition-all duration-300 hover:border-nv sm:w-auto" />
            </div>
            <p className="ac-rise ac-d3 mt-5 text-[14px] text-faint">
              Sans engagement · Sans carte bancaire
            </p>
          </div>
          <div className="ac-rise ac-d2 flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>
      </header>

      {/* 3 — Métiers couverts */}
      <section className="bg-nv-wash py-10">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Pensé pour tous les métiers du bâtiment
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {TRADES.map((t) => (
              <li key={t.n} className="flex items-center gap-2.5 text-[15px] font-[600] text-nv">
                <span className="text-[22px]" aria-hidden="true">{t.e}</span>
                {t.n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 — Bénéfices */}
      <section id="fonctionnalites" className="bg-w py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="mx-auto max-w-[22ch] text-[clamp(28px,4.4vw,42px)] font-bold tracking-[-0.03em]">
              Un seul outil, de la sonnerie à la facture payée
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-[17px] text-soft">
              AlloChantier remplace votre secrétaire, votre agenda et votre logiciel de devis.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.t} delay={i * 90}>
                <div className="h-full rounded-2xl border border-line bg-w p-8 transition-shadow duration-300 hover:shadow-sh3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-or-wash text-[24px]" aria-hidden="true">
                    {b.e}
                  </div>
                  <h3 className="mt-5 text-[17px] font-bold">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-soft">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Comparatif */}
      <section className="bg-nv-wash py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="text-[clamp(28px,4.4vw,42px)] font-bold tracking-[-0.03em]">
              Pourquoi choisir AlloChantier ?
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[17px] text-soft">
              Le bon point de comparaison n&apos;est pas un logiciel. C&apos;est un poste.
            </p>
          </div>
          <div className="mt-14 grid items-start gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-line2 bg-w/60 p-8 opacity-70">
                <h3 className="text-[18px] font-bold text-soft">Assistante à mi-temps</h3>
                <ul className="mt-5 space-y-3.5 text-[15px] text-soft">
                  {VS_LEFT.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="text-rd" aria-hidden="true">✕</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative rounded-2xl border-2 border-or bg-w p-8 shadow-sh3">
                <span className="absolute -top-3.5 left-8 rounded-full bg-or px-3.5 py-1 text-[11.5px] font-bold text-w">
                  Recommandé
                </span>
                <h3 className="text-[18px] font-bold">AlloChantier</h3>
                <ul className="mt-5 space-y-3.5 text-[15px] text-soft">
                  {VS_RIGHT.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="text-gr" aria-hidden="true">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — Comment ça marche */}
      <section className="bg-w py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-[clamp(28px,4.4vw,42px)] font-bold tracking-[-0.03em]">Comment ça marche ?</h2>
            <p className="mt-4 text-[17px] text-soft">Trois étapes, zéro effort technique.</p>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 120}>
                <li className="h-full rounded-2xl border border-line bg-w p-8 transition-shadow duration-300 hover:shadow-sh3">
                  <div className="font-mono text-[38px] font-bold leading-none tracking-[-0.03em] text-line2">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-4 text-[28px]" aria-hidden="true">{s.e}</div>
                  <h3 className="mt-3 text-[18px] font-bold">{s.t}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-soft">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 — Calculateur */}
      <section id="calcul" className="bg-nv py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="mx-auto max-w-[24ch] text-[clamp(28px,4.4vw,42px)] font-bold tracking-[-0.03em] text-w">
              Combien vous coûtent vos appels manqués ?
            </h2>
            <p className="mx-auto mt-4 max-w-[50ch] text-[17px] text-[#B8C6D6]">
              Réglez vos trois chiffres : le calcul s&apos;affiche ligne par ligne, vous pouvez
              contester chaque étape.
            </p>
          </div>
          <div className="mt-12">
            <Calculator />
          </div>
        </div>
      </section>

      {/* Témoignages — masqués tant qu'il n'y a pas de vrais clients */}
      <Testimonials />

      {/* 8 — Tarifs */}
      <section id="tarifs" className="bg-w py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-[clamp(28px,4.4vw,42px)] font-bold tracking-[-0.03em]">
              Un tarif clair, sans engagement
            </h2>
          </div>
          <div className="mt-14 grid items-center gap-8 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className={`relative flex flex-col rounded-2xl border bg-w transition-all duration-300 hover:scale-105 ${
                  p.top
                    ? "border-2 border-or p-9 shadow-sh3 md:-my-4"
                    : "border-line p-8 shadow-sh2"
                }`}
              >
                {p.top && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-or px-3.5 py-1 text-[11.5px] font-bold text-w">
                    Recommandé
                  </span>
                )}
                <div className="text-[18px] font-bold">{p.n}</div>
                <div className="text-[14px] text-faint">{p.who}</div>
                <div className="mt-5 text-[clamp(34px,5vw,42px)] font-bold leading-none tracking-[-0.035em]">
                  {p.price} €
                  <span className="text-[14px] font-medium text-faint"> /mois HT</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3 text-[14.5px] text-soft">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="text-or" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 rounded-full px-5 py-3.5 text-center text-[15px] font-semibold transition-all duration-300 ${
                    p.top
                      ? "bg-or text-w hover:bg-or-h"
                      : "border border-line2 text-nv hover:border-nv"
                  }`}
                >
                  Essai gratuit 7 jours
                </Link>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-faint">
                  <LockIcon /> Paiement sécurisé par Stripe
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-[64ch] text-center text-[13.5px] text-faint">
            Au-delà du forfait Solo : 0,79 € par appel traité, facturé le mois suivant — le service ne
            se coupe jamais. Sans engagement, résiliable au mois.
          </p>
        </div>
      </section>

      {/* 9 — FAQ */}
      <section id="questions" className="bg-nv-wash py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-[clamp(28px,4.4vw,42px)] font-bold tracking-[-0.03em]">
            Les points sur lesquels on nous attend
          </h2>
          <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-w">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-b border-line last:border-b-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[16px] font-[600] text-nv">
                  {f.q}
                  <span className="shrink-0 text-[20px] font-normal text-faint transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="max-w-[68ch] px-6 pb-5 text-[15px] leading-relaxed text-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — CTA final */}
      <section className="bg-or py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-[clamp(30px,5vw,46px)] font-bold leading-tight tracking-[-0.035em] text-w">
            Le prochain appel arrive.
          </h2>
          <p className="mt-2 text-[clamp(20px,3vw,26px)] font-[600] text-w/85">Décidez qui décroche.</p>
          <Link
            href="/signup"
            className="mt-9 inline-block rounded-full bg-w px-8 py-4 text-[17px] font-bold text-or-t shadow-sh2 transition-all duration-300 hover:scale-105"
          >
            Essai gratuit 7 jours
          </Link>
          <p className="mt-5 text-[14px] text-w/80">Sans engagement · Sans carte bancaire</p>
        </div>
      </section>

      {/* 11 — Footer */}
      <footer className="bg-nv px-6 py-14 text-[#B8C6D6]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Logo href={null} dark />
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px]">
            <a href="#fonctionnalites" className="transition-colors hover:text-w">Fonctionnalités</a>
            <a href="#tarifs" className="transition-colors hover:text-w">Tarifs</a>
            <a href="#questions" className="transition-colors hover:text-w">FAQ</a>
            <Link href="/mentions-legales" className="transition-colors hover:text-w">Mentions légales</Link>
            <Link href="/cgv" className="transition-colors hover:text-w">CGV</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-w">Confidentialité</Link>
          </div>
          <p className="rounded-full border border-[#33517A] px-4 py-2 text-[13px]">
            🇫🇷 Conçu en France · Support en français · Données hébergées en Europe
          </p>
          <p className="text-[12.5px] text-[#7E96B3]">© 2026 AlloChantier</p>
        </div>
      </footer>

      <FloatingHelp phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
    </main>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
