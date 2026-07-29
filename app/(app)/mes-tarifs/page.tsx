import { getSessionOrg } from "@/lib/auth";
import { listPriceItems } from "@/lib/actions/price-items";
import { createPriceItemAction, deletePriceItemAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { formatEuros } from "@/lib/money";

type Item = {
  id: string;
  label: string;
  unit: string | null;
  unit_price_cents: number;
  vat_rate: number;
  trade_category: string | null;
};

/**
 * Grille de prix (SPEC §4.3). C'est la source du chiffrage : sans une seule
 * ligne ici, l'agent ne peut proposer aucun devis.
 */
export default async function TarifsPage() {
  const session = await getSessionOrg();
  const items = (session
    ? await listPriceItems.withContext({ orgId: session.orgId })({})
    : []) as Item[];

  const byCategory = items.reduce<Record<string, Item[]>>((acc, it) => {
    const k = it.trade_category?.trim() || "Sans catégorie";
    (acc[k] ??= []).push(it);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Mes tarifs</h1>
        <p className="mt-1 max-w-[62ch] text-sm text-soft">
          Vos prix, ligne par ligne. C&apos;est là-dedans que l&apos;agent puise pour chiffrer un
          devis pendant l&apos;appel — sans tarif enregistré, aucun devis ne peut être proposé.
        </p>
      </div>

      {items.length === 0 && (
        <div className="mb-5 rounded-[12px] border border-or-line bg-or-wash p-4 text-[13.5px] text-or-t">
          Votre grille est vide. Ajoutez au moins votre forfait de dépannage et votre taux horaire :
          ce sont les deux lignes qui servent dans la majorité des appels.
        </div>
      )}

      <form
        action={createPriceItemAction}
        className="mb-6 grid gap-3 rounded-[12px] border border-line bg-w p-4 sm:grid-cols-[1fr_120px_130px_110px_auto] sm:items-end"
      >
        <label className="text-[12px] text-soft">
          Désignation
          <input
            name="label"
            required
            placeholder="Déplacement et diagnostic"
            className="mt-1 block w-full rounded-sm border border-line2 px-2.5 py-2 text-[14px]"
          />
        </label>
        <label className="text-[12px] text-soft">
          Unité
          <input
            name="unit"
            placeholder="forfait, heure, m²"
            className="mt-1 block w-full rounded-sm border border-line2 px-2.5 py-2 text-[14px]"
          />
        </label>
        <label className="text-[12px] text-soft">
          Prix unitaire HT
          <input
            name="unitPriceEuros"
            type="number"
            step="0.01"
            min={0}
            required
            placeholder="90.00"
            className="mt-1 block w-full rounded-sm border border-line2 px-2.5 py-2 text-[14px]"
          />
        </label>
        <label className="text-[12px] text-soft">
          TVA
          <select
            name="vatRate"
            defaultValue="20"
            className="mt-1 block w-full rounded-sm border border-line2 bg-w px-2.5 py-2 text-[14px]"
          >
            <option value="20">20 %</option>
            <option value="10">10 %</option>
            <option value="5.5">5,5 %</option>
          </select>
        </label>
        <SubmitButton
          pendingText="…"
          className="rounded-pill bg-or px-4 py-2.5 text-[13.5px] font-semibold text-w"
        >
          Ajouter
        </SubmitButton>
        <label className="text-[12px] text-soft sm:col-span-5">
          Catégorie (facultatif)
          <input
            name="tradeCategory"
            placeholder="Plomberie · Chauffage · Salle de bain…"
            className="mt-1 block w-full max-w-sm rounded-sm border border-line2 px-2.5 py-2 text-[14px]"
          />
        </label>
      </form>

      {items.length > 0 && (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([cat, rows]) => (
            <div key={cat}>
              <h2 className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.11em] text-faint">{cat}</h2>
              <div className="overflow-hidden rounded-[11px] border border-line">
                {rows.map((it) => (
                  <div
                    key={it.id}
                    className="grid gap-1 border-b border-line bg-w px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4"
                  >
                    <div>
                      <div className="text-[14.5px] font-[550]">{it.label}</div>
                      {it.unit && <div className="text-[12.5px] text-soft">par {it.unit}</div>}
                    </div>
                    <div className="font-mono text-[14px] tabular-nums">
                      {formatEuros(it.unit_price_cents)} HT
                    </div>
                    <div className="font-mono text-[12.5px] text-faint">
                      TVA {String(it.vat_rate).replace(".", ",")} %
                    </div>
                    <form action={deletePriceItemAction} className="sm:justify-self-end">
                      <input type="hidden" name="id" value={it.id} />
                      <SubmitButton
                        pendingText="…"
                        className="rounded-pill border border-line2 bg-w px-3 py-1.5 text-[12.5px] font-semibold text-soft hover:border-rd hover:text-rd"
                      >
                        Retirer
                      </SubmitButton>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 max-w-[70ch] text-[13px] text-soft">
        L&apos;agent lit cette grille pendant l&apos;appel. Il annonce un ordre de grandeur et
        précise toujours que le devis final est confirmé par vous — il ne s&apos;engage jamais sur
        un prix ferme à votre place.
      </p>
    </div>
  );
}
