import Link from "next/link";
import { Logo } from "@/components/Logo";

/**
 * Coquille commune aux pages légales publiques (mentions légales, CGV,
 * confidentialité). Reprend l'en-tête et le pied de la landing pour rester
 * cohérent, sans dépendre de la coquille authentifiée.
 */
export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-w">
      <nav className="sticky top-0 z-50 border-b border-line bg-w/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3.5">
          <Logo />
          <Link href="/" className="text-[14px] font-medium text-soft hover:text-nv">
            ← Retour au site
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">Informations légales</p>
        <h1 className="mt-3 text-[clamp(28px,5vw,40px)] font-[650] tracking-[-0.035em]">{title}</h1>
        <p className="mt-2 text-[13px] text-faint">Dernière mise à jour : {updated}</p>

        <div className="legal mt-10 space-y-7 text-[15px] leading-[1.65] text-soft">{children}</div>

        <div className="mt-12 rounded-[11px] border border-or-line bg-or-wash p-4 text-[13px] text-or-t">
          ⚠ Ce document contient des champs entre crochets <code className="font-mono">[…]</code> à compléter
          avec vos informations réelles (raison sociale, SIRET, adresse…) avant la mise en ligne définitive.
          Faites-le relire par un professionnel si vous avez un doute.
        </div>
      </article>

      <footer className="border-t border-line px-6 py-8 text-center text-[12.5px] text-faint">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/mentions-legales" className="hover:text-ink">Mentions légales</Link>
          <span>·</span>
          <Link href="/cgv" className="hover:text-ink">CGV</Link>
          <span>·</span>
          <Link href="/confidentialite" className="hover:text-ink">Confidentialité</Link>
        </div>
        <p className="mt-3">© 2026 Rimova — France</p>
      </footer>
    </main>
  );
}

/** Titre de section légale. */
export function LSection({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[17px] font-[650] tracking-[-0.01em] text-ink">
        <span className="mr-2 font-mono text-[13px] text-faint">{n}</span>
        {title}
      </h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}
