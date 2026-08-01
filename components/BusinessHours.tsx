import { saveBusinessHoursAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

const DAYS: { k: string; label: string }[] = [
  { k: "mon", label: "Lun" },
  { k: "tue", label: "Mar" },
  { k: "wed", label: "Mer" },
  { k: "thu", label: "Jeu" },
  { k: "fri", label: "Ven" },
  { k: "sat", label: "Sam" },
  { k: "sun", label: "Dim" },
];

export type Hours = Record<string, [string, string][]> | null;

/**
 * Horaires de disponibilité (SPEC §4.8), avec pause déjeuner.
 *
 * Un seul jeu matin / après-midi appliqué aux jours cochés — c'est ce qui
 * couvre la quasi-totalité des artisans, sans imposer sept lignes à remplir.
 * L'agent ne propose de créneau que dans ces plages.
 */
export function BusinessHours({ hours }: { hours: Hours }) {
  const h = hours ?? {};
  const openDays = DAYS.filter((d) => h[d.k]?.length).map((d) => d.k);
  const configured = openDays.length > 0;

  // Pré-remplissage depuis le premier jour ouvré configuré.
  const ref = openDays.length ? h[openDays[0]] : [];
  const morning = ref[0] ?? ["07:00", "12:00"];
  const afternoon = ref[1] ?? ["13:30", "18:00"];

  const defaultDays = configured ? openDays : ["mon", "tue", "wed", "thu", "fri"];

  return (
    <form action={saveBusinessHoursAction} className="rounded-2xl bg-white p-6">
      <h2 className="text-sm font-semibold text-slate-900">Horaires de disponibilité</h2>

      <div className="mt-5">
        <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Jours ouvrés
        </span>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <label
              key={d.k}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700"
            >
              <input
                type="checkbox"
                name={`${d.k}-open`}
                defaultChecked={defaultDays.includes(d.k)}
                className="h-4 w-4 accent-[var(--or)]"
              />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <TimeField name="morning-from" label="Matin — début" value={morning[0]} />
        <TimeField name="morning-to" label="Matin — fin" value={morning[1]} />
        <TimeField name="afternoon-from" label="Après-midi — début" value={afternoon[0]} />
        <TimeField name="afternoon-to" label="Après-midi — fin" value={afternoon[1]} />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Lia ne posera pas de rendez-vous en dehors de ces créneaux. Laissez l&apos;après-midi vide
        pour une journée continue le matin.
      </p>

      <SubmitButton
        pendingText="Enregistrement…"
        className="mt-6 h-10 rounded-full bg-or px-5 text-sm font-medium text-white"
      >
        Enregistrer les horaires
      </SubmitButton>
    </form>
  );
}

function TimeField({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <input
        type="time"
        name={name}
        defaultValue={value}
        className="h-11 w-full rounded-xl border-0 bg-slate-50 px-4 text-center text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </label>
  );
}
