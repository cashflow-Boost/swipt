"use client";

import { useState } from "react";
import { createQuoteAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

type Line = { label: string; quantity: number; unitPriceEuros: number; vatRate: number };
export type PriceItem = {
  id: string;
  label: string;
  unit: string | null;
  unitPriceEuros: number;
  vatRate: number;
};
const VAT = [20, 10, 5.5] as const;
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function QuoteForm({
  customers,
  priceItems = [],
}: {
  customers: { id: string; name: string }[];
  priceItems?: PriceItem[];
}) {
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

  /** Remplit une ligne depuis la grille de prix : plus rien à retaper. */
  function pickFromGrid(i: number, itemId: string) {
    const item = priceItems.find((p) => p.id === itemId);
    if (!item) return;
    update(i, {
      label: item.unit ? `${item.label} (${item.unit})` : item.label,
      unitPriceEuros: item.unitPriceEuros,
      vatRate: item.vatRate,
    });
  }

  /** Ajoute directement un ouvrage de la grille comme nouvelle ligne. */
  function addFromGrid(itemId: string) {
    const item = priceItems.find((p) => p.id === itemId);
    if (!item) return;
    const newLine: Line = {
      label: item.unit ? `${item.label} (${item.unit})` : item.label,
      quantity: 1,
      unitPriceEuros: item.unitPriceEuros,
      vatRate: item.vatRate,
    };
    // Remplace la première ligne si elle est encore vierge.
    setLines((ls) =>
      ls.length === 1 && !ls[0].label && ls[0].unitPriceEuros === 0 ? [newLine] : [...ls, newLine],
    );
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

      {priceItems.length > 0 && (
        <div className="rounded-[11px] border border-or-line bg-or-wash px-4 py-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-or-t">
              Ajouter depuis ma grille de tarifs
            </span>
            <select
              value=""
              onChange={(e) => { addFromGrid(e.target.value); e.currentTarget.value = ""; }}
              className="w-full max-w-md rounded-sm border border-or-line bg-w px-3 py-2 text-[14.5px]"
            >
              <option value="">— choisir un ouvrage —</option>
              {priceItems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}{p.unit ? ` (${p.unit})` : ""} — {eur.format(p.unitPriceEuros)} HT
                </option>
              ))}
            </select>
          </label>
          <p className="mt-1.5 text-[12.5px] text-soft">
            Le libellé, le prix et la TVA se remplissent tout seuls. Vous n&apos;ajustez que la quantité.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-[11px] border border-line">
        <div className="hidden bg-w2 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.1em] text-faint sm:grid sm:grid-cols-[1fr_70px_110px_90px_36px] sm:gap-2">
          <span>Désignation</span><span>Qté</span><span>PU HT €</span><span>TVA</span><span></span>
        </div>
        {lines.map((l, i) => (
          <div key={i} className="grid gap-2 border-t border-line px-3 py-2.5 sm:grid-cols-[1fr_70px_110px_90px_36px] sm:items-center">
            <div>
              <input value={l.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Ex. Remplacement siphon"
                className="w-full rounded-sm border border-line2 px-2.5 py-1.5 text-[14px]" />
              {priceItems.length > 0 && (
                <select
                  value=""
                  onChange={(e) => { pickFromGrid(i, e.target.value); e.currentTarget.value = ""; }}
                  aria-label="Remplir depuis la grille de tarifs"
                  className="mt-1 w-full rounded-sm border border-line2 bg-w2 px-2 py-1 text-[12px] text-soft"
                >
                  <option value="">↳ remplir depuis ma grille…</option>
                  {priceItems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} — {eur.format(p.unitPriceEuros)} HT
                    </option>
                  ))}
                </select>
              )}
            </div>
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
