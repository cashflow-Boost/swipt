/**
 * Badge de statut — pastille pastel sans bordure (style iOS). La couleur est
 * toujours doublée d'un texte, jamais porteuse de sens à elle seule (SPEC §3.6).
 */
const VARIANTS = {
  neutral: "bg-slate-100 text-slate-600",
  or: "bg-amber-50 text-amber-700",
  gr: "bg-emerald-50 text-emerald-700",
  rd: "bg-red-50 text-red-700",
} as const;

export type TagVariant = keyof typeof VARIANTS;

export function StatusTag({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: TagVariant;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
