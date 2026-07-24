import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

/** Émet une facture à partir d'un devis signé — aucune ressaisie (SPEC §4.4). */
export const issueInvoiceFromQuote = defineAction({
  name: "issueInvoiceFromQuote",
  description:
    "Émet une facture à partir d'un devis signé (reprend le montant TTC, échéance à 30 jours).",
  input: z.object({ quoteId: z.string().uuid() }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data: q, error } = await supabase
      .from("quotes")
      .select("id, number, total_ttc_cents, status")
      .eq("id", input.quoteId)
      .eq("org_id", ctx.orgId)
      .single();
    if (error) throw new Error(error.message);
    if (q.status !== "signed") throw new Error("Le devis doit être signé.");

    const due = new Date();
    due.setDate(due.getDate() + 30);
    const { data, error: e2 } = await supabase
      .from("invoices")
      .insert({
        org_id: ctx.orgId,
        quote_id: q.id as string,
        number: q.number ? `F-${q.number}` : null,
        status: "issued",
        due_date: due.toISOString().slice(0, 10),
        total_ttc_cents: q.total_ttc_cents as number,
      })
      .select("id")
      .single();
    if (e2) throw new Error(e2.message);
    return { id: data.id as string };
  },
});

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
