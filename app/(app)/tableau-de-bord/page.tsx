import { StatusTag, type TagVariant } from "@/components/StatusTag";
import { getCalls, getQuotes, getInvoices, getAppointments } from "@/lib/data";
import { formatEuros } from "@/lib/money";

export default async function TableauDeBordPage() {
  const [calls, quotes, invoices, appts] = await Promise.all([
    getCalls(),
    getQuotes(),
    getInvoices(),
    getAppointments(),
  ]);

  const toValidate = quotes.filter((q) => q.status === "to_validate");
  const toValidateSum = toValidate.reduce((s, q) => s + q.totalTtcCents, 0);
  const sleeping =
    quotes.filter((q) => q.status === "sent").reduce((s, q) => s + q.totalTtcCents, 0) +
    invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.totalTtcCents, 0);
  const rdvAgent = appts.filter((a) => a.source === "agent").length;

  const kpis: { k: string; v: string; d: string; hot?: boolean }[] = [
    { k: "Appels traités aujourd'hui", v: String(calls.length), d: "pris par SWIPT" },
    { k: "Rendez-vous posés", v: String(rdvAgent), d: "par l'agent" },
    { k: "Devis qui vous attendent", v: String(toValidate.length), d: `à valider — ${formatEuros(toValidateSum)}`, hot: true },
    { k: "Argent qui dort", v: formatEuros(sleeping), d: "devis sans réponse + factures en retard" },
  ];

  const feed = calls.slice(0, 5).map((c) => ({
    t: c.time,
    ti: `${c.customer} — ${c.request}`,
    tag: c.statusLabel,
    v: c.statusVariant as TagVariant,
  }));

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Tableau de bord</h1>
        <p className="mt-1 max-w-[56ch] text-sm text-soft">
          Ce qui s&apos;est passé pendant que vous travailliez, et ce qui attend
          une décision de votre part.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.k} className="rounded-[11px] border border-line bg-w p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">{k.k}</div>
            <div className={`mt-1.5 text-[30px] font-[650] tracking-[-0.035em] ${k.hot ? "text-or-t" : ""}`}>{k.v}</div>
            <div className="mt-0.5 text-[12.5px] text-soft">{k.d}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-6 text-[15px] font-semibold">Derniers événements</h2>
      {feed.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-8 text-center text-sm text-soft">
          Aucun appel pour le moment.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[11px] border border-line">
          {feed.map((r, i) => (
            <div key={i} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4">
              <div className="font-mono text-[12.5px] text-faint">{r.t}</div>
              <div><div className="text-[14.5px] font-[550]">{r.ti}</div></div>
              <div className="sm:justify-self-end"><StatusTag variant={r.v}>{r.tag}</StatusTag></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
