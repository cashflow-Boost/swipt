/** Écran non encore construit — gabarit temporaire de la Phase 1. */
export function Placeholder({
  title,
  subtitle,
  spec,
}: {
  title: string;
  subtitle: string;
  spec: string;
}) {
  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">{title}</h1>
        <p className="mt-1 text-sm text-soft">{subtitle}</p>
      </div>
      <div className="rounded-[11px] border border-dashed border-line2 bg-w px-5 py-10 text-center">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">
          À construire
        </p>
        <p className="mx-auto mt-2 max-w-[46ch] text-sm text-soft">
          Module prévu par la spécification ({spec}). Il sera bâti sur la couche{" "}
          <code className="font-mono text-faint">lib/actions/</code>.
        </p>
      </div>
    </div>
  );
}
