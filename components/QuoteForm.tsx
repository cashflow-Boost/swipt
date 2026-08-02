"use client";

import { useState } from "react";
import { createQuoteAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

type Line = { label: string; quantity: number; unitPriceEuros: number; vatRate: number };
const VAT = [20, 10, 5.5] as const;
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function QuoteForm({ customers }: { customers: { id: string; name: string }[] }) {
  const [lines, setLines] = useState<Line[]>([
    { label: "", quantity: 1, unitPriceEuros: 0, vatRate: 10 },
  ]);
  const [customerId, setCustomerId] = useState("");

  function update(i: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((ls) => [...ls, { label: "", quantity: 1, unitPriceEuros: 0, vatRate: 10 }]);
  }
  function removeLine(i: number) {
    setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls));
  }

  let totalHt = 0;
  let totalTtc = 0;
  for (const l of lines) {
    const ht = l.quantity * l.unitPriceEuros;
    totalHt += ht;
    totalTtc += ht * (1 + l.vatRate / 100);
  }

  // Payload envoyé à la Server Action (centimes entiers — SPEC §13).
  const payload = JSON.stringify(
    lines.map((l) => ({
      label: l.label,
      quantity: l.quantity,
      unitPriceCents: Math.round(l.unitPriceEuros * 100),
      vatRate: l.vatRate,
    })),
  );

  return (
    <form action={createQuoteAction} className="space-y-4">
      <input type="hidden" name="lines" value={payload} />
      <input type="hidden" name="customerId" value={customerId} />

      <label className="block max-w-sm">
        <span className="mb-1 block text-[13px] font-medium text-soft">Client</span>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full rounded-sm border border-line2 bg-w px-3 py-2 text-[14.5px]"
        >
          <option value="">— sans client —</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <div className="overflow-hidden rounded-[11px] border border-line">
        <div className="hidden bg-w2 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-faint sm:grid sm:grid-cols-[1fr_70px_110px_90px_36px] sm:gap-2">
          <span>Désignation</span><span>Qté</span><span>PU HT €</span><span>TVA</span><span></span>
        </div>
        {lines.map((l, i) => (
          <div key={i} className="grid gap-2 border-t border-line px-3 py-2.5 sm:grid-cols-[1fr_70px_110px_90px_36px] sm:items-center">
            <input value={l.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Ex. Remplacement siphon"
              className="rounded-sm border border-line2 px-2.5 py-1.5 text-[14px]" />
            <input type="number" min="0" step="0.5" value={l.quantity} onChange={(e) => update(i, { quantity: Number(e.target.value) })}
              className="rounded-sm border border-line2 px-2.5 py-1.5 text-[14px]" />
            <input type="number" min="0" step="0.01" value={l.unitPriceEuros} onChange={(e) => update(i, { unitPriceEuros: Number(e.target.value) })}
              className="rounded-sm border border-line2 px-2.5 py-1.5 text-[14px]" />
            <select value={l.vatRate} onChange={(e) => update(i, { vatRate: Number(e.target.value) })}
              className="rounded-sm border border-line2 px-2 py-1.5 text-[14px]">
              {VAT.map((r) => <option key={r} value={r}>{r} %</option>)}
            </select>
            <button type="button" onClick={() => removeLine(i)} aria-label="Supprimer la ligne"
              className="justify-self-center rounded-sm px-2 py-1 text-[16px] text-faint hover:text-rd">×</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addLine}
        className="rounded-pill border border-line2 bg-w px-3.5 py-1.5 text-[13px] font-semibold">
        + Ajouter une ligne
      </button>

      <div className="flex items-center justify-between rounded-[11px] border border-line bg-w2 px-4 py-3">
        <div className="text-[13px] text-soft">
          Total HT <b className="ml-1 font-mono text-ink">{eur.format(totalHt)}</b>
        </div>
        <div className="text-[15px] font-[650]">
          Total TTC <span className="ml-1 font-mono text-or-t">{eur.format(totalTtc)}</span>
        </div>
      </div>

      <SubmitButton pendingText="Création…" className="rounded-pill bg-or px-5 py-2.5 text-[14.5px] font-semibold text-w">
        Créer le devis
      </SubmitButton>
    </form>
  );
}
