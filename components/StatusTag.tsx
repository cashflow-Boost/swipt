const VARIANTS = {
  neutral: "bg-w2 border-line2 text-soft",
  or: "bg-or-wash border-or-line text-or-t",
  gr: "bg-gr-wash border-[#CFE6D8] text-gr",
  rd: "bg-rd-wash border-[#F2D5D2] text-rd",
} as const;

export type TagVariant = keyof typeof VARIANTS;

/** Statut toujours doublé d'un texte, jamais porté par la seule couleur (SPEC §3.6). */
export function StatusTag({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: TagVariant;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-pill border px-2.5 py-0.5 text-[11.5px] font-semibold ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
