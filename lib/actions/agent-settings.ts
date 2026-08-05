import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

/**
 * Réglages de l'agent (SPEC §4.8) — « ce qui transforme un service générique
 * en son standard ». Une ligne par organisation dans agent_settings.
 */

const businessHoursSchema = z.record(
  z.string(),
  z.array(z.tuple([z.string(), z.string()])),
);

export const getAgentSettings = defineAction({
  name: "getAgentSettings",
  description:
    "Renvoie les réglages de l'agent vocal de l'organisation (nom annoncé, zone, horaires, forfait, refus…).",
  input: z.object({}),
  handler: async (_input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_settings")
      .select("*")
      .eq("org_id", ctx.orgId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
});

export const updateAgentSettings = defineAction({
  name: "updateAgentSettings",
  description:
    "Met à jour les réglages de l'agent vocal (création si absents). Champs partiels acceptés.",
  input: z.object({
    announcedName: z.string().max(120).optional(),
    trade: z.string().max(120).optional(),
    greeting: z.string().max(300).optional(),
    customInstructions: z.string().max(1500).optional(),
    businessPhone: z.string().max(40).optional(),
    zoneCenter: z.string().max(200).optional(),
    zoneRadiusKm: z.number().int().min(0).max(200).optional(),
    businessHours: businessHoursSchema.optional(),
    ringCount: z.number().int().min(1).max(12).optional(),
    calloutFeeCents: z.number().int().nonnegative().optional(),
    urgentTriggers: z.array(z.string()).optional(),
    refusalRules: z.array(z.string()).optional(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const row = {
      org_id: ctx.orgId,
      announced_name: input.announcedName,
      trade: input.trade,
      greeting: input.greeting,
      custom_instructions: input.customInstructions,
      business_phone: input.businessPhone,
      zone_center: input.zoneCenter,
      zone_radius_km: input.zoneRadiusKm,
      business_hours: input.businessHours,
      ring_count: input.ringCount,
      callout_fee_cents: input.calloutFeeCents,
      urgent_triggers: input.urgentTriggers,
      refusal_rules: input.refusalRules,
      updated_at: new Date().toISOString(),
    };
    // Ne pas écraser avec des undefined : on ne garde que les champs fournis.
    const patch = Object.fromEntries(
      Object.entries(row).filter(([, v]) => v !== undefined),
    );
    const { error } = await supabase
      .from("agent_settings")
      .upsert(patch, { onConflict: "org_id" });
    if (error) throw new Error(error.message);

    // Le nom annoncé EST le nom commercial : on le répercute sur l'organisation
    // pour que l'en-tête de l'application et les documents restent cohérents.
    const org: Record<string, string> = {};
    if (input.announcedName?.trim()) org.name = input.announcedName.trim();
    if (input.trade?.trim()) org.trade = input.trade.trim();
    if (Object.keys(org).length > 0) {
      const { error: orgErr } = await supabase
        .from("organizations")
        .update(org)
        .eq("id", ctx.orgId);
      if (orgErr) throw new Error(orgErr.message);
    }
    return { ok: true as const };
  },
});
