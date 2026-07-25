type Appt = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  source: "agent" | "manual";
  locked: boolean;
  label: string;
};

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_PX = 46;
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function mondayOf(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0 = lundi
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function hhmm(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function WeekCalendar({ appointments }: { appointments: Appt[] }) {
  // Semaine ancrée sur le lundi du premier rendez-vous (sinon aujourd'hui).
  const anchor = appointments.length
    ? appointments.reduce((m, a) => (a.startsAt < m ? a.startsAt : m), appointments[0].startsAt)
    : new Date();
  const weekStart = mondayOf(anchor);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const colHeight = (END_HOUR - START_HOUR) * HOUR_PX;

  const byDay: Appt[][] = Array.from({ length: 7 }, () => []);
  for (const a of appointments) {
    if (a.startsAt >= weekStart && a.startsAt < weekEnd) {
      const idx = (a.startsAt.getDay() + 6) % 7;
      byDay[idx].push(a);
    }
  }

  return (
    <div className="overflow-x-auto rounded-[11px] border border-line bg-w">
      <div className="min-w-[720px]">
        {/* en-tête des jours */}
        <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-line">
          <div />
          {DAYS.map((d, i) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            return (
              <div key={d} className="border-l border-line px-2 py-2 text-center">
                <div className="text-[12px] font-[600]">{d}</div>
                <div className="font-mono text-[10.5px] text-faint">
                  {date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                </div>
              </div>
            );
          })}
        </div>

        {/* corps : axe heures + 7 colonnes */}
        <div className="grid grid-cols-[48px_repeat(7,1fr)]">
          {/* axe des heures */}
          <div className="relative" style={{ height: colHeight }}>
            {hours.map((h, i) => (
              <div key={h} className="absolute right-1.5 -translate-y-1/2 font-mono text-[10px] text-faint" style={{ top: i * HOUR_PX }}>
                {h}h
              </div>
            ))}
          </div>

          {/* colonnes des jours */}
          {byDay.map((appts, di) => (
            <div key={di} className="relative border-l border-line" style={{ height: colHeight }}>
              {/* lignes d'heures */}
              {hours.map((h, i) => (
                <div key={h} className="absolute inset-x-0 border-t border-line/70" style={{ top: i * HOUR_PX }} />
              ))}
              {/* rendez-vous */}
              {appts.map((a) => {
                const s = a.startsAt.getHours() + a.startsAt.getMinutes() / 60;
                const e = a.endsAt.getHours() + a.endsAt.getMinutes() / 60;
                const top = Math.max(0, (s - START_HOUR) * HOUR_PX);
                const height = Math.max(24, (e - s) * HOUR_PX);
                const cls = a.locked
                  ? "bg-ink text-w border-ink"
                  : a.source === "agent"
                    ? "bg-or-wash border-or-line text-or-t"
                    : "bg-w3 border-line2 text-ink";
                return (
                  <div
                    key={a.id}
                    className={`absolute inset-x-1 overflow-hidden rounded-[6px] border px-1.5 py-1 ${cls}`}
                    style={{ top, height }}
                    title={`${a.label} · ${hhmm(a.startsAt)} – ${hhmm(a.endsAt)}`}
                  >
                    <div className="font-mono text-[10px] leading-tight opacity-90">
                      {hhmm(a.startsAt)} – {hhmm(a.endsAt)}
                    </div>
                    <div className="truncate text-[11.5px] font-[550] leading-tight">{a.label}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
