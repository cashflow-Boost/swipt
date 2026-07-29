import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Logo } from "@/components/Logo";
import { DemoCallForm } from "@/components/DemoCallForm";
import { Testimonials } from "@/components/Testimonials";
import { Reveal } from "@/components/Reveal";

/** Coordonnées — à régler dans Vercel avant d'envoyer du trafic. */
const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contact@allochantier.com";

const TRADES = ["Plombiers", "Couvreurs", "Électriciens", "Menuisiers", "Peintres", "Maçons"];

const GAINS = [
  {
    t: "Vous ne quittez plus le chantier",
    d: "Plus besoin d'interrompre votre travail pour décrocher. Plus besoin de rappeler tout le monde le soir.",
  },
  {
    t: "Une réponse en 2 secondes, même à 20 h",
    d: "Lia répond au nom de votre entreprise pendant que vous travaillez. Vos clients ne tombent plus sur le répondeur.",
  },
  {
    t: "Aucun devis oublié",
    d: "Chiffré automatiquement depuis vos prix. Prêt à partir avant même que vous quittiez le chantier.",
  },
];

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

const STEPS = [
  { t: "Configurez", d: "Une heure. Vos horaires, votre zone, votre grille de prix." },
  { t: "Lia décroche", d: "Votre ligne sonne quatre fois, puis elle répond au nom de votre entreprise." },
  { t: "Vous recevez tout", d: "Résumé, rendez-vous, devis. Sur votre téléphone. Vous ne touchez à rien." },
];

const PLANS = [
  {
    n: "Solo",
    who: "Artisan seul",
    price: 99,
    cta: "Essai gratuit",
    feats: ["80 appels inclus", "Devis illimités", "1 utilisateur", "Prise de rendez-vous", "Relance des impayés"],
  },
  {
    n: "Pro",
    who: "Jusqu'à 3 personnes",
    price: 199,
    top: true,
    cta: "Essai gratuit",
    feats: [
      "Appels illimités",
      "Devis illimités",
      "Jusqu'à 3 utilisateurs",
      "Planning partagé",
      "Relance des impayés",
      "Plusieurs zones d'intervention",
    ],
  },
  {
    n: "Agence",
    who: "Équipe complète",
    price: 399,
    cta: "Nous contacter",
    href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Offre Agence — AlloChantier")}`,
    feats: [
      "Appels illimités",
      "Utilisateurs illimités",
      "Affectation automatique",
      "Rappel des devis sans réponse",
      "Interlocuteur dédié",
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

const WRAP = "mx-auto max-w-6xl px-6 md:px-8";
const H2 = "text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.1]";
const LEDE = "text-[19px] font-light leading-relaxed tracking-wide text-soft";

export default function Home() {
  return (
    <main className="bg-w">
      {/* 1 — Navbar */}
      <nav className="sticky top-0 z-50 border-b border-line bg-w/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-8">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#fonctionnalites" className="text-[14px] font-medium tracking-wide text-soft transition-colors hover:text-nv-2">Fonctionnalités</a>
            <a href="#tarifs" className="text-[14px] font-medium tracking-wide text-soft transition-colors hover:text-nv-2">Tarifs</a>
            <a href="#questions" className="text-[14px] font-medium tracking-wide text-soft transition-colors hover:text-nv-2">FAQ</a>
            <Link href="/login" className="text-[14px] font-medium tracking-wide text-soft transition-colors hover:text-nv-2">Se connecter</Link>
          </div>
          <Link
            href="/signup"
            className="rounded-full bg-or px-5 py-2 text-[14px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
          >
            Essai gratuit
          </Link>
        </div>
      </nav>

      {/* 2 — Hero */}
      <header className="flex min-h-[90vh] items-center bg-gradient-to-b from-w to-w3">
        <div className={`${WRAP} py-24 text-center`}>
          <span className="ac-rise ac-d0 mb-7 inline-block rounded-full bg-or-wash px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-or-t">
            L&apos;assistante des artisans
          </span>
          <h1 className="ac-rise ac-d1 mx-auto max-w-[16ch] text-[clamp(44px,7.5vw,76px)] font-bold leading-[1.04] tracking-tighter text-nv">
            Vous ne perdez plus un seul appel.
          </h1>
          <p className={`ac-rise ac-d2 mx-auto mt-7 max-w-2xl text-[20px] font-light leading-relaxed tracking-wide text-soft`}>
            AlloChantier répond à votre place, qualifie vos clients et fixe vos rendez-vous. Vous
            recevez tout sur votre téléphone. Même à 21 heures, même le dimanche.
          </p>
          <div className="ac-rise ac-d3">
            <Link
              href="/signup"
              className="mt-10 inline-block rounded-full bg-or px-10 py-4 text-[16px] font-medium text-w shadow-sh2 transition-all duration-300 hover:scale-[1.03] hover:bg-or-h"
            >
              Démarrer mon essai gratuit
            </Link>
            <p className="mt-4 text-[12px] tracking-wide text-faint">
              7 jours gratuits · Sans carte bancaire · Sans engagement
            </p>
          </div>
        </div>
      </header>

      {/* 3 — Métiers */}
      <section className="border-b border-line bg-w py-12">
        <div className={WRAP}>
          <p className="text-center text-[12px] uppercase tracking-[0.18em] text-faint">
            Conçu pour tous les artisans
          </p>
          <p className="mt-3 text-center text-[15px] font-light tracking-wide text-soft">
            {TRADES.join(" · ")}
          </p>
        </div>
      </section>

      {/* 4 — Ce que vous y gagnez */}
      <section className="bg-w py-24">
        <div className={WRAP}>
          <h2 className={`${H2} mx-auto max-w-[22ch] text-center`}>
            Votre assistant fait votre travail en moins de temps.
          </h2>
          <p className={`${LEDE} mx-auto mt-5 max-w-2xl text-center`}>
            Pendant que vous êtes sur le chantier, AlloChantier gère votre téléphone.
          </p>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {GAINS.map((g, i) => (
              <Reveal key={g.t} delay={i * 110}>
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-nv-wash text-[17px] font-bold text-nv-2">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold leading-snug">{g.t}</h3>
                  <p className="mt-2 text-[15px] font-light leading-relaxed tracking-wide text-soft">{g.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Fonctionnalités */}
      <section id="fonctionnalites" className="bg-w3 py-24">
        <div className={WRAP}>
          <h2 className={`${H2} text-center`}>Un seul outil. Zéro appel manqué.</h2>
          <div className="mx-auto mt-16 max-w-3xl">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.t} delay={i * 110}>
                <div className={i > 0 ? "mt-20" : ""}>
                  <h3 className="text-[24px] font-semibold tracking-tight">{c.t}</h3>
                  <p className="mt-3 text-[17px] font-light leading-relaxed tracking-wide text-soft">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Comment ça marche */}
      <section className="bg-w py-24">
        <div className={WRAP}>
          <h2 className={`${H2} text-center`}>Opérationnel ce soir.</h2>
          <ol className="mx-auto mt-16 grid max-w-5xl gap-14 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 110}>
                <li className="relative pt-10">
                  <span
                    className="pointer-events-none absolute -left-2 -top-1 select-none text-[clamp(72px,9vw,104px)] font-bold leading-none tracking-tighter text-line"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative text-[20px] font-semibold tracking-tight">{s.t}</h3>
                  <p className="relative mt-2 text-[15px] font-light leading-relaxed tracking-wide text-soft">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 — Démonstration */}
      <section className="bg-w3 py-24">
        <div className={`${WRAP} text-center`}>
          <h2 className={H2}>Vous préférez l&apos;entendre d&apos;abord ?</h2>
          <p className={`${LEDE} mx-auto mt-5 max-w-2xl`}>
            Laissez votre numéro : dès que la ligne de Lia est ouverte, elle vous appelle et vous
            jouez le client.
          </p>
          <DemoCallForm />
        </div>
      </section>

      {/* 8 — Calculateur */}
      <section id="calcul" className="border-t border-line bg-w py-24">
        <div className={WRAP}>
          <h2 className={`${H2} text-center`}>Combien vous coûte un appel manqué ?</h2>
          <div className="mx-auto mt-16 max-w-5xl">
            <Calculator />
          </div>
        </div>
      </section>

      {/* Témoignages — masqués tant qu'il n'y a pas de vrais clients */}
      <Testimonials />

      {/* 9 — Tarifs */}
      <section id="tarifs" className="bg-gradient-to-b from-w to-w3 py-24">
        <div className={WRAP}>
          <h2 className={`${H2} text-center`}>Un tarif. Pas de surprise.</h2>
          <div className="mx-auto mt-16 grid max-w-5xl items-start gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className={`rounded-lg bg-w p-8 transition-all duration-300 hover:-translate-y-1 ${
                  p.top
                    ? "border-2 border-or-line shadow-sh3 md:scale-[1.04]"
                    : "border border-line hover:shadow-sh2"
                }`}
              >
                {p.top && (
                  <span className="mb-4 inline-block rounded-full bg-or-wash px-4 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-or-t">
                    Recommandé
                  </span>
                )}
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{p.n}</h3>
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
                  href={p.href ?? "/signup"}
                  className={`mt-10 block rounded-full py-3 text-center text-[15px] font-medium transition-colors duration-300 ${
                    p.top
                      ? "bg-or text-w shadow-sh2 hover:bg-or-h"
                      : "border border-or text-or hover:bg-nv-wash"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-[68ch] text-center text-[14px] font-light tracking-wide text-faint">
            Au-delà du forfait Solo : 0,79 € par appel. Sept jours d&apos;essai sans carte bancaire,
            sans engagement.
          </p>
        </div>
      </section>

      {/* 10 — FAQ */}
      <section id="questions" className="border-t border-line bg-w py-24">
        <div className={WRAP}>
          <h2 className={`${H2} text-center`}>Les points sur lesquels on nous attend.</h2>
          <div className="mx-auto mt-14 max-w-3xl">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 text-[17px] font-medium text-nv">
                  {f.q}
                  <span
                    className="shrink-0 text-[22px] font-light text-faint transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[68ch] pb-7 text-[16px] font-light leading-relaxed tracking-wide text-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — CTA final */}
      <section className="bg-nv py-32 text-center">
        <div className={WRAP}>
          <h2 className="mx-auto max-w-[16ch] text-[clamp(40px,6.5vw,72px)] font-bold leading-[1.03] tracking-tighter text-w">
            Le prochain appel arrive.
          </h2>
          <p className="mt-4 text-[20px] font-light tracking-wide text-[#BFDBFE]">Décidez qui décroche.</p>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-full bg-w px-10 py-4 text-[17px] font-semibold text-nv transition-all duration-300 hover:scale-[1.03] hover:bg-or-h hover:text-w"
          >
            Démarrer mon essai gratuit
          </Link>
          <p className="mt-4 text-[14px] tracking-wide text-[#93C5FD]">
            Sans engagement · Sans carte bancaire · 7 jours gratuits
          </p>
        </div>
      </section>

      {/* 12 — Footer */}
      <footer className="border-t border-line bg-w py-16">
        <div className={WRAP}>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo href={null} />
              <p className="mt-3 max-w-[32ch] text-[14px] font-light leading-relaxed tracking-wide text-soft">
                L&apos;assistante qui décroche quand vous ne pouvez pas.
              </p>
            </div>
            <FooterCol title="Produit">
              <a href="#fonctionnalites" className="transition-colors hover:text-nv-2">Fonctionnalités</a>
              <a href="#tarifs" className="transition-colors hover:text-nv-2">Tarifs</a>
              <Link href="/signup" className="transition-colors hover:text-nv-2">Essai gratuit</Link>
            </FooterCol>
            <FooterCol title="Légal">
              <Link href="/cgv" className="transition-colors hover:text-nv-2">CGV</Link>
              <Link href="/mentions-legales" className="transition-colors hover:text-nv-2">Mentions légales</Link>
              <Link href="/confidentialite" className="transition-colors hover:text-nv-2">Politique de confidentialité</Link>
            </FooterCol>
            <FooterCol title="Contact">
              <a href={`mailto:${SUPPORT_EMAIL}`} className="transition-colors hover:text-nv-2">{SUPPORT_EMAIL}</a>
              {SUPPORT_PHONE && (
                <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="transition-colors hover:text-nv-2">
                  {SUPPORT_PHONE}
                </a>
              )}
            </FooterCol>
          </div>
          <p className="mt-12 border-t border-line pt-8 text-center text-[12px] tracking-wide text-faint">
            🇫🇷 Conçu en France · Support en français · Données hébergées en Europe
          </p>
        </div>
      </footer>
    </main>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold tracking-wide">{title}</h3>
      <div className="mt-3 flex flex-col gap-2 text-[14px] font-light tracking-wide text-soft">{children}</div>
    </div>
  );
}
