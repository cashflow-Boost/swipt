import Link from "next/link";

/**
 * Identité Rimova.
 * — LogoMark : le casque seul (navbar compacte, splash, favicon).
 * — Logo : la version horizontale, combiné + mot + point vert.
 * Le point vert signale « en ligne, quelqu'un décroche » : c'est la promesse.
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
      <path d="M16 32C16 14 24 6 32 6s16 8 16 26" stroke="#1D4ED8" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="10" y="28" width="14" height="22" rx="6" fill="#1D4ED8" />
      <rect x="40" y="28" width="14" height="22" rx="6" fill="#1D4ED8" />
      <path d="M48 42c0 10-8 14-16 14" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="56" r="5.5" fill="#10B981" />
    </svg>
  );
}

/** Combiné stylisé de la version horizontale. */
function PhoneMark({ dark }: { dark: boolean }) {
  return (
    <svg width="20" height="28" viewBox="0 0 24 34" aria-hidden="true" className="shrink-0">
      <rect
        x="1.6"
        y="1.6"
        width="20.8"
        height="30.8"
        rx="5"
        fill="none"
        stroke={dark ? "#FFFFFF" : "#1D4ED8"}
        strokeWidth="2.4"
      />
      <rect x="8.5" y="6" width="7" height="1.8" rx="0.9" fill={dark ? "#FFFFFF" : "#1D4ED8"} />
      <circle cx="12" cy="26" r="2" fill="#10B981" />
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
      <PhoneMark dark={dark} />
      <span className={`text-[20px] font-bold tracking-tight ${dark ? "text-w" : "text-nv"}`}>
        Rimova
      </span>
      <span className="mb-0.5 inline-block h-[7px] w-[7px] shrink-0 self-end rounded-full bg-gr" aria-hidden="true" />
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="Rimova — accueil">
      {mark}
    </Link>
  );
}
