import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

/** Marque une facture comme payée (SPEC §4.4). */
export const markPaid = defineAction({
  name: "markPaid",
  description: "Marque une facture comme payée à la date indiquée (par défaut maintenant).",
  input: z.object({
    invoiceId: z.string().uuid(),
    paidAt: z.string().datetime().optional(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("invoices")
      .update({ status: "paid", paid_at: input.paidAt ?? new Date().toISOString() })
      .eq("id", input.invoiceId)
      .eq("org_id", ctx.orgId)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Facture introuvable.");
    return { id: data.id as string };
  },
});

/**
 * Enregistre l'envoi d'une relance (SPEC §4.5). Le 3ᵉ envoi d'une facture
 * requiert la validation de l'artisan : la couche action refuse au-delà de
 * l'index 2 sans le drapeau explicite.
 */
export const sendReminder = defineAction({
  name: "sendReminder",
  description:
    "Journalise l'envoi d'une relance pour un devis ou une facture ; refuse le 3ᵉ envoi facture sans validation explicite.",
  input: z.object({
    targetType: z.enum(["quote", "invoice"]),
    targetId: z.string().uuid(),
    sequenceIndex: z.number().int().min(0),
    artisanApproved: z.boolean().default(false),
  }),
  handler: async (input, ctx) => {
    if (
      input.targetType === "invoice" &&
      input.sequenceIndex >= 2 &&
      !input.artisanApproved
    ) {
      throw new Error(
        "Le 3ᵉ rappel de facture requiert la validation de l'artisan (SPEC §4.5).",
      );
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reminders")
      .insert({
        org_id: ctx.orgId,
        target_type: input.targetType,
        target_id: input.targetId,
        sequence_index: input.sequenceIndex,
        sent_at: new Date().toISOString(),
        outcome: "pending",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id as string };
  },
});
