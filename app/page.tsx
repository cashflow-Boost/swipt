import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-w2">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-[20px] font-bold tracking-tight">
          <span>SWIPT</span>
          <span className="flex gap-0.5">
            <i className="block h-4 w-2 bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
            <i className="block h-4 w-2 bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
          </span>
        </div>
        <Link href="/login" className="text-[14px] font-semibold text-soft hover:text-ink">
          Se connecter
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-16 text-center sm:pt-24">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">
          Le standard téléphonique des artisans du dépannage
        </p>
        <h1 className="mx-auto mt-4 max-w-[22ch] text-4xl font-[650] leading-[1.05] tracking-[-0.04em] sm:text-5xl">
          Vous êtes sur le chantier. Vos clients ne restent jamais sans réponse.
        </h1>
        <p className="mx-auto mt-5 max-w-[52ch] text-[17px] text-soft">
          SWIPT, c&apos;est le poste que vous n&apos;avez jamais pu embaucher :
          il décroche quand vous ne pouvez pas, fixe le rendez-vous, prépare le
          devis et relance les impayés.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-pill bg-or px-6 py-3 text-[15.5px] font-semibold text-ink"
          >
            Commencer l&apos;essai
          </Link>
          <Link
            href="/login"
            className="rounded-pill border border-line2 bg-w px-6 py-3 text-[15.5px] font-semibold"
          >
            Se connecter
          </Link>
        </div>
        <p className="mt-4 text-[13.5px] text-faint">
          14 jours d&apos;essai · sans carte bancaire · résiliable à tout moment
        </p>
      </section>

      <section className="mx-auto mt-20 grid max-w-4xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {[
          { t: "Il répond", d: "En moins de deux secondes, la nuit et le week-end. Nom de votre entreprise annoncé, urgence identifiée." },
          { t: "Il organise", d: "Rendez-vous posé dans votre agenda selon votre zone et vos horaires. Client confirmé par SMS." },
          { t: "Il facture", d: "Devis chiffré depuis vos prix, facture au format Factur-X, relance des impayés." },
        ].map((c) => (
          <div key={c.t} className="rounded-[12px] border border-line bg-w p-5 text-left">
            <h2 className="text-[16px] font-[650]">{c.t}</h2>
            <p className="mt-1.5 text-[14px] text-soft">{c.d}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-line px-6 py-8 text-center text-[12.5px] text-faint">
        © 2026 SWIPT — France
      </footer>
    </main>
  );
}
