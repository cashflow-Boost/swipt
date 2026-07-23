import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { defineAction } from "./types";

/** Créneau bloqué par l'artisan — intouchable par l'agent (SPEC §4.2). */
export const blockSlot = defineAction({
  name: "blockSlot",
  description:
    "Bloque un créneau de l'agenda (déjeuner, rendez-vous perso…). L'agent vocal ne posera jamais de rendez-vous dessus.",
  input: z.object({
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    notes: z.string().max(280).optional(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        org_id: ctx.orgId,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        source: "manual",
        locked: true,
        notes: input.notes ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id as string };
  },
});

/** Déplace un rendez-vous. Un créneau verrouillé ne peut pas être déplacé par l'agent. */
export const moveAppointment = defineAction({
  name: "moveAppointment",
  description:
    "Déplace un rendez-vous existant vers un nouveau créneau, à condition qu'il ne soit pas verrouillé.",
  input: z.object({
    appointmentId: z.string().uuid(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
  }),
  handler: async (input, ctx) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointments")
      .update({ starts_at: input.startsAt, ends_at: input.endsAt })
      .eq("id", input.appointmentId)
      .eq("org_id", ctx.orgId)
      .eq("locked", false)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Rendez-vous introuvable ou verrouillé.");
    return { id: data.id as string };
  },
});
