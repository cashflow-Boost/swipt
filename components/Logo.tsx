import Link from "next/link";

/**
 * Logo AlloChantier — purement typographique. Pas de pastille, pas de
 * marque graphique : le nom porte seul, comme le reste de la page.
 */
export function Logo({
  href = "/",
  dark = false,
  className = "",
}: {
  href?: string | null;
  dark?: boolean;
  className?: string;
}) {
  const mark = (
    <span
      className={`text-[18px] font-semibold tracking-[-0.03em] ${
        dark ? "text-w" : "text-ink"
      } ${className}`}
    >
      AlloChantier
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="AlloChantier — accueil">
      {mark}
    </Link>
  );
}
