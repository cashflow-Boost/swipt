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
    { k: "Appels traités aujourd'hui", v: String(calls.length), d: "pris par AlloChantier" },
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ce qui s&apos;est passé pendant que vous travailliez, et ce qui attend une décision.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={k.k} className="ac-enter rounded-2xl bg-white p-5" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{k.k}</div>
            <div className={`mt-1 text-3xl font-semibold tracking-tight ${k.hot ? "text-blue-700" : "text-slate-900"}`}>{k.v}</div>
            <div className="mt-1 text-xs text-slate-500">{k.d}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-8 text-sm font-semibold text-slate-900">Derniers événements</h2>
      {feed.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-slate-400">Aucun appel pour le moment.</p>
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white">
          {feed.map((r, i) => (
            <div key={i} className="grid gap-1 px-5 py-5 transition-colors duration-150 hover:bg-slate-50/80 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4">
              <div className="font-mono text-xs text-slate-400">{r.t}</div>
              <div className="text-[14.5px] font-medium text-slate-900">{r.ti}</div>
              <div className="sm:justify-self-end"><StatusTag variant={r.v}>{r.tag}</StatusTag></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
