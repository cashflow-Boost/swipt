import { getAppointments } from "@/lib/data";
import { blockSlotAction } from "@/app/actions";
import { WeekCalendar } from "@/components/WeekCalendar";
import { SubmitButton } from "@/components/SubmitButton";

export default async function AgendaPage() {
  const appts = await getAppointments();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Agenda</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Vos rendez-vous et ceux posés par Gildra. Un créneau bloqué par vous
            est intouchable par l&apos;agent.
          </p>
        </div>
        <details>
          <summary className="cursor-pointer list-none rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
            Bloquer un créneau
          </summary>
          <form action={blockSlotAction} className="mt-3 flex flex-wrap items-end gap-2 rounded-[11px] border border-line bg-w p-3">
            <label className="text-[12px] text-soft">Date<input name="date" type="date" required className="mt-1 block rounded-sm border border-line2 px-2 py-1.5 text-[13px]" /></label>
            <label className="text-[12px] text-soft">Début<input name="start" type="time" required className="mt-1 block rounded-sm border border-line2 px-2 py-1.5 text-[13px]" /></label>
            <label className="text-[12px] text-soft">Fin<input name="end" type="time" required className="mt-1 block rounded-sm border border-line2 px-2 py-1.5 text-[13px]" /></label>
            <label className="text-[12px] text-soft">Motif<input name="notes" placeholder="Déjeuner…" className="mt-1 block rounded-sm border border-line2 px-2 py-1.5 text-[13px]" /></label>
            <SubmitButton pendingText="…" className="rounded-pill bg-ink px-3.5 py-2 text-[13px] font-semibold text-w">Bloquer</SubmitButton>
          </form>
        </details>
      </div>

      {appts.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-10 text-center text-sm text-soft">
          Aucun rendez-vous cette semaine. Utilisez « Bloquer un créneau » pour réserver du temps.
        </p>
      ) : (
        <WeekCalendar appointments={appts} />
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-[12.5px] text-soft">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-[3px] border border-or-line bg-or-wash" /> Posé par Gildra
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-[3px] border border-line2 bg-w3" /> Posé par vous
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-[3px] bg-ink" /> Créneau bloqué (occupé)
        </span>
      </div>
    </div>
  );
}
