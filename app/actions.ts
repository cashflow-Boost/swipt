"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth";
import { updateAgentSettings } from "@/lib/actions/agent-settings";
import { createQuote, validateQuote } from "@/lib/actions/quotes";
import { markPaid, issueInvoiceFromQuote } from "@/lib/actions/invoices";
import { blockSlot } from "@/lib/actions/appointments";
import { correctExtraction } from "@/lib/actions/calls";
import { createCustomer } from "@/lib/actions/customers";

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

/**
 * « Je reprends la main » (SPEC §4.9) : bascule la pause de l'agent vocal pour
 * l'organisation courante. La RLS restreint la mise à jour à sa propre org.
 */
export async function setAgentPausedAction(formData: FormData) {
  const c = await ctx();
  const paused = String(formData.get("paused")) === "true";
  const supabase = await createClient();
  await supabase.from("organizations").update({ agent_paused: paused }).eq("id", c.orgId);
  revalidatePath("/", "layout");
}

type LineInput = { label: string; quantity: number; unitPriceCents: number; vatRate: number };

export async function createQuoteAction(formData: FormData) {
  const c = await ctx();
  let lines: LineInput[] = [];
  try {
    lines = JSON.parse(String(formData.get("lines") || "[]"));
  } catch {}
  lines = lines.filter((l) => l.label && l.quantity > 0);
  if (lines.length === 0) throw new Error("Ajoutez au moins une ligne.");
  await createQuote.withContext(c)({
    customerId: str(formData, "customerId"),
    lines: lines as never,
  });
  revalidatePath("/devis");
  redirect("/devis");
}

export async function validateQuoteAction(formData: FormData) {
  await validateQuote.withContext(await ctx())({ quoteId: String(formData.get("id")) });
  revalidatePath("/devis");
  revalidatePath("/tableau-de-bord");
}

export async function issueInvoiceAction(formData: FormData) {
  await issueInvoiceFromQuote.withContext(await ctx())({ quoteId: String(formData.get("id")) });
  revalidatePath("/devis");
  revalidatePath("/factures");
}

export async function markInvoicePaidAction(formData: FormData) {
  await markPaid.withContext(await ctx())({ invoiceId: String(formData.get("id")) });
  revalidatePath("/factures");
}

function parseList(fd: FormData, k: string): string[] | undefined {
  const v = str(fd, k);
  if (!v) return undefined;
  return v.split(/[·,;]/).map((x) => x.trim()).filter(Boolean);
}

export async function saveAgentSettingsAction(formData: FormData) {
  const euros = num(formData, "calloutFeeEuros");
  const ring = num(formData, "ringCount");
  await updateAgentSettings.withContext(await ctx())({
    announcedName: str(formData, "announcedName"),
    trade: str(formData, "trade"),
    businessPhone: str(formData, "businessPhone"),
    zoneCenter: str(formData, "zoneCenter"),
    zoneRadiusKm: num(formData, "zoneRadiusKm"),
    ringCount: ring !== undefined ? Math.min(9, Math.max(1, Math.round(ring))) : undefined,
    calloutFeeCents: euros !== undefined ? Math.round(euros * 100) : undefined,
    urgentTriggers: parseList(formData, "urgentTriggers"),
    refusalRules: parseList(formData, "refusalRules"),
  });
  revalidatePath("/reglages");
}

export async function createCustomerAction(formData: FormData) {
  const fullName = str(formData, "fullName");
  if (!fullName) throw new Error("Le nom est requis.");
  await createCustomer.withContext(await ctx())({
    fullName,
    phone: str(formData, "phone"),
    address: str(formData, "address"),
  });
  revalidatePath("/clients");
}

export async function correctExtractionAction(formData: FormData) {
  let current: Record<string, unknown> = {};
  try {
    current = JSON.parse(String(formData.get("current") || "{}"));
  } catch {}
  const request = str(formData, "request");
  const urgency = str(formData, "urgency");
  const extraction = {
    ...current,
    ...(request ? { request } : {}),
    ...(urgency ? { urgency } : {}),
  };
  await correctExtraction.withContext(await ctx())({
    callId: String(formData.get("callId")),
    extraction,
  });
  revalidatePath("/appels");
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
