import { saveBusinessHoursAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

const DAYS: { k: string; label: string }[] = [
  { k: "mon", label: "Lundi" },
  { k: "tue", label: "Mardi" },
  { k: "wed", label: "Mercredi" },
  { k: "thu", label: "Jeudi" },
  { k: "fri", label: "Vendredi" },
  { k: "sat", label: "Samedi" },
  { k: "sun", label: "Dimanche" },
];

export type Hours = Record<string, [string, string][]> | null;

/**
 * Horaires de disponibilité (SPEC §4.8). L'agent ne propose de créneau que
 * dans ces plages : sans elles, un rendez-vous peut tomber un dimanche à 3 h.
 * Par défaut, du lundi au vendredi 8 h – 18 h.
 */
export function BusinessHours({ hours }: { hours: Hours }) {
  const h = hours ?? {};
  const configured = Object.keys(h).length > 0;

  return (
    <form action={saveBusinessHoursAction} className="rounded-[12px] border border-line bg-w p-4">
      <h2 className="text-[14.5px] font-[650]">Horaires de disponibilité</h2>
      <p className="mt-1 text-[13px] text-soft">
        Les créneaux que l&apos;agent peut proposer. En dehors, il note la demande et vous rappelez.
      </p>

      {!configured && (
        <p className="mt-3 rounded-sm border border-or-line bg-or-wash px-3 py-2 text-[12.5px] text-or-t">
          Aucun horaire enregistré : l&apos;agent applique par défaut du lundi au vendredi, 8 h – 18 h.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {DAYS.map((d) => {
          const slot = h[d.k]?.[0];
          const open = Boolean(slot);
          const defaultOpen = configured ? open : d.k !== "sat" && d.k !== "sun";
          return (
            <div key={d.k} className="flex flex-wrap items-center gap-3">
              <label className="flex w-36 shrink-0 items-center gap-2 text-[13.5px]">
                <input
                  type="checkbox"
                  name={`${d.k}-open`}
                  defaultChecked={defaultOpen}
                  className="h-4 w-4 accent-[var(--or)]"
                />
                {d.label}
              </label>
              <label className="text-[12px] text-soft">
                de
                <input
                  type="time"
                  name={`${d.k}-from`}
                  defaultValue={slot?.[0] ?? "08:00"}
                  className="ml-1.5 rounded-sm border border-line2 px-2 py-1.5 text-[13px]"
                />
              </label>
              <label className="text-[12px] text-soft">
                à
                <input
                  type="time"
                  name={`${d.k}-to`}
                  defaultValue={slot?.[1] ?? "18:00"}
                  className="ml-1.5 rounded-sm border border-line2 px-2 py-1.5 text-[13px]"
                />
              </label>
            </div>
          );
        })}
      </div>

      <SubmitButton
        pendingText="Enregistrement…"
        className="mt-4 rounded-pill bg-or px-4 py-2 text-[14px] font-semibold text-w"
      >
        Enregistrer les horaires
      </SubmitButton>
    </form>
  );
}
