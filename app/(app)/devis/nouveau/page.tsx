import Link from "next/link";
import { QuoteForm } from "@/components/QuoteForm";
import { getCustomers } from "@/lib/data";
import { getSessionOrg } from "@/lib/auth";
import { listPriceItems } from "@/lib/actions/price-items";

export default async function NouveauDevisPage() {
  const session = await getSessionOrg();
  const [customers, priceRows] = await Promise.all([
    getCustomers(),
    session ? listPriceItems.withContext({ orgId: session.orgId })({}) : Promise.resolve([]),
  ]);
  const list = customers.map((c) => ({
    id: c.id as string,
    name: (c.full_name as string) || "Client sans nom",
  }));
  // La grille de prix pré-remplit les lignes : l'artisan ne retape rien.
  const priceItems = (priceRows ?? []).map((p) => ({
    id: p.id as string,
    label: p.label as string,
    unit: (p.unit as string) ?? null,
    unitPriceEuros: (p.unit_price_cents as number) / 100,
    vatRate: Number(p.vat_rate),
  }));

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <Link href="/devis" className="text-[13px] font-medium text-soft hover:text-ink">
          ← Devis
        </Link>
        <h1 className="mt-2 text-xl font-[650]">Nouveau devis</h1>
        <p className="mt-1 text-sm text-soft">
          {priceItems.length > 0
            ? "Choisissez vos ouvrages dans votre grille de tarifs : libellé, prix et TVA se remplissent tout seuls."
            : "Astuce : enregistrez votre grille de tarifs pour que vos devis se remplissent tout seuls."}
        </p>
      </div>
      <QuoteForm customers={list} priceItems={priceItems} />
    </div>
  );
}
