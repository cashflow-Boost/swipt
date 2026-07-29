import { getSessionOrg } from "@/lib/auth";
import { getAgentSettings } from "@/lib/actions/agent-settings";
import { createClient } from "@/lib/supabase/server";
import { saveAgentSettingsAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Telephony } from "@/components/Telephony";

type Settings = {
  announced_name: string | null;
  trade: string | null;
  business_phone: string | null;
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
  let swiptNumber: string | null = null;
  if (session) {
    const supabase = await createClient();
    const [{ count }, { data: org }] = await Promise.all([
      supabase
        .from("price_items")
        .select("*", { count: "exact", head: true })
        .eq("org_id", session.orgId),
      supabase
        .from("organizations")
        .select("phone_number")
        .eq("id", session.orgId)
        .maybeSingle(),
    ]);
    priceItemsCount = count ?? 0;
    swiptNumber = (org?.phone_number as string) ?? null;
  }

  // Ce qui manque avant que l'agent puisse décrocher correctement.
  const announced = (s?.announced_name ?? "").trim();
  const checks = [
    {
      ok: announced.length > 2 && announced.toLowerCase() !== (session?.orgName ?? "").toLowerCase(),
      label: "Nom annoncé au décroché",
      fix: "Mettez le nom commercial complet — c'est la première phrase que vos clients entendent.",
    },
    {
      ok: Boolean((s?.zone_center ?? "").trim()),
      label: "Zone d'intervention",
      fix: "Sans ville de référence, l'agent ne peut pas refuser le hors-zone.",
    },
    {
      ok: Boolean((s?.trade ?? "").trim()),
      label: "Métier",
      fix: "Permet à l'agent de qualifier la panne dans votre vocabulaire.",
    },
  ];
  const missing = checks.filter((c) => !c.ok);

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Réglages de l&apos;agent</h1>
        <p className="mt-1 text-sm text-soft">
          Ce qui transforme un service générique en votre standard à vous.
          Modifiez et enregistrez — c&apos;est écrit en direct dans Supabase.
        </p>
      </div>

      <div
        className={`mb-5 max-w-2xl rounded-[12px] border p-4 ${
          missing.length === 0 ? "border-line bg-w" : "border-or-line bg-or-wash"
        }`}
      >
        <h2 className={`text-[14.5px] font-[650] ${missing.length === 0 ? "" : "text-or-t"}`}>
          {missing.length === 0
            ? "✓ Votre agent est prêt à décrocher"
            : `L'agent n'est pas encore prêt — ${missing.length} réglage${missing.length > 1 ? "s" : ""} à compléter`}
        </h2>
        <ul className="mt-2.5 space-y-1.5 text-[13.5px]">
          {checks.map((c) => (
            <li key={c.label} className="flex gap-2">
              <span className={c.ok ? "text-gr" : "text-or-t"}>{c.ok ? "✓" : "○"}</span>
              <span className={c.ok ? "text-soft" : ""}>
                <b className="font-[600]">{c.label}</b>
                {!c.ok && <span className="text-soft"> — {c.fix}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form action={saveAgentSettingsAction} className="max-w-2xl space-y-4">
        <Field label="Nom annoncé" name="announcedName" defaultValue={s?.announced_name ?? ""} placeholder="« Plomberie Vasseur, bonsoir »" />
        <Field label="Métier" name="trade" defaultValue={s?.trade ?? ""} placeholder="Plomberie et chauffage" />
        <div className="rounded-[12px] border border-line bg-w p-4">
          <h2 className="text-[14.5px] font-[650]">Téléphonie</h2>
          <p className="mt-1 text-[13px] text-soft">
            Vous gardez votre numéro. Vos clients continuent de vous appeler normalement —
            AlloChantier ne prend l&apos;appel que si vous ne décrochez pas.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field
              label="Votre numéro professionnel"
              name="businessPhone"
              type="tel"
              defaultValue={s?.business_phone ?? ""}
              placeholder="06 12 34 56 78"
              hint="Celui que vos clients composent."
            />
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-soft">Votre numéro AlloChantier</span>
              <div className="w-full rounded-sm border border-dashed border-line2 bg-w2 px-3 py-2 font-mono text-[14px] text-soft">
                {swiptNumber ?? "en cours d'attribution"}
              </div>
              <span className="mt-1 block text-[12px] text-faint">La cible du renvoi. Attribué par AlloChantier.</span>
            </label>
          </div>
          <Telephony swiptNumber={swiptNumber} ringCount={s?.ring_count ?? 4} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Zone (ville)" name="zoneCenter" defaultValue={s?.zone_center ?? ""} placeholder="Poissy" />
          <Field label="Rayon (km)" name="zoneRadiusKm" type="number" min={0} max={200} defaultValue={s?.zone_radius_km ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Déclenchement (sonneries)" name="ringCount" type="number" min={1} max={9} defaultValue={s?.ring_count ?? 4} hint="Entre 1 et 9 sonneries." />
          <Field label="Forfait déplacement (€ TTC)" name="calloutFeeEuros" type="number" step="0.01" min={0} defaultValue={s?.callout_fee_cents != null ? (s.callout_fee_cents / 100).toString() : ""} />
        </div>
        <Field
          label="Urgences à transférer"
          name="urgentTriggers"
          defaultValue={s?.urgent_triggers?.join(" · ") ?? ""}
          placeholder="Fuite active · coupure totale · personne bloquée · odeur de gaz"
          hint="Séparez les cas par « · » ou une virgule."
        />
        <Field
          label="Ce qu'AlloChantier refuse"
          name="refusalRules"
          defaultValue={s?.refusal_rules?.join(" · ") ?? ""}
          placeholder="Démarchage · hors zone · hors métier · négociation de prix"
          hint="Séparez les règles par « · » ou une virgule."
        />

        <div className="flex items-center gap-3 pt-1">
          <SubmitButton pendingText="Enregistrement…" className="rounded-pill bg-or px-4 py-2 text-[14px] font-semibold text-ink">
            Enregistrer
          </SubmitButton>
          <span className="text-[12.5px] text-soft">Bibliothèque de prix : {priceItemsCount} ouvrage{priceItemsCount > 1 ? "s" : ""}</span>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  min,
  max,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  step?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-soft">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        min={min}
        max={max}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-sm border border-line2 bg-w px-3 py-2 text-[14.5px] outline-none focus-visible:border-or"
      />
      {hint && <span className="mt-1 block text-[12px] text-faint">{hint}</span>}
    </label>
  );
}
