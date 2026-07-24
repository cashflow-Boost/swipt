"use server";

import { revalidatePath } from "next/cache";
import { getSessionOrg } from "@/lib/auth";
import { updateAgentSettings } from "@/lib/actions/agent-settings";
import { validateQuote } from "@/lib/actions/quotes";
import { markPaid } from "@/lib/actions/invoices";
import { blockSlot } from "@/lib/actions/appointments";

// Server Actions : l'interface APPELLE les fonctions de lib/actions/, elle ne
// contient pas la logique métier (Addendum v1.1 §6).

async function ctx() {
  const s = await getSessionOrg();
  if (!s) throw new Error("Session expirée.");
  return { orgId: s.orgId, userId: s.userId };
}

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return v ? String(v) : undefined;
};
const num = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return v !== null && v !== "" ? Number(v) : undefined;
};

export async function validateQuoteAction(formData: FormData) {
  await validateQuote.withContext(await ctx())({ quoteId: String(formData.get("id")) });
  revalidatePath("/devis");
  revalidatePath("/tableau-de-bord");
}

export async function markInvoicePaidAction(formData: FormData) {
  await markPaid.withContext(await ctx())({ invoiceId: String(formData.get("id")) });
  revalidatePath("/factures");
}

export async function saveAgentSettingsAction(formData: FormData) {
  const euros = num(formData, "calloutFeeEuros");
  await updateAgentSettings.withContext(await ctx())({
    announcedName: str(formData, "announcedName"),
    trade: str(formData, "trade"),
    zoneCenter: str(formData, "zoneCenter"),
    zoneRadiusKm: num(formData, "zoneRadiusKm"),
    ringCount: num(formData, "ringCount"),
    calloutFeeCents: euros !== undefined ? Math.round(euros * 100) : undefined,
  });
  revalidatePath("/reglages");
}

export async function blockSlotAction(formData: FormData) {
  const date = String(formData.get("date"));
  const start = String(formData.get("start"));
  const end = String(formData.get("end"));
  await blockSlot.withContext(await ctx())({
    startsAt: new Date(`${date}T${start}:00`).toISOString(),
    endsAt: new Date(`${date}T${end}:00`).toISOString(),
    notes: str(formData, "notes"),
  });
  revalidatePath("/agenda");
}
