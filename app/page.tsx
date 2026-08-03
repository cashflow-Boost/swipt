import Link from "next/link";
import { Wrench, Zap, Flame, KeyRound, Grid3x3, PaintRoller, HardHat, Hammer } from "lucide-react";
import { Calculator } from "@/components/Calculator";
import { Logo } from "@/components/Logo";
import { HeroPhone } from "@/components/HeroPhone";
import { Testimonials } from "@/components/Testimonials";
import { Reveal } from "@/components/Reveal";
import { LandingNav } from "@/components/LandingNav";
import { PlanCards } from "@/components/PlanCards";

/** Coordonnées — à régler dans Vercel avant d'envoyer du trafic. */
const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contact@gildra.fr";

const TRADES = [
  { icon: Wrench, label: "Plombier" },
  { icon: Zap, label: "Électricien" },
  { icon: Flame, label: "Chauffagiste" },
  { icon: KeyRound, label: "Serrurier" },
  { icon: Grid3x3, label: "Carreleur" },
  { icon: PaintRoller, label: "Peintre" },
  { icon: HardHat, label: "Couvreur" },
  { icon: Hammer, label: "Menuisier" },
];

const GAINS = [
  {
    n: "6 h",
    t: "gagnées par semaine",
    d: "Plus d'interruption sur le chantier, plus de rappels à passer le soir.",
  },
  {
    n: "3×",
    t: "plus de rendez-vous fixés",
    d: "Sonia répond en 2 secondes, même à 20 h. Vos clients ne raccrochent plus.",
  },
  {
    n: "0",
    t: "devis oublié",
    d: "Chiffré automatiquement depuis vos prix, prêt avant que vous quittiez le chantier.",
  },
];

const CAPABILITIES = [
  {
    t: "Elle décroche en 2 secondes",
    d: "Votre téléphone sonne quatre fois, puis Sonia répond au nom de votre entreprise. Annoncée comme automatique. Transfert immédiat en cas d'urgence.",
  },
  {
    t: "Elle fixe le rendez-vous",
    d: "Sonia consulte votre agenda, propose les créneaux libres, confirme par SMS. Refus poli si le chantier est hors de votre zone.",
  },
  {
    t: "Elle prépare le devis",
    d: "Chiffré depuis votre grille de prix. Vous validez d'un clic depuis votre téléphone. La facture suit automatiquement.",
  },
];

const STEPS = [
  { t: "Configurez", d: "Une heure. Vos horaires, votre zone, votre grille de prix." },
  { t: "Sonia décroche", d: "Votre ligne sonne quatre fois, puis elle répond au nom de votre entreprise." },
  { t: "Vous recevez tout", d: "Résumé, rendez-vous, devis. Sur votre téléphone. Vous ne touchez à rien." },
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
    a: "Environ une heure pour enregistrer votre zone, vos horaires et vos prix. Gildra décroche le soir même.",
  },
];

const WRAP = "mx-auto max-w-6xl px-6 md:px-8";
const H2 = "text-[clamp(32px,5vw,48px)] font-semibold tracking-tight leading-[1.1]";
const LEDE = "text-[19px] font-light leading-relaxed tracking-wide text-soft";

export default function Home() {
  return (
    <main className="bg-w">
      <LandingNav />

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-w to-wood-wash">
        <div className={`${WRAP} grid items-center gap-12 py-16 md:grid-cols-[1.05fr_.95fr] md:gap-8 md:py-24`}>
          {/* Colonne texte */}
          <div className="text-center md:text-left">
            <span className="ac-rise ac-d0 mb-6 inline-block rounded-full bg-wood-wash px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-wood">
              L&apos;assistante des artisans
            </span>
            <h1 className="ac-rise ac-d1 mx-auto max-w-[15ch] text-[clamp(40px,6vw,66px)] font-bold leading-[1.04] tracking-tighter text-nv md:mx-0">
              Vous ne perdez plus un seul appel.
            </h1>
            <p className="ac-rise ac-d2 mx-auto mt-6 max-w-xl text-[19px] font-light leading-relaxed tracking-wide text-soft md:mx-0">
              Gildra décroche à votre place, qualifie vos clients et fixe vos rendez-vous. Vous
              recevez tout sur votre téléphone. Même à 21 heures, même le dimanche.
            </p>
            <div className="ac-rise ac-d3 mt-9">
              <Link
                href="/signup"
                className="inline-block rounded-full bg-or px-9 py-4 text-[16px] font-medium text-w shadow-sh2 transition-all duration-300 hover:scale-[1.03] hover:bg-or-h"
              >
                Démarrer gratuitement
              </Link>
              <p className="mt-4 text-[12px] tracking-wide text-faint">
                7 appels gratuits · Sans carte bancaire · Sans engagement
              </p>
            </div>
          </div>

          {/* Colonne téléphone animé */}
          <div className="ac-rise ac-d2">
            <HeroPhone />
          </div>
        </div>
      </header>

      {/* 3 — Métiers */}
      <section className="border-b border-line bg-w py-14">
        <div className={WRAP}>
          <p className="text-center text-[12px] uppercase tracking-[0.18em] text-faint">
            Un assistant pour chaque métier
          </p>
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {TRADES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="ac-card inline-flex items-center gap-2 rounded-full border border-wood-line bg-w px-4 py-2 text-[14px] font-medium text-nv"
              >
                <Icon size={17} strokeWidth={1.9} className="text-wood" />
                {label}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[14.5px] font-light tracking-wide text-soft">
            Plombier, électricien, serrurier, carreleur… Gildra s&apos;adapte à votre métier, votre
            zone et vos tarifs.
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
            Pendant que vous êtes sur le chantier, Gildra gère votre téléphone.
          </p>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {GAINS.map((g, i) => (
              <Reveal key={g.t} delay={i * 110}>
                <div>
                  <div className="text-[clamp(56px,7vw,76px)] font-bold leading-none tracking-tighter text-nv-2">
                    {g.n}
                  </div>
                  <h3 className="mt-3 text-[18px] font-semibold leading-snug">{g.t}</h3>
                  <p className="mt-2 text-[15px] font-light leading-relaxed tracking-wide text-soft">{g.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Fonctionnalités */}
      <section id="fonctionnalites" className="bg-wood-wash py-24">
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

      {/* 7 — Essayez vous-même */}
      <section className="bg-w3 py-24">
        <div className={`${WRAP} text-center`}>
          <h2 className={H2}>Essayez Sonia vous-même.</h2>
          <p className={`${LEDE} mx-auto mt-5 max-w-2xl`}>
            Créez votre compte, réglez vos horaires et vos tarifs en quelques minutes, et Sonia
            décroche vos 7 premiers appels — gratuitement, sans carte bancaire.
          </p>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-full bg-or px-10 py-4 text-[16px] font-medium text-w shadow-sh2 transition-all duration-300 hover:scale-[1.03] hover:bg-or-h"
          >
            Créer mon compte
          </Link>
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
      <section id="tarifs" className="bg-gradient-to-b from-w to-wood-wash py-24">
        <div className={WRAP}>
          <h2 className={`${H2} text-center`}>Un tarif. Pas de surprise.</h2>
          <div className="mt-16">
            <PlanCards />
          </div>
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
            Sans engagement · Sans carte bancaire · 7 appels gratuits
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
