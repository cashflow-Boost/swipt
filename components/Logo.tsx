import Link from "next/link";

/**
 * Identité Rimova.
 * — LogoMark : le casque (micro vert = « en ligne, on décroche »). Navbar,
 *   splash, favicon, avatar d'appel.
 * — Logo : version horizontale, casque + mot.
 */

export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Rimova"
    >
      <defs>
        <linearGradient id="rm-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* arceau */}
      <path d="M13 35C13 16 24 8 32 8s19 8 19 27" fill="none" stroke="url(#rm-grad)" strokeWidth="6" strokeLinecap="round" />
      {/* écouteurs */}
      <rect x="8" y="31" width="15" height="23" rx="7.5" fill="url(#rm-grad)" />
      <rect x="41" y="31" width="15" height="23" rx="7.5" fill="url(#rm-grad)" />
      {/* tige du micro */}
      <path d="M48 51c0 9-7 9-13 8" fill="none" stroke="url(#rm-grad)" strokeWidth="5" strokeLinecap="round" />
      {/* embout micro (vert = en ligne) */}
      <rect x="22" y="54" width="14" height="9" rx="4.5" fill="#10B981" />
    </svg>
  );
}

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
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={26} className="shrink-0" />
      <span className={`text-[20px] font-bold tracking-tight ${dark ? "text-w" : "text-nv"}`}>
        Rimova
      </span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="Rimova — accueil">
      {mark}
    </Link>
  );
}
