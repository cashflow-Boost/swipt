import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

/**
 * Grille de prix de l'artisan (SPEC §4.3). C'est elle qui permet à l'agent de
 * chiffrer un devis : sans ligne de prix, aucun devis ne peut être proposé.
 */

const VAT = z.union([z.literal(20), z.literal(10), z.literal(5.5)]);

export const listPriceItems = defineAction({
  name: "listPriceItems",
  description: "Liste la grille de prix de l'organisation (libellé, unité, prix unitaire, TVA).",
  input: z.object({}),
  handler: async (_input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("price_items")
      .select("id, label, unit, unit_price_cents, vat_rate, trade_category")
      .eq("org_id", ctx.orgId)
      .order("label");
    if (error) throw new Error(error.message);
    return data ?? [];
  },
});

export const createPriceItem = defineAction({
  name: "createPriceItem",
  description: "Ajoute un ouvrage à la grille de prix.",
  input: z.object({
    label: z.string().min(2).max(160),
    unit: z.string().max(40).optional(),
    unitPriceCents: z.number().int().nonnegative(),
    vatRate: VAT.default(20),
    tradeCategory: z.string().max(80).optional(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { error } = await supabase.from("price_items").insert({
      org_id: ctx.orgId,
      label: input.label,
      unit: input.unit ?? null,
      unit_price_cents: input.unitPriceCents,
      vat_rate: input.vatRate,
      trade_category: input.tradeCategory ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  },
});

export const deletePriceItem = defineAction({
  name: "deletePriceItem",
  description: "Retire un ouvrage de la grille de prix.",
  input: z.object({ id: z.string().uuid() }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("price_items")
      .delete()
      .eq("id", input.id)
      .eq("org_id", ctx.orgId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  },
});
