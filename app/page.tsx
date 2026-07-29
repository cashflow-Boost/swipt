import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Logo } from "@/components/Logo";
import { DemoCallModal } from "@/components/DemoCallModal";
import { FloatingHelp, WhatsAppMark } from "@/components/FloatingHelp";
import { Testimonials } from "@/components/Testimonials";
import { HeroVisual } from "@/components/HeroVisual";
import { Reveal } from "@/components/Reveal";

/** Coordonnées de contact — à régler dans Vercel avant d'envoyer du trafic. */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contact@allochantier.com";

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
  "Disponible 24 heures sur 24",
  "7 jours sur 7, week-ends compris",
  "Déployé en une heure",
  "Aucune formation à assurer",
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
    feats: ["80 appels inclus", "Devis illimités", "1 utilisateur", "Prise de rendez-vous", "Relance des impayés"],
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

const SECTION = "border-t border-line py-24 md:py-32";
const WRAP = "mx-auto max-w-7xl px-6 md:px-8";

export default function Home() {
  return (
    <main className="bg-w">
      {/* 1 — Navbar */}
      <nav className="sticky top-0 z-50 border-b border-line bg-w/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8">
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
        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-24 md:px-8 lg:grid-cols-[1.15fr_1fr]">
          <div className="text-center lg:text-left">
            <h1 className="ac-rise ac-d1 mx-auto max-w-[16ch] text-[clamp(44px,7vw,76px)] font-bold leading-[1.02] lg:mx-0">
              Vous ne perdez plus un seul appel.
            </h1>
            <p className="ac-rise ac-d2 mx-auto mt-7 max-w-[54ch] text-[20px] font-light leading-relaxed text-soft lg:mx-0">
              AlloChantier répond à votre place, qualifie vos clients et fixe vos rendez-vous. Vous
              recevez tout sur votre téléphone. Même à 21 heures, même le dimanche.
            </p>
            <div className="ac-rise ac-d3 mt-10">
              <Link
                href="/signup"
                className="inline-block rounded-full bg-ink px-8 py-4 text-[16px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
              >
                Démarrer mon essai
              </Link>
              <p className="mt-3 text-[12px] text-faint">
                7 jours gratuits · Sans carte bancaire · Sans engagement
              </p>
              <a
                href="#fonctionnement"
                className="mt-5 inline-block text-[14px] text-faint transition-colors hover:text-soft"
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
      <section id="fonctionnalites" className={SECTION}>
        <div className={WRAP}>
          <h2 className="max-w-[18ch] text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Un seul outil. Zéro appel manqué.
          </h2>
          <div className="mt-16 max-w-3xl">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.t} delay={i * 100}>
                <div className={i > 0 ? "mt-20" : ""}>
                  <h3 className="text-[24px] font-semibold">{c.t}</h3>
                  <p className="mt-3 max-w-[62ch] text-[17px] font-light leading-relaxed text-soft">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Comparatif */}
      <section className={SECTION}>
        <div className={WRAP}>
          <h2 className="mb-16 max-w-[20ch] text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Moins cher qu&apos;une demi-journée de secrétaire.
          </h2>
          <div className="mx-auto grid max-w-4xl items-start gap-8 sm:grid-cols-2">
            <Reveal>
              <div className="p-8">
                <h3 className="text-[15px] font-medium text-faint">Assistante à mi-temps</h3>
                <ul className="mt-6 space-y-4">
                  {VS_LEFT.map((x) => (
                    <li key={x} className="border-b border-line pb-4 text-[17px] font-light text-soft">{x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-2xl bg-w3 p-8">
                <span className="inline-block rounded-full bg-or-wash px-3 py-1 text-[11.5px] font-medium text-or-t">
                  Recommandé
                </span>
                <h3 className="mt-4 text-[15px] font-medium">AlloChantier</h3>
                <div className="mt-4 text-[40px] font-bold leading-none tracking-[-0.035em] text-or-t">
                  99 €<span className="text-[15px] font-light text-soft"> par mois</span>
                </div>
                <ul className="mt-6 space-y-4">
                  {VS_RIGHT.map((x) => (
                    <li key={x} className="border-b border-line2 pb-4 text-[17px] font-light">{x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5 — Comment ça marche */}
      <section id="fonctionnement" className={SECTION}>
        <div className={WRAP}>
          <h2 className="mb-16 text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">Opérationnel ce soir.</h2>
          <ol className="grid gap-16 md:grid-cols-3 md:gap-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 110}>
                <li className="relative pt-10">
                  <span
                    className="pointer-events-none absolute -left-2 -top-2 select-none font-mono text-[clamp(84px,10vw,124px)] font-bold leading-none tracking-[-0.06em] text-line"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative text-[24px] font-semibold">{s.t}</h3>
                  <p className="relative mt-2 text-[16px] font-light leading-relaxed text-soft">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — Démonstration */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
              Vous préférez l&apos;entendre d&apos;abord ?
            </h2>
            <p className="mt-5 text-[18px] font-light leading-relaxed text-soft">
              Laissez votre numéro : dès que la ligne de Lia est ouverte, elle vous appelle et vous
              jouez le client. Vous entendez exactement ce que vos clients entendront.
            </p>
            <DemoCallModal
              label="📞 Recevoir un appel de démo"
              className="mt-9 inline-block rounded-full border border-ink px-7 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-w"
            />
          </div>
        </div>
      </section>

      {/* 7 — Calculateur */}
      <section id="calcul" className={SECTION}>
        <div className={WRAP}>
          <h2 className="mb-16 max-w-[20ch] text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Combien vous coûte un appel manqué ?
          </h2>
          <div className="mx-auto max-w-5xl">
            <Calculator />
          </div>
        </div>
      </section>

      {/* Témoignages — masqués tant qu'il n'y a pas de vrais clients */}
      <Testimonials />

      {/* 8 — Tarifs */}
      <section id="tarifs" className={SECTION}>
        <div className={WRAP}>
          <h2 className="mb-16 text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Un tarif. Pas de surprise.
          </h2>
          <div className="mx-auto grid max-w-4xl items-start gap-8 sm:grid-cols-2">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className={`relative rounded-2xl p-8 ${
                  p.top ? "border-2 border-or-h bg-w3" : "border border-line2"
                }`}
              >
                {p.top && (
                  <span className="absolute right-6 top-6 rounded-full bg-or-h px-3 py-1 text-[11.5px] font-medium text-w">
                    Recommandé
                  </span>
                )}
                <h3 className="text-[20px] font-semibold">{p.n}</h3>
                <p className="mt-1 text-[14px] text-faint">{p.who}</p>
                <div className="mt-6 text-[48px] font-bold leading-none tracking-[-0.035em]">
                  {p.price} €<span className="text-[15px] font-light text-soft"> /mois HT</span>
                </div>
                <ul className="mt-8 space-y-3.5">
                  {p.feats.map((f) => (
                    <li key={f} className="text-[16px] font-light text-soft">{f}</li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-10 block rounded-full px-7 py-3.5 text-center text-[15px] font-medium transition-colors duration-300 ${
                    p.top ? "bg-ink text-w hover:bg-or-h" : "border border-ink text-ink hover:bg-ink hover:text-w"
                  }`}
                >
                  Démarrer mon essai
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-[70ch] text-center text-[14px] font-light leading-relaxed text-faint">
            Au-delà du forfait Solo : 0,79 € par appel traité, facturé le mois suivant — le service ne
            se coupe jamais. Sept jours d&apos;essai sans carte bancaire, sans engagement, résiliable
            au mois. Une offre Agence est disponible pour les équipes de plus de trois personnes.
          </p>
        </div>
      </section>

      {/* 9 — FAQ */}
      <section id="questions" className={SECTION}>
        <div className={WRAP}>
          <h2 className="mb-14 text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">
            Les points sur lesquels on nous attend.
          </h2>
          <div className="max-w-3xl">
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
                <p className="max-w-[68ch] pb-7 text-[16.5px] font-light leading-relaxed text-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Contact */}
      <section id="contact" className={SECTION}>
        <div className={WRAP}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(32px,5vw,52px)] font-bold leading-[1.08]">Une question ?</h2>
            <p className="mt-5 text-[18px] font-light text-soft">
              Écrivez-nous sur WhatsApp, en français.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP ?? "33600000000"}?text=${encodeURIComponent("Bonjour, j'ai une question sur AlloChantier")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gr px-6 py-3.5 text-[15px] font-medium text-w transition-all duration-300 hover:brightness-110"
              >
                <WhatsAppMark size={19} />
                Nous écrire sur WhatsApp
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[15px] text-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                {SUPPORT_EMAIL}
              </a>
              {SUPPORT_PHONE && (
                <a
                  href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                  className="text-[15px] text-soft underline underline-offset-4 transition-colors hover:text-ink"
                >
                  Ou appelez-nous au {SUPPORT_PHONE}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 11 — CTA final */}
      <section className={`${SECTION} text-center`}>
        <div className={WRAP}>
          <h2 className="mx-auto max-w-[16ch] text-[clamp(40px,6.5vw,76px)] font-bold leading-[1.02]">
            Le prochain appel arrive.
          </h2>
          <p className="mt-5 text-[20px] font-light text-soft">Décidez qui décroche.</p>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-full bg-ink px-10 py-4 text-[17px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
          >
            Démarrer mon essai gratuit
          </Link>
          <p className="mt-3 text-[12px] text-faint">
            Sans engagement · Sans carte bancaire · 7 jours gratuits
          </p>
        </div>
      </section>

      {/* 12 — Footer */}
      <footer className="border-t border-line bg-w3 py-12">
        <div className={WRAP}>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo href={null} />
              <p className="mt-3 max-w-[32ch] text-[14px] font-light leading-relaxed text-soft">
                L&apos;assistante qui décroche quand vous ne pouvez pas.
              </p>
            </div>
            <FooterCol title="Produit">
              <a href="#fonctionnalites" className="transition-colors hover:text-ink">Fonctionnalités</a>
              <a href="#tarifs" className="transition-colors hover:text-ink">Tarifs</a>
              <Link href="/signup" className="transition-colors hover:text-ink">Essai gratuit</Link>
            </FooterCol>
            <FooterCol title="Légal">
              <Link href="/cgv" className="transition-colors hover:text-ink">CGV</Link>
              <Link href="/mentions-legales" className="transition-colors hover:text-ink">Mentions légales</Link>
              <Link href="/confidentialite" className="transition-colors hover:text-ink">Confidentialité</Link>
            </FooterCol>
            <FooterCol title="Contact">
              <a href={`mailto:${SUPPORT_EMAIL}`} className="transition-colors hover:text-ink">{SUPPORT_EMAIL}</a>
              <a
                href={`https://wa.me/${WHATSAPP ?? "33600000000"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                WhatsApp
              </a>
            </FooterCol>
          </div>
          <p className="mt-8 border-t border-line2 pt-8 text-center text-[12px] text-faint">
            🇫🇷 Conçu en France · Support en français · Données hébergées en Europe
          </p>
        </div>
      </footer>

      <FloatingHelp phone={WHATSAPP} />
    </main>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold">{title}</h3>
      <div className="mt-3 flex flex-col gap-2 text-[14px] font-light text-soft">{children}</div>
    </div>
  );
}
