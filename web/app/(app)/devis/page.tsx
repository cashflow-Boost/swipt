import { StatusTag } from "@/components/StatusTag";
import { getQuotes } from "@/lib/data";
import { formatEuros } from "@/lib/money";
import Link from "next/link";
import { validateQuoteAction } from "@/app/actions";

export default async function DevisPage() {
  const quotes = await getQuotes();
  const toValidate = quotes.filter((q) => q.status === "to_validate");
  const sent = quotes.filter((q) => q.status === "sent");
  const signed = quotes.filter((q) => q.status === "signed");
  const toValidateSum = toValidate.reduce((s, q) => s + q.totalTtcCents, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Devis</h1>
          <p className="mt-1 text-sm text-soft">Trois files. La première est la seule qui demande votre attention.</p>
        </div>
        <Link href="/devis/nouveau" className="rounded-pill border border-ink bg-ink px-3.5 py-2 text-[13.5px] font-semibold text-w">
          Nouveau devis
        </Link>
      </div>

      <div className="mb-4 rounded-[11px] border border-or-line bg-or-wash p-4">
        <h2 className="mb-2.5 text-[15px] font-semibold text-or-t">
          À valider — {toValidate.length} devis{toValidate.length > 0 ? `, ${formatEuros(toValidateSum)} au total` : ""}
        </h2>
        {toValidate.length === 0 ? (
          <p className="text-[13.5px] text-soft">Rien à valider pour le moment.</p>
        ) : (
          <div className="overflow-hidden rounded-[10px] border border-or-line bg-w">
            {toValidate.map((q) => (
              <div key={q.id} className="grid gap-1 border-b border-or-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[84px_1fr_auto] sm:items-center sm:gap-4">
                <div className="font-mono text-[12.5px] text-faint">{q.number}</div>
                <div>
                  <div className="text-[14.5px] font-[550]">{q.customer}</div>
                  <div className="text-[13px] text-soft">{formatEuros(q.totalTtcCents)} TTC</div>
                </div>
                <form action={validateQuoteAction} className="sm:justify-self-end">
                  <input type="hidden" name="id" value={q.id} />
                  <button type="submit" className="rounded-pill border border-or bg-or px-3.5 py-2 text-[13px] font-semibold text-ink">
                    Valider et envoyer
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuoteList title="Envoyés — en attente de signature" items={sent} tag="En attente" variant="neutral" />
      <QuoteList title="Signés — prêts à facturer" items={signed} tag="Signé" variant="gr" />

      <p className="mt-6 text-[13px] text-soft">
        Données lues en direct depuis Supabase (RLS). Chiffrage via{" "}
        <code className="font-mono text-faint">createQuote</code> (TVA ligne par ligne, montants en centimes).
      </p>
    </div>
  );
}

function QuoteList({
  title,
  items,
  tag,
  variant,
}: {
  title: string;
  items: { id: string; number: string | null; customer: string; totalTtcCents: number }[];
  tag: string;
  variant: "neutral" | "gr";
}) {
  return (
    <>
      <h2 className="mb-2.5 mt-5 text-[15px] font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-6 text-center text-[13.5px] text-soft">Aucun.</p>
      ) : (
        <div className="overflow-hidden rounded-[11px] border border-line">
          {items.map((q) => (
            <div key={q.id} className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[84px_1fr_auto] sm:items-center sm:gap-4">
              <div className="font-mono text-[12.5px] text-faint">{q.number}</div>
              <div>
                <div className="text-[14.5px] font-[550]">{q.customer}</div>
                <div className="text-[13px] text-soft">{formatEuros(q.totalTtcCents)} TTC</div>
              </div>
              <div className="sm:justify-self-end"><StatusTag variant={variant}>{tag}</StatusTag></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
