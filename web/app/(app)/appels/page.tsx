import { StatusTag } from "@/components/StatusTag";
import { getCalls } from "@/lib/data";

export default async function AppelsPage() {
  const calls = await getCalls();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Journal des appels</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Chaque appel pris par SWIPT, avec son statut et la demande extraite.
            Vous pouvez tout relire et corriger.
          </p>
        </div>
        <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Exporter CSV
        </button>
      </div>

      {calls.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-10 text-center text-sm text-soft">
          Aucun appel enregistré pour le moment.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[11px] border border-line">
          {calls.map((c) => (
            <div key={c.id} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4">
              <div className="font-mono text-[12.5px] text-faint">{c.time}</div>
              <div>
                <div className="text-[14.5px] font-[550]">{c.customer}</div>
                <div className="text-[13px] text-soft">{c.request}</div>
              </div>
              <div className="sm:justify-self-end">
                <StatusTag variant={c.statusVariant}>{c.statusLabel}</StatusTag>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-[13px] text-soft">
        Données lues en direct depuis Supabase (RLS active). Transcription
        intégrale et correction de fiche via{" "}
        <code className="font-mono text-faint">getCall</code> /{" "}
        <code className="font-mono text-faint">correctExtraction</code>.
      </p>
    </div>
  );
}
