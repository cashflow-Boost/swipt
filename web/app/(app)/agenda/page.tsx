// Données de référence (semaine type). Seront servies par lib/actions/appointments.ts
// une fois Supabase connecté. source : "agent" (posé par SWIPT) | "manual" (posé par vous).
type Slot = { source: "agent" | "manual"; time: string; label: string; locked?: boolean };
type Day = { name: string; date: string; slots: Slot[] };

const WEEK: Day[] = [
  { name: "Mar", date: "12 nov", slots: [
    { source: "manual", time: "08:00", label: "Chantier Ferreira" },
    { source: "agent", time: "14:00", label: "Mme Kadri — WC" },
  ] },
  { name: "Mer", date: "13 nov", slots: [
    { source: "agent", time: "08:00", label: "Mme Réaux — fuite évier" },
    { source: "manual", time: "12:00", label: "Déjeuner — bloqué", locked: true },
    { source: "agent", time: "15:30", label: "M. Lopes — robinet" },
  ] },
  { name: "Jeu", date: "14 nov", slots: [
    { source: "agent", time: "14:00", label: "M. Bourdin — chaudière" },
  ] },
  { name: "Ven", date: "15 nov", slots: [
    { source: "manual", time: "08:00", label: "Chantier Ferreira (suite)" },
  ] },
  { name: "Sam", date: "16 nov", slots: [
    { source: "agent", time: "09:00", label: "Mme Trinh — serrure" },
  ] },
  { name: "Lun", date: "18 nov", slots: [] },
];

export default function AgendaPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Agenda</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Vos rendez-vous et ceux posés par SWIPT. Un créneau bloqué par vous
            est intouchable par l&apos;agent.
          </p>
        </div>
        <button
          type="button"
          className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold"
        >
          Bloquer un créneau
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {WEEK.map((d) => (
          <div
            key={d.name}
            className="min-h-[210px] overflow-hidden rounded-[10px] border border-line"
          >
            <div className="border-b border-line bg-w2 p-2 text-center text-[12px] font-semibold">
              {d.name}
              <span className="block font-mono text-[10.5px] font-normal text-faint">
                {d.date}
              </span>
            </div>
            {d.slots.map((s, i) => (
              <div
                key={i}
                className={[
                  "m-1.5 rounded-[7px] border p-2 text-[11.5px] leading-[1.35]",
                  s.source === "agent"
                    ? "border-or-line bg-or-wash"
                    : "border-line2 bg-w3",
                ].join(" ")}
              >
                <b className="block font-mono text-[10.5px] font-medium text-soft">
                  {s.time}
                  {s.locked && " · verrouillé"}
                </b>
                {s.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* légende — l'information n'est pas portée par la seule couleur (SPEC §3.6) */}
      <div className="mt-3.5 flex flex-wrap gap-4 text-[12.5px] text-soft">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-[3px] border border-or-line bg-or-wash" />
          Posé par SWIPT
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-[3px] border border-line2 bg-w3" />
          Posé par vous — SWIPT n&apos;y touche pas
        </span>
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. La création passe par{" "}
        <code className="font-mono text-faint">blockSlot</code> /{" "}
        <code className="font-mono text-faint">moveAppointment</code>{" "}
        (<code className="font-mono text-faint">lib/actions/appointments.ts</code>) ;
        un créneau verrouillé refuse tout déplacement par l&apos;agent.
      </p>
    </div>
  );
}
