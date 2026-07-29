import Link from "next/link";
import { PdfButton } from "@/components/ui";
import { StatusTag, type TagVariant } from "@/components/StatusTag";
import { getInvoices } from "@/lib/data";
import { formatEuros } from "@/lib/money";
import { markInvoicePaidAction } from "@/app/actions";

const LABEL: Record<string, string> = { issued: "Émise", paid: "Payée", overdue: "En retard" };
const VARIANT: Record<string, TagVariant> = { issued: "neutral", paid: "gr", overdue: "rd" };

export default async function FacturesPage() {
  const invoices = await getInvoices();
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalTtcCents, 0);
  const pending = invoices.filter((i) => i.status === "issued").reduce((s, i) => s + i.totalTtcCents, 0);
  const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.totalTtcCents, 0);

  const kpis: { k: string; v: string; d: string; hot?: boolean }[] = [
    { k: "Encaissé", v: formatEuros(paid), d: "factures réglées" },
    { k: "En attente", v: formatEuros(pending), d: "dans les délais" },
    { k: "En retard", v: formatEuros(overdue), d: "à relancer", hot: overdue > 0 },
    { k: "Format", v: "Factur-X", d: "via plateforme agréée" },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Factures</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Elles découlent du devis signé. Format Factur-X, conforme à l&apos;échéance de septembre 2026.
          </p>
        </div>
        <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Exporter pour le comptable
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.k} className="rounded-[11px] border border-line bg-w p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">{k.k}</div>
            <div className={`mt-1.5 text-[28px] font-[650] tracking-[-0.035em] ${k.hot ? "text-or-t" : ""}`}>{k.v}</div>
            <div className="mt-0.5 text-[12.5px] text-soft">{k.d}</div>
          </div>
        ))}
      </div>

      {invoices.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-10 text-center text-sm text-soft">Aucune facture.</p>
      ) : (
        <div className="overflow-hidden rounded-[11px] border border-line">
          {invoices.map((i) => (
            <div key={i.id} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[92px_1fr_auto] sm:items-center sm:gap-4">
              <div className="font-mono text-[12.5px] text-faint">{i.number}</div>
              <div>
                <div className="text-[14.5px] font-[550]">{formatEuros(i.totalTtcCents)} TTC</div>
                <div className="text-[13px] text-soft">
                  {i.status === "paid" ? "Réglée" : i.dueDate ? `Échéance ${new Date(i.dueDate).toLocaleDateString("fr-FR")}` : "—"}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:justify-self-end">
                <StatusTag variant={VARIANT[i.status]}>{LABEL[i.status] ?? i.status}</StatusTag>
                <PdfButton href={`/document/facture/${i.id}`} />
                {i.status !== "paid" && (
                  <form action={markInvoicePaidAction}>
                    <input type="hidden" name="id" value={i.id} />
                    <button type="submit" className="rounded-pill border border-line2 bg-w px-3 py-1.5 text-[12.5px] font-semibold hover:border-faint">
                      Marquer payée
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
