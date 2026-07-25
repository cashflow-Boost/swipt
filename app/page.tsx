import Link from "next/link";
import { Calculator } from "@/components/Calculator";

const PILLARS = [
  { t: "Il répond", d: "En moins de deux secondes, la nuit et le week-end. Le nom de votre entreprise est annoncé, l'urgence identifiée dès les premières phrases.", li: ["Annoncé comme automatique", "Transfert vers vous si le cas l'exige"] },
  { t: "Il organise", d: "Le rendez-vous est posé dans votre agenda selon votre zone, vos horaires et vos trajets. Le client est confirmé par SMS.", li: ["Refus poli du hors-zone", "Fiche d'intervention préremplie"] },
  { t: "Il facture", d: "Le devis est chiffré depuis vos prix. Vous validez au doigt, la facture découle du devis, au format Factur-X.", li: ["TVA 20 / 10 / 5,5 % par ligne", "Relance des impayés"] },
];

const DAY = [
  { t: "7 h 55", h: "Vous partez sur votre premier chantier", p: "Votre téléphone sonne toujours en premier — SWIPT n'intervient que si vous ne répondez pas." },
  { t: "9 h 12", h: "Un appel pendant que vous êtes sous un plancher", p: "SWIPT décroche, qualifie la panne, pose le rendez-vous. Vous recevez le résumé, sans interrompre votre geste." },
  { t: "12 h 30", h: "Vous validez un devis entre deux interventions", p: "Le devis est déjà chiffré depuis votre bibliothèque de prix. Vous ajustez une ligne, vous envoyez. Trente secondes." },
  { t: "15 h 47", h: "Une urgence réelle", p: "Personne bloquée dehors. SWIPT vous alerte immédiatement au lieu d'attendre le soir — et vous transfère l'appel." },
  { t: "19 h 05", h: "Le résumé du jour", p: "Sept appels traités, trois rendez-vous, deux devis validés. Votre soirée ne sert plus à rattraper la journée." },
];

const PLANS = [
  { n: "Solo", who: "Artisan seul", price: 149, feats: ["130 appels traités / mois", "Prise de rendez-vous", "Devis et factures illimités", "Relance des impayés"] },
  { n: "Équipe", who: "2 à 5 personnes", price: 299, top: true, feats: ["260 appels traités / mois", "Planning partagé", "Plusieurs zones d'intervention", "Assistance sous 4 h"] },
  { n: "Pro", who: "6 à 10 personnes", price: 549, feats: ["480 appels traités / mois", "Affectation automatique", "Rappel des devis sans réponse", "Interlocuteur dédié"] },
];

const FAQ = [
  { q: "Mes clients savent-ils qu'ils parlent à une machine ?", a: "Oui — c'est annoncé au décroché, avec le nom de votre entreprise. Si l'appelant demande à vous parler, l'appel vous est transféré." },
  { q: "Est-ce que je change de numéro ?", a: "Non. Un renvoi conditionnel est activé chez votre opérateur : votre téléphone sonne normalement, et l'appel ne bascule sur SWIPT qu'après quatre sonneries sans réponse." },
  { q: "Et si c'est une urgence grave ?", a: "Fuite active, coupure de courant, personne bloquée, odeur de gaz : vous recevez une alerte immédiate, et l'appel peut vous être transféré directement." },
  { q: "Combien de temps pour démarrer ?", a: "Environ une heure pour enregistrer votre zone, vos horaires, votre forfait et vos prix. SWIPT décroche le soir même." },
];

export default function Home() {
  return (
    <main className="bg-w">
      <nav className="sticky top-0 z-50 border-b border-line bg-w/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2 text-[19px] font-bold tracking-tight">
            <span>SWIPT</span>
            <span className="flex gap-0.5">
              <i className="block h-3.5 w-[7px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
              <i className="block h-3.5 w-[7px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-medium text-soft hover:text-ink">Se connecter</Link>
            <Link href="/signup" className="rounded-pill bg-or px-4 py-2 text-[14px] font-semibold text-ink">Commencer l&apos;essai</Link>
          </div>
        </div>
      </nav>

      <header className="border-b border-line bg-gradient-to-b from-w2 to-w">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">
            Le standard téléphonique des artisans du dépannage
          </p>
          <h1 className="mx-auto mt-4 max-w-[22ch] text-[clamp(34px,6vw,58px)] font-[650] leading-[1.04] tracking-[-0.04em]">
            Vous êtes sur le chantier. Vos clients ne restent jamais sans réponse.
          </h1>
          <p className="mx-auto mt-5 max-w-[52ch] text-[18px] text-soft">
            SWIPT, c&apos;est le poste que vous n&apos;avez jamais pu embaucher : il décroche quand vous
            ne pouvez pas, fixe le rendez-vous, prépare le devis et relance les impayés.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="rounded-pill bg-or px-6 py-3 text-[15.5px] font-semibold text-ink">Commencer l&apos;essai</Link>
            <Link href="#calcul" className="rounded-pill border border-line2 bg-w px-6 py-3 text-[15.5px] font-semibold">Calculer ce que je perds</Link>
          </div>
          <p className="mt-4 text-[13.5px] text-faint">7 jours d&apos;essai · sans carte bancaire · résiliable à tout moment</p>
        </div>
      </header>

      <section id="calcul" className="border-b border-line bg-w2 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Combien vous coûtent les appels manqués</div>
            <h2 className="mx-auto mt-3 max-w-[20ch] text-[clamp(26px,4vw,38px)] font-[650] tracking-[-0.03em]">Réglez vos trois chiffres.</h2>
            <p className="mx-auto mt-3 max-w-[50ch] text-[16px] text-soft">Le calcul s&apos;affiche en entier, ligne par ligne — vous pouvez contester chaque étape.</p>
          </div>
          <Calculator />
        </div>
      </section>

      <section className="border-b border-line py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Le service</div>
            <h2 className="mx-auto mt-3 max-w-[24ch] text-[clamp(26px,4vw,40px)] font-[650] tracking-[-0.03em]">Un seul outil, de la sonnerie à la facture payée</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.t} className="rounded-[12px] border border-line bg-w p-6 shadow-sh">
                <div className="mb-3 flex h-10 w-10 items-center justify-center gap-0.5 rounded-[11px] border border-or-line bg-or-wash">
                  {Array.from({ length: i + 1 }).map((_, k) => (
                    <i key={k} className="block h-[17px] w-[8px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
                  ))}
                </div>
                <h3 className="text-[17px] font-[650]">{p.t}</h3>
                <p className="mt-1.5 text-[14.5px] text-soft">{p.d}</p>
                <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-[13.5px] text-soft">
                  {p.li.map((x) => <li key={x} className="flex gap-2"><span className="text-or-t">✓</span>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-w2 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Une journée avec SWIPT</div>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-[650] tracking-[-0.03em]">Ce qui se passe pendant que vous travaillez</h2>
          </div>
          <div className="mt-12 space-y-6">
            {DAY.map((e) => (
              <div key={e.t} className="grid grid-cols-[64px_1fr] gap-5">
                <div className="pt-0.5 text-right font-mono text-[13px] text-faint">{e.t}</div>
                <div className="relative border-l border-line2 pl-6">
                  <span className="absolute -left-[6px] top-[5px] h-[11px] w-[11px] rounded-full border-2 border-w bg-or" />
                  <h3 className="text-[16px] font-[600]">{e.h}</h3>
                  <p className="mt-1 max-w-[52ch] text-[14.5px] text-soft">{e.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="border-b border-line py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Tarifs</div>
            <h2 className="mx-auto mt-3 max-w-[22ch] text-[clamp(26px,4vw,40px)] font-[650] tracking-[-0.03em]">Une intervention récupérée rembourse le mois</h2>
            <p className="mx-auto mt-3 max-w-[54ch] text-[16px] text-soft">Le bon point de comparaison n&apos;est pas un logiciel, c&apos;est un poste : une assistante à mi-temps coûte 1 100 à 1 400 € par mois.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.n} className={`relative flex flex-col rounded-[14px] border bg-w p-6 ${p.top ? "border-or shadow-[0_0_0_1px_var(--or)]" : "border-line shadow-sh"}`}>
                {p.top && <span className="absolute -top-3 left-6 rounded-pill bg-or px-3 py-1 text-[11px] font-[650] text-ink">Recommandé</span>}
                <div className="text-[17px] font-[650]">{p.n}</div>
                <div className="text-[14px] text-faint">{p.who}</div>
                <div className="mt-4 text-[38px] font-[650] tracking-[-0.035em]">{p.price} €<span className="text-[13.5px] font-[500] text-faint"> /mois HT</span></div>
                <ul className="mt-5 flex-1 space-y-2 text-[14.5px] text-soft">
                  {p.feats.map((f) => <li key={f} className="flex gap-2 border-t border-line pt-2"><span className="text-or-t">✓</span>{f}</li>)}
                </ul>
                <Link href="/signup" className={`mt-6 rounded-pill px-4 py-2.5 text-center text-[14.5px] font-semibold ${p.top ? "bg-or text-ink" : "border border-line2 bg-w"}`}>
                  Commencer l&apos;essai
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[72ch] text-center text-[13px] text-faint">
            Au-delà du volume inclus : 0,79 € par appel traité, facturé le mois suivant — le service ne se coupe jamais. Sans engagement, résiliable au mois.
          </p>
        </div>
      </section>

      <section id="questions" className="border-b border-line bg-w2 py-20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Questions</div>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-[650] tracking-[-0.03em]">Les points sur lesquels on nous attend</h2>
          </div>
          <div className="mt-10 space-y-2.5">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0} className="rounded-[11px] border border-line bg-w shadow-sh">
                <summary className="cursor-pointer list-none px-5 py-4 text-[15.5px] font-[600]">{f.q}</summary>
                <p className="max-w-[66ch] px-5 pb-4 text-[14.5px] text-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-center text-w">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mx-auto max-w-[18ch] text-[clamp(28px,4.5vw,42px)] font-[650] tracking-[-0.035em]">Le prochain appel arrive. Décidez qui décroche.</h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-[17px] text-[#A9A59D]">Sept jours d&apos;essai, sans carte bancaire. Si ça ne vous convient pas, vous coupez le renvoi — il ne reste rien.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="rounded-pill bg-or px-6 py-3 text-[15.5px] font-semibold text-ink">Commencer l&apos;essai</Link>
            <Link href="/login" className="rounded-pill border border-[#3A3A40] px-6 py-3 text-[15.5px] font-semibold text-w">Se connecter</Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-[12.5px] text-faint">
        © 2026 SWIPT — France · Standard téléphonique intelligent des artisans du dépannage
      </footer>
    </main>
  );
}
