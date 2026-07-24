import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getTelephonyProvider } from "@/lib/telephony/provider";
import { defineAction } from "./types";

/** Récupère un appel avec sa transcription et sa fiche extraite (SPEC §4.1). */
export const getCall = defineAction({
  name: "getCall",
  description:
    "Renvoie un appel du journal : transcription intégrale, enregistrement et fiche extraite.",
  input: z.object({ callId: z.string().uuid() }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("calls")
      .select("*")
      .eq("id", input.callId)
      .eq("org_id", ctx.orgId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
});

/**
 * Corrige la fiche extraite d'un appel (SPEC §4.1). Si le rendez-vous change,
 * un SMS de correction est envoyé au client via l'abstraction téléphonie (§2.1).
 */
export const correctExtraction = defineAction({
  name: "correctExtraction",
  description:
    "Corrige les données extraites d'un appel. Si le rendez-vous change, envoie un SMS de correction au client.",
  input: z.object({
    callId: z.string().uuid(),
    extraction: z.record(z.string(), z.unknown()),
    smsToCustomer: z
      .object({ phone: z.string(), body: z.string().max(320) })
      .optional(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("calls")
      .update({
        extraction: input.extraction,
        corrected_by: ctx.userId ?? null,
        corrected_at: new Date().toISOString(),
      })
      .eq("id", input.callId)
      .eq("org_id", ctx.orgId);
    if (error) throw new Error(error.message);

    if (input.smsToCustomer) {
      await getTelephonyProvider().sendSms({
        to: input.smsToCustomer.phone,
        body: input.smsToCustomer.body,
      });
    }
    return { ok: true as const };
  },
});
