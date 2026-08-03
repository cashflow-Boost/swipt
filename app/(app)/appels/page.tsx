import { StatusTag } from "@/components/StatusTag";
import { getCalls, getLatestCallDetail } from "@/lib/data";
import { correctExtractionAction } from "@/app/actions";

const URGENCY: Record<string, string> = {
  low: "Faible",
  normal: "Normale",
  high: "Élevée",
  critical: "Critique",
};

export default async function AppelsPage() {
  const [detail, calls] = await Promise.all([getLatestCallDetail(), getCalls()]);
  const others = calls.filter((c) => c.id !== detail?.id);
  const ex = detail?.extraction ?? {};
  const request = (ex.request as string) ?? "—";
  const urgency = (ex.urgency as string) ?? "";
  const address = (ex.address as string) ?? null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Journal des appels</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Chaque appel pris par Rimova, avec sa transcription et la fiche extraite.
            Vous pouvez tout relire et corriger.
          </p>
        </div>
        <a href="/appels/export" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Exporter CSV
        </a>
      </div>

      {detail ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[11px] border border-line bg-w p-4">
            <h2 className="mb-2.5 text-[14.5px] font-semibold">
              {detail.customer} — {detail.startedAt.toLocaleString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
              {detail.duration ? ` · ${Math.floor(detail.duration / 60)} min ${detail.duration % 60}` : ""}
            </h2>
            {detail.transcript.length > 0 ? (
              <div className="flex flex-col gap-2">
                {detail.transcript.map((b, i) => (
                  <div
                    key={i}
                    className={[
                      "max-w-[88%] rounded-xl px-3 py-2 text-[13.8px] leading-[1.45]",
                      b.role === "caller" ? "self-start rounded-bl-[4px] bg-w3" : "self-end rounded-br-[4px] bg-ink text-w",
                    ].join(" ")}
                  >
                    {b.text}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13.5px] text-soft">Transcription non disponible pour cet appel.</p>
            )}
            <div className="mt-3.5 flex flex-wrap gap-2">
              <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
                Écouter l&apos;enregistrement
              </button>
            </div>
          </section>

          <section className="rounded-[11px] border border-line bg-w p-4">
            <h2 className="mb-2.5 text-[14.5px] font-semibold">Ce que Rimova en a retenu</h2>
            <Fld k="Client" v={detail.customer} />
            {address && <Fld k="Adresse" v={address} />}
            <Fld k="Demande" v={request} />
            <Fld k="Urgence" v={URGENCY[urgency] ?? "—"} hot={urgency === "high" || urgency === "critical"} />

            <details className="mt-3">
              <summary className="cursor-pointer list-none rounded-pill border border-or bg-or px-3.5 py-2 text-center text-[13px] font-semibold text-w">
                Corriger la fiche
              </summary>
              <form action={correctExtractionAction} className="mt-3 space-y-3">
                <input type="hidden" name="callId" value={detail.id} />
                <input type="hidden" name="current" value={JSON.stringify(ex)} />
                <label className="block text-[12.5px] text-soft">
                  Demande
                  <input name="request" defaultValue={request === "—" ? "" : request} className="mt-1 block w-full rounded-sm border border-line2 px-2.5 py-2 text-[14px]" />
                </label>
                <label className="block text-[12.5px] text-soft">
                  Urgence
                  <select name="urgency" defaultValue={urgency} className="mt-1 block w-full rounded-sm border border-line2 px-2.5 py-2 text-[14px]">
                    <option value="low">Faible</option>
                    <option value="normal">Normale</option>
                    <option value="high">Élevée</option>
                    <option value="critical">Critique</option>
                  </select>
                </label>
                <button type="submit" className="rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-w">
                  Enregistrer la correction
                </button>
              </form>
            </details>
          </section>
        </div>
      ) : (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-10 text-center text-sm text-soft">
          Aucun appel enregistré pour le moment.
        </p>
      )}

      {others.length > 0 && (
        <>
          <h2 className="mb-3 mt-6 text-[15px] font-semibold">Les autres appels</h2>
          <div className="overflow-hidden rounded-[11px] border border-line">
            {others.map((c) => (
              <div key={c.id} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4">
                <div className="font-mono text-[12.5px] text-faint">{c.time}</div>
                <div>
                  <div className="text-[14.5px] font-[550]">{c.customer}</div>
                  <div className="text-[13px] text-soft">{c.request}</div>
                </div>
                <div className="sm:justify-self-end"><StatusTag variant={c.statusVariant}>{c.statusLabel}</StatusTag></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Fld({ k, v, hot }: { k: string; v: string; hot?: boolean }) {
  return (
    <div className="border-b border-line py-2.5 last:border-b-0">
      <div className="font-mono text-[10px] uppercase tracking-[0.11em] text-faint">{k}</div>
      <div className={`mt-0.5 text-[14px] font-medium ${hot ? "text-or-t" : ""}`}>{v}</div>
    </div>
  );
}
