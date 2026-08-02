import { notFound, redirect } from "next/navigation";
import { getSessionOrg } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatEuros } from "@/lib/money";
import { PrintButton } from "@/components/PrintButton";

/**
 * Document imprimable (devis / facture). Rendu en page A4 propre : l'artisan
 * imprime ou enregistre en PDF depuis son navigateur, sans dépendance externe.
 *
 * NB : ce PDF n'est pas encore un Factur-X (PDF/A-3 avec XML embarqué), qui
 * exige une plateforme de dématérialisation agréée — étape distincte.
 */

type Customer = { full_name?: string; address?: string; phone?: string } | null;

type Line = {
  label?: string;
  quantity?: number;
  unitPriceCents?: number;
  unit_price_cents?: number;
  vatRate?: number;
  vat_rate?: number;
};

function normalize(l: Line) {
  return {
    label: l.label ?? "—",
    quantity: Number(l.quantity ?? 1),
    unitPriceCents: Number(l.unitPriceCents ?? l.unit_price_cents ?? 0),
    vatRate: Number(l.vatRate ?? l.vat_rate ?? 20),
  };
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (type !== "devis" && type !== "facture") notFound();

  const session = await getSessionOrg();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, siren, trade, phone_number")
    .eq("id", session.orgId)
    .maybeSingle();

  // Requêtes littérales et séparées : PostgREST infère les types depuis la
  // chaîne de select, une chaîne construite casserait l'inférence.
  const isQuote = type === "devis";
  const doc = isQuote
    ? (
        await supabase
          .from("quotes")
          .select(
            "id, number, status, lines, total_ht_cents, total_ttc_cents, vat_breakdown, customers(full_name, address, phone)",
          )
          .eq("id", id)
          .maybeSingle()
      ).data
    : (
        await supabase
          .from("invoices")
          .select("id, number, status, due_date, total_ttc_cents, paid_at, quote_id")
          .eq("id", id)
          .maybeSingle()
      ).data;

  if (!doc) notFound();
  const d = doc as unknown as Record<string, unknown>;

  // Une facture reprend les lignes de son devis d'origine.
  let lines: ReturnType<typeof normalize>[] = [];
  let vatBreakdown: Record<string, number> = {};
  let totalHt = 0;
  let customer: Customer = null;

  if (isQuote) {
    lines = ((d.lines as Line[]) ?? []).map(normalize);
    vatBreakdown = (d.vat_breakdown as Record<string, number>) ?? {};
    totalHt = Number(d.total_ht_cents ?? 0);
    const c = d.customers as Record<string, unknown> | Record<string, unknown>[] | null;
    customer = (Array.isArray(c) ? (c[0] ?? null) : c) as Customer;
  } else if (d.quote_id) {
    const { data: q } = await supabase
      .from("quotes")
      .select("lines, total_ht_cents, vat_breakdown, customers(full_name, address, phone)")
      .eq("id", d.quote_id as string)
      .maybeSingle();
    if (q) {
      lines = ((q.lines as Line[]) ?? []).map(normalize);
      vatBreakdown = (q.vat_breakdown as Record<string, number>) ?? {};
      totalHt = Number(q.total_ht_cents ?? 0);
      const c = q.customers as Record<string, unknown> | Record<string, unknown>[] | null;
      customer = (Array.isArray(c) ? (c[0] ?? null) : c) as Customer;
    }
  }

  const totalTtc = Number(d.total_ttc_cents ?? 0);
  const title = isQuote ? "Devis" : "Facture";
  const number = (d.number as string) ?? "—";

  return (
    <main className="mx-auto max-w-[820px] bg-w p-8 text-ink print:p-0">
      <div className="mb-6 flex justify-end gap-2 print:hidden">
        <PrintButton />
      </div>

      <div className="border border-line p-10 print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-2 text-[20px] font-bold tracking-tight">
              <span>{org?.name ?? "Gildra"}</span>
            </div>
            {org?.trade && <p className="mt-1 text-[13px] text-soft">{org.trade}</p>}
            {org?.phone_number && <p className="text-[13px] text-soft">{org.phone_number}</p>}
            {org?.siren && (
              <p className="mt-1 font-mono text-[11.5px] text-faint">SIREN {org.siren}</p>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-[26px] font-[650] tracking-[-0.03em]">{title}</h1>
            <p className="mt-1 font-mono text-[13px] text-soft">N° {number}</p>
            <p className="mt-1 text-[12.5px] text-faint">
              {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">Client</h2>
            <p className="mt-1.5 text-[14.5px] font-[600]">{customer?.full_name ?? "—"}</p>
            {customer?.address && <p className="text-[13.5px] text-soft">{customer.address}</p>}
            {customer?.phone && <p className="text-[13.5px] text-soft">{customer.phone}</p>}
          </div>
          {!isQuote && (
            <div className="sm:text-right">
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">Échéance</h2>
              <p className="mt-1.5 text-[14.5px] font-[600]">
                {d.due_date
                  ? new Date(String(d.due_date)).toLocaleDateString("fr-FR")
                  : "À réception"}
              </p>
              {d.paid_at ? <p className="text-[13.5px] text-gr">Réglée</p> : null}
            </div>
          )}
        </section>

        {lines.length > 0 ? (
          <table className="mt-8 w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-line2">
                <th className="py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">
                  Désignation
                </th>
                <th className="py-2 text-right font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">Qté</th>
                <th className="py-2 text-right font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">P.U. HT</th>
                <th className="py-2 text-right font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">TVA</th>
                <th className="py-2 text-right font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-line">
                  <td className="py-2.5">{l.label}</td>
                  <td className="py-2.5 text-right tabular-nums">{l.quantity}</td>
                  <td className="py-2.5 text-right tabular-nums">{formatEuros(l.unitPriceCents)}</td>
                  <td className="py-2.5 text-right tabular-nums">
                    {String(l.vatRate).replace(".", ",")} %
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-[550]">
                    {formatEuros(Math.round(l.unitPriceCents * l.quantity))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-8 text-[13.5px] text-soft">Aucune ligne détaillée sur ce document.</p>
        )}

        <section className="mt-6 flex justify-end">
          <dl className="w-full max-w-[280px] space-y-1.5 text-[13.5px]">
            {totalHt > 0 && (
              <div className="flex justify-between">
                <dt className="text-soft">Total HT</dt>
                <dd className="tabular-nums">{formatEuros(totalHt)}</dd>
              </div>
            )}
            {Object.entries(vatBreakdown).map(([rate, cents]) => (
              <div key={rate} className="flex justify-between">
                <dt className="text-soft">TVA {rate.replace(".", ",")} %</dt>
                <dd className="tabular-nums">{formatEuros(Number(cents))}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line2 pt-2 text-[16px] font-[650]">
              <dt>Total TTC</dt>
              <dd className="tabular-nums">{formatEuros(totalTtc)}</dd>
            </div>
          </dl>
        </section>

        <footer className="mt-10 border-t border-line pt-4 text-[11.5px] text-faint">
          {isQuote ? (
            <p>Devis valable 30 jours. Bon pour accord, date et signature du client :</p>
          ) : (
            <p>
              Paiement à réception sauf mention contraire. Pénalités de retard au taux légal, indemnité
              forfaitaire de recouvrement 40 €.
            </p>
          )}
          {isQuote && <div className="mt-10 h-16 w-56 border-b border-line2" />}
        </footer>
      </div>
    </main>
  );
}
