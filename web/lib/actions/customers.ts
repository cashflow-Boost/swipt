import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

/** Crée une fiche client (SPEC §4.6). */
export const createCustomer = defineAction({
  name: "createCustomer",
  description: "Crée une fiche client (nom, téléphone, adresse).",
  input: z.object({
    fullName: z.string().min(1),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers")
      .insert({
        org_id: ctx.orgId,
        full_name: input.fullName,
        phone: input.phone ?? null,
        address: input.address ?? null,
        first_seen_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id as string };
  },
});

/** Fiche client — consultée par l'agent vocal pendant l'appel (SPEC §4.6). */
export const getCustomer = defineAction({
  name: "getCustomer",
  description:
    "Renvoie la fiche d'un client (coordonnées, adresse, notes) pour reconnaître un habitué.",
  input: z.object({ customerId: z.string().uuid() }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", input.customerId)
      .eq("org_id", ctx.orgId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
});

/** Historique d'interventions d'un client (repère les pannes répétées — SPEC §4.6). */
export const getHistory = defineAction({
  name: "getHistory",
  description:
    "Renvoie l'historique d'interventions d'un client, du plus récent au plus ancien.",
  input: z.object({ customerId: z.string().uuid(), limit: z.number().int().min(1).max(50).default(20) }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("calls")
      .select("id, started_at, status, urgency, extraction")
      .eq("customer_id", input.customerId)
      .eq("org_id", ctx.orgId)
      .order("started_at", { ascending: false })
      .limit(input.limit);
    if (error) throw new Error(error.message);
    return data;
  },
});
