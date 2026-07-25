import { createClient } from "@/lib/supabase/server";

// Accès aux données de l'organisation connectée. La RLS (SPEC §7) restreint
// automatiquement chaque requête à l'org de l'utilisateur : pas besoin de
// filtrer sur org_id côté lecture.

function custName(c: unknown): string {
  const x = Array.isArray(c) ? c[0] : c;
  return (x as { full_name?: string | null } | null)?.full_name ?? "—";
}

const STATUS_LABEL: Record<string, string> = {
  handled: "Traité",
  transferred: "Transféré",
  out_of_zone: "Hors zone",
  discarded: "Écarté",
};
const STATUS_VARIANT: Record<string, "gr" | "rd" | "neutral"> = {
  handled: "gr",
  transferred: "rd",
  out_of_zone: "neutral",
  discarded: "neutral",
};

export async function getCalls() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("calls")
    .select("id, started_at, status, urgency, duration_seconds, extraction, customers(full_name)")
    .order("started_at", { ascending: false });
  return (data ?? []).map((c) => ({
    id: c.id as string,
    time: new Date(c.started_at as string).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    customer: custName(c.customers),
    request: (c.extraction as { request?: string } | null)?.request ?? "—",
    status: c.status as string | null,
    statusLabel: c.status ? (STATUS_LABEL[c.status] ?? c.status) : "—",
    statusVariant: c.status ? (STATUS_VARIANT[c.status] ?? "neutral") : "neutral",
  }));
}

export async function getAppointments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("id, starts_at, ends_at, source, locked, notes, customers(full_name)")
    .order("starts_at", { ascending: true });
  return (data ?? []).map((a) => ({
    id: a.id as string,
    startsAt: new Date(a.starts_at as string),
    endsAt: new Date(a.ends_at as string),
    source: a.source as "agent" | "manual",
    locked: a.locked as boolean,
    label: (a.notes as string | null) || custName(a.customers),
  }));
}

export async function getQuotes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("id, number, status, total_ht_cents, total_ttc_cents, sent_at, customers(full_name)")
    .order("number", { ascending: false });
  return (data ?? []).map((q) => ({
    id: q.id as string,
    number: q.number as string | null,
    status: q.status as string,
    customer: custName(q.customers),
    totalHtCents: q.total_ht_cents as number,
    totalTtcCents: q.total_ttc_cents as number,
  }));
}

export async function getInvoices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("id, number, status, due_date, total_ttc_cents, paid_at")
    .order("due_date", { ascending: false });
  return (data ?? []).map((i) => ({
    id: i.id as string,
    number: i.number as string | null,
    status: i.status as string,
    dueDate: i.due_date as string | null,
    totalTtcCents: i.total_ttc_cents as number,
    paidAt: i.paid_at as string | null,
  }));
}

export async function getReminders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reminders")
    .select("id, target_type, sequence_index, sent_at, outcome")
    .order("sent_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id as string,
    targetType: r.target_type as string,
    sequenceIndex: r.sequence_index as number,
    sentAt: r.sent_at as string | null,
    outcome: r.outcome as string | null,
  }));
}

export async function getLatestCallDetail() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("calls")
    .select("id, started_at, duration_seconds, status, urgency, transcript, extraction, customers(full_name)")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id as string,
    startedAt: new Date(data.started_at as string),
    duration: data.duration_seconds as number | null,
    customer: custName(data.customers),
    status: data.status as string | null,
    transcript: (data.transcript as { role: string; text: string }[] | null) ?? [],
    extraction: (data.extraction as Record<string, unknown> | null) ?? {},
  };
}

export async function getCustomers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, full_name, phone, address, floor, access_code, first_seen_at")
    .order("first_seen_at", { ascending: true });
  return data ?? [];
}
