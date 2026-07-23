import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

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
