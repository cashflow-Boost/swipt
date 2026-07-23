import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getTelephonyProvider } from "@/lib/telephony/provider";
import { ttcOf, vatOf, type VatRate } from "@/lib/money";
import { defineAction } from "./types";

const vatRateSchema = z.union([
  z.literal(20),
  z.literal(10),
  z.literal(5.5),
]);

const lineSchema = z.object({
  label: z.string().min(1),
  quantity: z.number().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  vatRate: vatRateSchema,
});

/** Totaux d'un devis, en centimes entiers (SPEC §13). TVA appliquée ligne par ligne (SPEC §4.3). */
function totals(lines: z.infer<typeof lineSchema>[]) {
  let totalHt = 0;
  let totalTtc = 0;
  const vatBreakdown: Record<string, number> = {};
  for (const l of lines) {
    const ht = Math.round(l.unitPriceCents * l.quantity);
    const rate = l.vatRate as VatRate;
    totalHt += ht;
    totalTtc += ttcOf(ht, rate);
    vatBreakdown[String(rate)] = (vatBreakdown[String(rate)] ?? 0) + vatOf(ht, rate);
  }
  return { totalHt, totalTtc, vatBreakdown };
}

/** Crée un devis chiffré (file « à valider » — SPEC §4.3). */
export const createQuote = defineAction({
  name: "createQuote",
  description:
    "Crée un devis à partir d'une liste de lignes chiffrées ; calcule les totaux HT/TTC et la TVA ligne par ligne.",
  input: z.object({
    customerId: z.string().uuid().optional(),
    callId: z.string().uuid().optional(),
    lines: z.array(lineSchema).min(1),
  }),
  handler: async (input, ctx) => {
    const { totalHt, totalTtc, vatBreakdown } = totals(input.lines);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        org_id: ctx.orgId,
        customer_id: input.customerId ?? null,
        call_id: input.callId ?? null,
        status: "to_validate",
        lines: input.lines,
        total_ht_cents: totalHt,
        total_ttc_cents: totalTtc,
        vat_breakdown: vatBreakdown,
      })
      .select("id, total_ht_cents, total_ttc_cents")
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
});

/** Envoie un devis au client par SMS et le passe en « envoyé ». */
export const sendQuote = defineAction({
  name: "sendQuote",
  description:
    "Envoie un devis validé au client (SMS avec lien) et bascule son statut en « envoyé ».",
  input: z.object({
    quoteId: z.string().uuid(),
    customerPhone: z.string(),
    smsBody: z.string().max(320),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("quotes")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", input.quoteId)
      .eq("org_id", ctx.orgId);
    if (error) throw new Error(error.message);
    await getTelephonyProvider().sendSms({
      to: input.customerPhone,
      body: input.smsBody,
    });
    return { ok: true as const };
  },
});
