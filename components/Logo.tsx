import Link from "next/link";

/**
 * Logo AlloChantier — typographie épurée : « Allo » en marine, « Chantier »
 * en orange, avec la pastille qui rappelle le combiné qui décroche.
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
    <span className={`flex items-center gap-2 text-[19px] font-bold tracking-[-0.02em] ${className}`}>
      <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-nv text-[15px] font-bold text-w">
        A
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-or ring-2 ring-w" />
      </span>
      <span>
        <span className={dark ? "text-w" : "text-nv"}>Allo</span>
        <span className="text-or">Chantier</span>
      </span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="AlloChantier — accueil">
      {mark}
    </Link>
  );
}
