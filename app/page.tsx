import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { Logo } from "@/components/Logo";
import { DemoCallModal } from "@/components/DemoCallModal";
import { FloatingHelp } from "@/components/FloatingHelp";
import { Testimonials } from "@/components/Testimonials";

const STEPS = [
  {
    t: "Vous ne décrochez pas",
    d: "Vous êtes sur un toit, au volant, les mains dans le cambouis. Le téléphone sonne dans le vide.",
    icon: "ring" as const,
  },
  {
    t: "AlloChantier répond à votre place",
    d: "Lia décroche au nom de votre entreprise, comprend le besoin et pose le rendez-vous.",
    icon: "headset" as const,
  },
  {
    t: "Vous recevez le résumé",
    d: "Nom, adresse, besoin, créneau. Tout arrive sur votre téléphone, sans vous interrompre.",
    icon: "chat" as const,
  },
];

const DAY = [
  { t: "7 h 55", h: "Vous partez sur votre premier chantier" },
  { t: "9 h 12", h: "Un appel pendant que vous êtes sous un plancher", p: "AlloChantier décroche" },
  { t: "12 h 30", h: "Vous validez un devis entre deux interventions", p: "30 secondes" },
  { t: "15 h 47", h: "Une urgence", p: "AlloChantier vous alerte et transfère" },
  { t: "19 h 05", h: "Résumé du jour", p: "7 appels, 3 RDV, 2 devis. Votre soirée est libre." },
];

const PILLARS = [
  {
    t: "Elle décroche",
    li: ["En moins de 2 secondes", "24 h/24, week-ends compris", "Annoncée comme automatique", "Vous transfère les urgences"],
  },
  {
    t: "Elle organise",
    li: ["Rendez-vous posé dans votre agenda", "Confirmation du client par SMS", "Refus poli du hors-zone", "Fiche d'intervention préremplie"],
  },
  {
    t: "Elle facture",
    li: ["Devis chiffré depuis vos prix", "Vous validez au doigt", "Facture au format Factur-X", "Relance des impayés"],
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
      <nav className="sticky top-0 z-50 border-b border-line bg-w/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <div className="hidden items-center gap-6 md:flex">
            <a href="#fonctionnalites" className="text-[14.5px] font-medium text-soft hover:text-nv">Fonctionnalités</a>
            <a href="#tarifs" className="text-[14.5px] font-medium text-soft hover:text-nv">Tarifs</a>
            <a href="#questions" className="text-[14.5px] font-medium text-soft hover:text-nv">Questions</a>
            <Link href="/login" className="text-[14.5px] font-medium text-soft hover:text-nv">Se connecter</Link>
          </div>
          <Link
            href="/signup"
            className="rounded-pill bg-or px-4 py-2 text-[14px] font-semibold text-ink hover:bg-or-h"
          >
            Essai gratuit
          </Link>
        </div>
      </nav>

      {/* 2 — Hero */}
      <header className="border-b border-line bg-nv-wash">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">
            L&apos;assistante qui décroche quand vous ne pouvez pas
          </p>
          <h1 className="mx-auto mt-4 max-w-[20ch] text-[clamp(30px,5.6vw,54px)] font-[700] leading-[1.06] tracking-[-0.035em]">
            Un appel manqué, c&apos;est un chantier qui part chez le concurrent.
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[17.5px] text-soft">
            AlloChantier, c&apos;est votre secrétaire téléphonique intelligente. Elle répond à votre
            place, fixe vos rendez-vous, prépare vos devis et relance vos impayés.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DemoCallModal className="w-full rounded-pill border border-nv bg-w px-6 py-3.5 text-[15.5px] font-semibold text-nv hover:bg-w2 sm:w-auto" />
            <Link
              href="/signup"
              className="w-full rounded-pill bg-or px-6 py-3.5 text-center text-[15.5px] font-semibold text-ink hover:bg-or-h sm:w-auto"
            >
              🚀 Essai gratuit 7 jours
            </Link>
          </div>
          <p className="mt-4 text-[13.5px] text-faint">
            Sans engagement · Sans carte bancaire · Résiliable en 1 clic
          </p>
        </div>
      </header>

      {/* 3 — Comment ça marche */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Comment ça marche</div>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">Trois étapes, zéro effort</h2>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative rounded-lg border border-line bg-w p-6 shadow-sh">
                <span className="absolute right-5 top-5 font-mono text-[12px] font-[650] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-or-wash text-or-t">
                  <StepIcon kind={s.icon} />
                </div>
                <h3 className="mt-4 text-[17px] font-[650]">{s.t}</h3>
                <p className="mt-1.5 text-[14.5px] text-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 — Une journée */}
      <section className="border-b border-line bg-w2 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Une journée avec AlloChantier</div>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
              Ce qui se passe pendant que vous travaillez
            </h2>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {DAY.map((e) => (
              <div key={e.t} className="flex flex-col rounded-lg border border-line bg-w p-5 shadow-sh">
                <div className="font-mono text-[13px] font-[650] text-or-t">{e.t}</div>
                <h3 className="mt-2 text-[15px] font-[600] leading-snug">{e.h}</h3>
                {e.p && <p className="mt-1.5 text-[13.5px] text-soft">{e.p}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Calculateur */}
      <section id="calcul" className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">
              Calculez ce que vous perdez chaque mois
            </div>
            <h2 className="mx-auto mt-3 max-w-[22ch] text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
              Combien vous coûtent vos appels manqués ?
            </h2>
            <p className="mx-auto mt-3 max-w-[50ch] text-[16px] text-soft">
              Le calcul s&apos;affiche en entier, ligne par ligne — vous pouvez contester chaque étape.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* 6 — Ce qu'elle fait */}
      <section id="fonctionnalites" className="border-b border-line bg-w2 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Le service</div>
            <h2 className="mx-auto mt-3 max-w-[24ch] text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
              Ce qu&apos;AlloChantier fait pour vous
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.t} className="rounded-lg border border-line bg-w p-6 shadow-sh">
                <h3 className="text-[18px] font-[680]">{p.t}</h3>
                <ul className="mt-4 space-y-2.5 text-[14.5px] text-soft">
                  {p.li.map((x) => (
                    <li key={x} className="flex gap-2.5 border-t border-line pt-2.5 first:border-t-0 first:pt-0">
                      <span className="mt-0.5 text-or" aria-hidden="true">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Comparatif */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Le bon point de comparaison</div>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
              Ce n&apos;est pas un logiciel, c&apos;est un poste
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-rd/25 bg-rd-wash p-6">
              <h3 className="text-[17px] font-[680] text-rd">Assistante à mi-temps</h3>
              <div className="mt-3 text-[32px] font-[700] tracking-[-0.03em] text-rd">
                1 400 €<span className="text-[14px] font-[500]"> /mois</span>
              </div>
              <ul className="mt-4 space-y-2 text-[14.5px] text-soft">
                {["Congés payés à financer", "Arrêts maladie", "Formation à assurer", "Présente aux heures de bureau"].map((x) => (
                  <li key={x} className="flex gap-2.5 border-t border-rd/15 pt-2">
                    <span className="text-rd" aria-hidden="true">✕</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-gr/30 bg-gr-wash p-6">
              <h3 className="text-[17px] font-[680] text-gr">AlloChantier</h3>
              <div className="mt-3 text-[32px] font-[700] tracking-[-0.03em] text-gr">
                dès 99 €<span className="text-[14px] font-[500]"> /mois</span>
              </div>
              <ul className="mt-4 space-y-2 text-[14.5px] text-soft">
                {["Jamais de congés", "Jamais malade", "Aucune formation", "Disponible 24 h/24, 7 j/7"].map((x) => (
                  <li key={x} className="flex gap-2.5 border-t border-gr/15 pt-2">
                    <span className="text-gr" aria-hidden="true">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8 — Témoignages (masqué tant qu'il n'y a pas de vrais clients) */}
      <Testimonials />

      {/* 9 — Tarifs */}
      <section id="tarifs" className="border-b border-line bg-w2 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Tarifs</div>
            <h2 className="mx-auto mt-3 max-w-[22ch] text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
              Un tarif clair, sans engagement
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className={`relative flex flex-col rounded-lg border bg-w p-6 ${
                  p.top ? "border-or shadow-sh2 ring-1 ring-or" : "border-line shadow-sh"
                }`}
              >
                {p.top && (
                  <span className="absolute -top-3 left-6 rounded-pill bg-or px-3 py-1 text-[11px] font-[680] text-ink">
                    Recommandé
                  </span>
                )}
                <div className="text-[17px] font-[680]">{p.n}</div>
                <div className="text-[14px] text-faint">{p.who}</div>
                <div className="mt-4 text-[38px] font-[700] tracking-[-0.035em]">
                  {p.price} €<span className="text-[13.5px] font-[500] text-faint"> /mois HT</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-[14.5px] text-soft">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-2.5 border-t border-line pt-2">
                      <span className="text-or" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-6 rounded-pill px-4 py-3 text-center text-[14.5px] font-semibold ${
                    p.top ? "bg-or text-ink hover:bg-or-h" : "border border-nv text-nv hover:bg-nv-wash"
                  }`}
                >
                  Essai gratuit 7 jours
                </Link>
                <p className="mt-2 text-center text-[12px] text-faint">Sans engagement · 7 jours gratuits</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[70ch] text-center text-[13px] text-faint">
            Au-delà du forfait : 0,79 € par appel traité, facturé le mois suivant — le service ne se
            coupe jamais. Sans engagement, résiliable au mois.
          </p>
        </div>
      </section>

      {/* 10 — FAQ */}
      <section id="questions" className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Questions</div>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-[680] tracking-[-0.03em]">
              Les points sur lesquels on nous attend
            </h2>
          </div>
          <div className="mt-10 space-y-2.5">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0} className="rounded-[12px] border border-line bg-w shadow-sh">
                <summary className="cursor-pointer list-none px-5 py-4 text-[15.5px] font-[600] text-nv">{f.q}</summary>
                <p className="max-w-[66ch] px-5 pb-4 text-[14.5px] text-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Qui sommes-nous */}
      <section id="a-propos" className="border-b border-line bg-w2 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-lg border border-line bg-w p-8 shadow-sh">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-full bg-nv-wash text-[13px] font-medium text-faint sm:self-start">
                Photo
              </div>
              <div>
                <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Qui sommes-nous</div>
                <h2 className="mt-2 text-[24px] font-[680] tracking-[-0.02em]">
                  Un outil né d&apos;un problème de famille
                </h2>
                <p className="mt-3 text-[15px] text-soft">
                  Je suis Paolo, fondateur d&apos;AlloChantier. J&apos;ai construit cet outil pour mon
                  père artisan, qui perdait des clients tous les jours parce qu&apos;il ne pouvait pas
                  décrocher au volant ou sur un toit.
                </p>
                <p className="mt-3 text-[15px] text-soft">
                  L&apos;idée est simple : aucun artisan ne devrait avoir à choisir entre bien
                  travailler et répondre au téléphone. AlloChantier s&apos;occupe du second.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-nv py-20 text-center text-w">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mx-auto max-w-[18ch] text-[clamp(28px,4.5vw,42px)] font-[700] tracking-[-0.035em] text-w">
            Le prochain appel arrive. Décidez qui décroche.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[17px] text-[#B8C6D6]">
            Sept jours d&apos;essai, sans carte bancaire. Si ça ne vous convient pas, vous coupez le
            renvoi — il ne reste rien.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="w-full rounded-pill bg-or px-6 py-3.5 text-center text-[15.5px] font-semibold text-ink hover:bg-or-h sm:w-auto"
            >
              🚀 Essai gratuit 7 jours
            </Link>
            <DemoCallModal className="w-full rounded-pill border border-[#41597A] px-6 py-3.5 text-[15.5px] font-semibold text-w hover:bg-nv-2 sm:w-auto" />
          </div>
          <p className="mt-4 text-[13.5px] text-[#8FA3B8]">
            Sans engagement · Sans carte bancaire · Résiliable en 1 clic
          </p>
        </div>
      </section>

      {/* 12 — Footer */}
      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
          <Logo href={null} />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-soft">
            <a href="#tarifs" className="hover:text-nv">Tarifs</a>
            <span aria-hidden="true">·</span>
            <a href="#questions" className="hover:text-nv">Questions</a>
            <span aria-hidden="true">·</span>
            <Link href="/mentions-legales" className="hover:text-nv">Mentions légales</Link>
            <span aria-hidden="true">·</span>
            <Link href="/cgv" className="hover:text-nv">CGV</Link>
            <span aria-hidden="true">·</span>
            <Link href="/confidentialite" className="hover:text-nv">Confidentialité</Link>
          </div>
          <p className="rounded-pill border border-line bg-w2 px-4 py-2 text-[12.5px] text-soft">
            🇫🇷 Conçu en France · Support en français · Données hébergées en Europe
          </p>
          <p className="text-[12.5px] text-faint">© 2026 AlloChantier</p>
        </div>
      </footer>

      <FloatingHelp phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
    </main>
  );
}

function StepIcon({ kind }: { kind: "ring" | "headset" | "chat" }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (kind === "ring")
    return (
      <svg {...common}>
        <path d="M6.5 3.5 9 6l-2 2.5a12 12 0 0 0 6.5 6.5L16 13l2.5 2.5-2 2.5c-.6.7-1.6.9-2.4.5A18 18 0 0 1 5.5 8c-.4-.9-.2-1.9.5-2.5l.5-2Z" />
        <path d="M17 3.5a6 6 0 0 1 3.5 3.5M15.5 7a2.5 2.5 0 0 1 1.5 1.5" />
      </svg>
    );
  if (kind === "headset")
    return (
      <svg {...common}>
        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
        <path d="M4 13h2.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5ZM20 13h-2.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1v-5Z" />
        <path d="M18 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M20.5 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.7A8 8 0 1 1 20.5 11.5Z" />
      <path d="M9 11h.01M12.5 11h.01M16 11h.01" />
    </svg>
  );
}
