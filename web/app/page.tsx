const MODULES = [
  { path: "/tableau-de-bord", label: "Tableau de bord" },
  { path: "/appels", label: "Journal des appels", star: true },
  { path: "/agenda", label: "Agenda" },
  { path: "/devis", label: "Devis" },
  { path: "/factures", label: "Factures" },
  { path: "/relances", label: "Relances" },
  { path: "/clients", label: "Clients" },
  { path: "/reglages", label: "Réglages de l'agent" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-3 flex items-center gap-2 text-[19px] font-bold tracking-tight">
        <span>SWIPT</span>
        <span className="flex gap-0.5">
          <i className="block h-3.5 w-[7px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
          <i className="block h-3.5 w-[7px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
        </span>
      </div>

      <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-or-t">
        Phase 0 — fondations
      </p>
      <h1 className="mt-3 max-w-[20ch] text-4xl font-[650] leading-[1.06] tracking-[-0.035em]">
        Le socle est en place.
      </h1>
      <p className="mt-4 max-w-[54ch] text-soft">
        Next.js, tokens de conception, abstractions téléphonie/voix et schéma
        multi-tenant avec RLS. Les huit écrans se construisent ensuite, dans
        l&apos;ordre de la spécification.
      </p>

      <ul className="mt-10 divide-y divide-line rounded-[11px] border border-line">
        {MODULES.map((m) => (
          <li
            key={m.path}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <span className="flex items-center gap-2 font-medium">
              {m.label}
              {m.star && (
                <span className="rounded-pill bg-or-wash px-2 py-0.5 text-[11px] font-semibold text-or-t">
                  critique
                </span>
              )}
            </span>
            <code className="font-mono text-[12.5px] text-faint">{m.path}</code>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[13px] text-soft">
        Configurer <code className="font-mono text-faint">.env.local</code>{" "}
        (voir <code className="font-mono text-faint">.env.example</code>) puis
        appliquer la migration{" "}
        <code className="font-mono text-faint">
          supabase/migrations/0001_init.sql
        </code>
        .
      </p>
    </main>
  );
}
