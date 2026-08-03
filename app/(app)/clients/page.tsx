import { getCustomers } from "@/lib/data";
import { createCustomerAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

export default async function ClientsPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Clients</h1>
          <p className="mt-1 max-w-[60ch] text-sm text-soft">
            L&apos;historique de chaque client. Rimova s&apos;en sert pendant l&apos;appel pour reconnaître un habitué.
          </p>
        </div>
        <details>
          <summary className="cursor-pointer list-none rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
            Ajouter un client
          </summary>
          <form action={createCustomerAction} className="mt-3 flex flex-wrap items-end gap-2 rounded-[11px] border border-line bg-w p-3">
            <label className="text-[12px] text-soft">Nom<input name="fullName" required placeholder="Mme Dupont" className="mt-1 block rounded-sm border border-line2 px-2.5 py-1.5 text-[13.5px]" /></label>
            <label className="text-[12px] text-soft">Téléphone<input name="phone" placeholder="06 …" className="mt-1 block rounded-sm border border-line2 px-2.5 py-1.5 text-[13.5px]" /></label>
            <label className="text-[12px] text-soft">Adresse<input name="address" placeholder="Ville" className="mt-1 block rounded-sm border border-line2 px-2.5 py-1.5 text-[13.5px]" /></label>
            <SubmitButton pendingText="…" className="rounded-pill bg-ink px-3.5 py-2 text-[13px] font-semibold text-w">Ajouter</SubmitButton>
          </form>
        </details>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-[11px] border border-dashed border-line2 bg-w px-4 py-10 text-center text-sm text-soft">Aucun client enregistré.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c, i) => (
            <div
              key={c.id as string}
              className="ac-card ac-enter rounded-[11px] border border-line bg-w p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <h2 className="text-[15px] font-[650]">{(c.full_name as string) || "Client sans nom"}</h2>
              <dl className="mt-2 space-y-1.5 text-[13.5px]">
                {c.phone ? <Row k="Téléphone" v={c.phone as string} /> : null}
                {c.address ? <Row k="Adresse" v={c.address as string} /> : null}
                {c.first_seen_at ? (
                  <Row k="Depuis" v={new Date(c.first_seen_at as string).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })} />
                ) : null}
              </dl>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-[13px] text-soft">
        Données lues en direct depuis Supabase (RLS). Fiche et historique via{" "}
        <code className="font-mono text-faint">getCustomer</code> /{" "}
        <code className="font-mono text-faint">getHistory</code>.
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-faint">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
