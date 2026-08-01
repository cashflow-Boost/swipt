import { getSessionOrg } from "@/lib/auth";
import { getAgentSettings } from "@/lib/actions/agent-settings";
import { createClient } from "@/lib/supabase/server";
import { saveAgentSettingsAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { Telephony } from "@/components/Telephony";
import { BusinessHours } from "@/components/BusinessHours";
import Link from "next/link";

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
  business_hours: Record<string, [string, string][]> | null;
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
      supabase.from("price_items").select("*", { count: "exact", head: true }).eq("org_id", session.orgId),
      supabase.from("organizations").select("phone_number").eq("id", session.orgId).maybeSingle(),
    ]);
    priceItemsCount = count ?? 0;
    swiptNumber = (org?.phone_number as string) ?? null;
  }

  const announced = (s?.announced_name ?? "").trim();
  const checks = [
    {
      ok: announced.length > 2 && announced.toLowerCase() !== (session?.orgName ?? "").toLowerCase(),
      label: "Nom annoncé au décroché",
      fix: "Mettez le nom commercial complet — c'est la première phrase que vos clients entendent.",
    },
    { ok: Boolean((s?.zone_center ?? "").trim()), label: "Zone d'intervention", fix: "Sans ville de référence, l'agent ne peut pas refuser le hors-zone." },
    { ok: Boolean((s?.trade ?? "").trim()), label: "Métier", fix: "Permet à l'agent de qualifier la panne dans votre vocabulaire." },
  ];
  const missing = checks.filter((c) => !c.ok);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Réglages de l&apos;agent</h1>
        <p className="mt-1 text-sm text-slate-500">Ce qui transforme un service générique en votre standard à vous.</p>
      </div>

      {/* Préparation */}
      <div className="mb-4 rounded-2xl bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          {missing.length === 0
            ? "Votre agent est prêt à décrocher"
            : `Encore ${missing.length} réglage${missing.length > 1 ? "s" : ""} à compléter`}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {checks.map((c) => (
            <li key={c.label} className="flex gap-2.5">
              <span className={c.ok ? "text-emerald-600" : "text-amber-500"}>{c.ok ? "✓" : "○"}</span>
              <span className={c.ok ? "text-slate-500" : "text-slate-700"}>
                <span className="font-medium text-slate-900">{c.label}</span>
                {!c.ok && <span className="text-slate-500"> — {c.fix}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bloc 1 — Identité de l'agent */}
      <form action={saveAgentSettingsAction}>
        <div className="mb-4 rounded-2xl bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">État de l&apos;agent</h2>
          <div className="space-y-4">
            <Field label="Nom annoncé" name="announcedName" defaultValue={s?.announced_name ?? ""} placeholder="Plomberie Vasseur" />
            <Field label="Métier" name="trade" defaultValue={s?.trade ?? ""} placeholder="Plomberie et chauffage" />
          </div>
        </div>

        {/* Bloc 2 — Téléphonie */}
        <div className="mb-4 rounded-2xl bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">Téléphonie</h2>
          <p className="mb-4 text-xs text-slate-400">
            Vous gardez votre numéro. Lia ne prend l&apos;appel que si vous ne décrochez pas.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Votre numéro professionnel" name="businessPhone" type="tel" defaultValue={s?.business_phone ?? ""} placeholder="06 12 34 56 78" />
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">Numéro AlloChantier</span>
              <div className="flex h-11 items-center rounded-xl bg-slate-50 px-4 font-mono text-sm text-slate-400">
                {swiptNumber ?? "en cours d'attribution"}
              </div>
            </label>
          </div>
          <Telephony swiptNumber={swiptNumber} ringCount={s?.ring_count ?? 4} />
        </div>

        {/* Bloc 3 — Zone */}
        <div className="mb-4 rounded-2xl bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Zone d&apos;intervention</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Zone (ville)" name="zoneCenter" defaultValue={s?.zone_center ?? ""} placeholder="Poissy" />
            <Field label="Rayon (km)" name="zoneRadiusKm" type="number" min={0} max={200} defaultValue={s?.zone_radius_km ?? ""} />
            <Field label="Déclenchement (sonneries)" name="ringCount" type="number" min={1} max={9} defaultValue={s?.ring_count ?? 4} />
            <Field label="Forfait déplacement (€ TTC)" name="calloutFeeEuros" type="number" step="0.01" min={0} defaultValue={s?.callout_fee_cents != null ? (s.callout_fee_cents / 100).toString() : ""} />
          </div>
          <div className="mt-4 grid gap-4">
            <Field label="Urgences à transférer" name="urgentTriggers" defaultValue={s?.urgent_triggers?.join(" · ") ?? ""} placeholder="Fuite active · odeur de gaz · personne bloquée" />
            <Field label="Ce que Lia refuse" name="refusalRules" defaultValue={s?.refusal_rules?.join(" · ") ?? ""} placeholder="Démarchage · hors zone · négociation de prix" />
          </div>

          <div className="mt-5 flex items-center gap-4">
            <SubmitButton pendingText="Enregistrement…" className="h-10 rounded-full bg-or px-5 text-sm font-medium text-white">
              Enregistrer
            </SubmitButton>
            <span className="text-xs text-slate-500">
              {priceItemsCount} ouvrage{priceItemsCount > 1 ? "s" : ""} —{" "}
              <Link href="/mes-tarifs" className="font-medium text-blue-700 hover:text-blue-800">gérer mes tarifs</Link>
            </span>
          </div>
        </div>
      </form>

      {/* Horaires (formulaire distinct) */}
      <BusinessHours hours={s?.business_hours ?? null} />
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
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  step?: string;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        min={min}
        max={max}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border-0 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </label>
  );
}
