import Link from "next/link";
import { QuoteForm } from "@/components/QuoteForm";
import { getCustomers } from "@/lib/data";

export default async function NouveauDevisPage() {
  const customers = await getCustomers();
  const list = customers.map((c) => ({
    id: c.id as string,
    name: (c.full_name as string) || "Client sans nom",
  }));

  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <Link href="/devis" className="text-[13px] font-medium text-soft hover:text-ink">
          ← Devis
        </Link>
        <h1 className="mt-2 text-xl font-[650]">Nouveau devis</h1>
        <p className="mt-1 text-sm text-soft">
          TVA appliquée ligne par ligne (SPEC §4.3). Montants stockés en centimes entiers.
        </p>
      </div>
      <QuoteForm customers={list} />
    </div>
  );
}
