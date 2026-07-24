import { getSessionOrg } from "@/lib/auth";
import { getAgentSettings } from "@/lib/actions/agent-settings";
import { createClient } from "@/lib/supabase/server";
import { saveAgentSettingsAction } from "@/app/actions";

type Settings = {
  announced_name: string | null;
  trade: string | null;
  zone_center: string | null;
  zone_radius_km: number | null;
  ring_count: number | null;
  callout_fee_cents: number | null;
  urgent_triggers: string[] | null;
  refusal_rules: string[] | null;
} | null;

export default async function ReglagesPage() {
  const session = await getSessionOrg();
  const s = (session
    ? await getAgentSettings.withContext({ orgId: session.orgId })({})
    : null) as Settings;

  let priceItemsCount = 0;
  if (session) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("price_items")
      .select("*", { count: "exact", head: true })
      .eq("org_id", session.orgId);
    priceItemsCount = count ?? 0;
  }

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Réglages de l&apos;agent</h1>
        <p className="mt-1 text-sm text-soft">
          Ce qui transforme un service générique en votre standard à vous.
          Modifiez et enregistrez — c&apos;est écrit en direct dans Supabase.
        </p>
      </div>

      <form action={saveAgentSettingsAction} className="max-w-2xl space-y-4">
        <Field label="Nom annoncé" name="announcedName" defaultValue={s?.announced_name ?? ""} placeholder="« Plomberie Vasseur, bonsoir »" />
        <Field label="Métier" name="trade" defaultValue={s?.trade ?? ""} placeholder="Plomberie et chauffage" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Zone (ville)" name="zoneCenter" defaultValue={s?.zone_center ?? ""} placeholder="Poissy" />
          <Field label="Rayon (km)" name="zoneRadiusKm" type="number" defaultValue={s?.zone_radius_km ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Déclenchement (sonneries)" name="ringCount" type="number" defaultValue={s?.ring_count ?? 4} />
          <Field label="Forfait déplacement (€ TTC)" name="calloutFeeEuros" type="number" step="0.01" defaultValue={s?.callout_fee_cents != null ? (s.callout_fee_cents / 100).toString() : ""} />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" className="rounded-pill bg-or px-4 py-2 text-[14px] font-semibold text-ink">
            Enregistrer
          </button>
          <span className="text-[12.5px] text-soft">Bibliothèque de prix : {priceItemsCount} ouvrage{priceItemsCount > 1 ? "s" : ""}</span>
        </div>
      </form>

      <div className="mt-6 max-w-2xl rounded-[11px] border border-line bg-w p-4 text-[13px] text-soft">
        <p><b className="text-ink">Urgences à transférer :</b> {s?.urgent_triggers?.join(" · ") || "—"}</p>
        <p className="mt-1"><b className="text-ink">Ce que SWIPT refuse :</b> {s?.refusal_rules?.join(" · ") || "—"}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-soft">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-sm border border-line2 bg-w px-3 py-2 text-[14.5px] outline-none focus-visible:border-or"
      />
    </label>
  );
}
