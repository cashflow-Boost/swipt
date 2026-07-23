import { StatusTag, type TagVariant } from "@/components/StatusTag";

const FICHE: { k: string; v: string; hot?: boolean }[] = [
  { k: "Téléphone", v: "06 12 •• •• 47" },
  { k: "Adresse", v: "14 rue des Écoles — 2ᵉ ét., code 3390" },
  { k: "Première intervention", v: "mars 2025" },
  { k: "Interventions", v: "3 — dont 2 sur la même colonne d'eau", hot: true },
  { k: "Chiffre d'affaires", v: "512 € TTC" },
  { k: "Paiement", v: "Toujours réglé dans les délais" },
];

const HISTORY: { t: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { t: "12 nov", ti: "Fuite sous évier", sb: "Rendez-vous mercredi", tag: "En cours", v: "or" },
  { t: "22 mai", ti: "Chasse d'eau bloquée", sb: "192 € TTC", tag: "Payée", v: "gr" },
  { t: "14 mars", ti: "Fuite colonne cuisine", sb: "165 € TTC", tag: "Payée", v: "gr" },
];

export default function ClientsPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Clients</h1>
          <p className="mt-1 max-w-[60ch] text-sm text-soft">
            L&apos;historique de chaque client. SWIPT s&apos;en sert pendant
            l&apos;appel : « on est déjà intervenus chez vous en mars ».
          </p>
        </div>
        <button type="button" className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold">
          Ajouter un client
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[11px] border border-line bg-w p-4">
          <h2 className="mb-2.5 text-[14.5px] font-semibold">Mme Réaux — Poissy</h2>
          {FICHE.map((f) => (
            <div key={f.k} className="border-b border-line py-2.5 last:border-b-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.11em] text-faint">{f.k}</div>
              <div className={`mt-0.5 text-[14px] font-medium ${f.hot ? "text-or-t" : ""}`}>{f.v}</div>
            </div>
          ))}
        </section>

        <section className="rounded-[11px] border border-line bg-w p-4">
          <h2 className="mb-2.5 text-[14.5px] font-semibold">Historique</h2>
          <div className="overflow-hidden rounded-[10px] border border-line">
            {HISTORY.map((r) => (
              <div key={r.t} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0">
                <div className="font-mono text-[12px] text-faint">{r.t}</div>
                <div>
                  <div className="text-[14px] font-[550]">{r.ti}</div>
                  <div className="text-[12.5px] text-soft">{r.sb}</div>
                </div>
                <div className="justify-self-end"><StatusTag variant={r.v}>{r.tag}</StatusTag></div>
              </div>
            ))}
          </div>
          <p className="mt-3.5 rounded-[10px] border border-or-line bg-or-wash p-3 text-[13.5px] text-or-t">
            Troisième fuite au même endroit. À signaler lors de l&apos;intervention :
            le problème vient probablement de la colonne, pas du siphon.
          </p>
        </section>
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. Fiche et historique via{" "}
        <code className="font-mono text-faint">getCustomer</code> /{" "}
        <code className="font-mono text-faint">getHistory</code>{" "}
        (<code className="font-mono text-faint">lib/actions/customers.ts</code>) —
        l&apos;agent vocal les consulte pendant l&apos;appel.
      </p>
    </div>
  );
}
