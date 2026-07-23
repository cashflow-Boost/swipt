import { StatusTag, type TagVariant } from "@/components/StatusTag";

// Données de référence (une journée type). Seront servies par getCall /
// lib/actions/calls.ts une fois Supabase connecté.
const THREAD: { who: "them" | "us"; text: string }[] = [
  { who: "them", text: "Allô ? J'ai une fuite sous mon évier, ça coule partout." },
  { who: "us", text: "Bonsoir, Plomberie Vasseur. Ça coule en continu ou au goutte-à-goutte ?" },
  { who: "them", text: "En continu, la bassine déborde." },
  { who: "us", text: "Coupez le robinet d'arrêt sous le meuble si vous y avez accès. Votre adresse ?" },
  { who: "them", text: "14 rue des Écoles à Poissy, 2ᵉ étage, code 3390." },
  { who: "us", text: "Noté. M. Vasseur peut passer demain entre 8 h et 10 h — ça vous convient ?" },
  { who: "them", text: "Oui, très bien. Ça coûtera combien ?" },
  { who: "us", text: "Déplacement 45 €, siphon environ 120 €. Le devis arrive par SMS." },
];

const FICHE: { k: string; v: string; hot?: boolean }[] = [
  { k: "Client", v: "Mme Réaux — 06 12 •• •• 47" },
  { k: "Adresse", v: "14 rue des Écoles, Poissy — 2ᵉ ét., code 3390" },
  { k: "Demande", v: "Fuite continue sous évier" },
  { k: "Urgence", v: "Élevée — eau coupée par la cliente", hot: true },
  { k: "Rendez-vous", v: "Mercredi 8 h – 10 h — confirmé par SMS" },
  { k: "Devis préparé", v: "165 € TTC — en attente de votre validation", hot: true },
];

const OTHERS: { t: string; ti: string; sb: string; tag: string; v: TagVariant }[] = [
  { t: "18:12", ti: "M. Bourdin — Villennes", sb: "Chaudière en sécurité, code E04", tag: "Traité", v: "gr" },
  { t: "15:47", ti: "Mme Trinh — Poissy", sb: "Porte claquée, enfant à l'intérieur", tag: "Transféré", v: "rd" },
  { t: "14:03", ti: "M. Ferreira — Chambourcy", sb: "Demande de devis salle de bain", tag: "Traité", v: "gr" },
  { t: "11:20", ti: "Numéro masqué", sb: "Hors zone — Mantes-la-Jolie", tag: "Refusé", v: "neutral" },
  { t: "09:55", ti: "Mme Kadri — Orgeval", sb: "Rappel d'un devis en cours", tag: "Traité", v: "gr" },
  { t: "08:41", ti: "Démarchage commercial", sb: "Isolation à 1 €", tag: "Écarté", v: "neutral" },
];

const FILTERS = ["Tous", "Traité", "Transféré", "Hors zone", "Écarté"];

export default function AppelsPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-[650]">Journal des appels</h1>
          <p className="mt-1 max-w-[56ch] text-sm text-soft">
            Chaque appel pris par SWIPT, avec sa transcription intégrale. Vous
            pouvez tout relire et corriger.
          </p>
        </div>
        <button
          type="button"
          className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold"
        >
          Exporter CSV
        </button>
      </div>

      {/* filtres */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            aria-pressed={i === 0}
            className={[
              "rounded-pill border px-3 py-1.5 text-[13px] font-medium",
              i === 0
                ? "border-ink bg-ink text-w"
                : "border-line2 bg-w text-soft hover:border-faint",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      {/* détail de l'appel */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[11px] border border-line bg-w p-4">
          <h2 className="mb-2.5 text-[14.5px] font-semibold">
            Mardi 12 novembre, 20 h 38 — 1 min 42
          </h2>
          <div className="flex flex-col gap-2">
            {THREAD.map((b, i) => (
              <div
                key={i}
                className={[
                  "max-w-[88%] rounded-xl px-3 py-2 text-[13.8px] leading-[1.45]",
                  b.who === "them"
                    ? "self-start rounded-bl-[4px] bg-w3"
                    : "self-end rounded-br-[4px] bg-ink text-w",
                ].join(" ")}
              >
                {b.text}
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-pill border border-line2 bg-w px-3.5 py-2 text-[13.5px] font-semibold"
            >
              Écouter l&apos;enregistrement
            </button>
            <button
              type="button"
              className="rounded-pill border border-or bg-or px-3.5 py-2 text-[13.5px] font-semibold text-ink"
            >
              Corriger la fiche
            </button>
          </div>
        </section>

        <section className="rounded-[11px] border border-line bg-w p-4">
          <h2 className="mb-2.5 text-[14.5px] font-semibold">
            Ce que SWIPT en a retenu
          </h2>
          {FICHE.map((f) => (
            <div key={f.k} className="border-b border-line py-2.5 last:border-b-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.11em] text-faint">
                {f.k}
              </div>
              <div
                className={`mt-0.5 text-[14px] font-medium ${f.hot ? "text-or-t" : ""}`}
              >
                {f.v}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* les autres appels */}
      <h2 className="mb-3 mt-6 text-[15px] font-semibold">
        Les six autres appels du jour
      </h2>
      <div className="overflow-hidden rounded-[11px] border border-line">
        {OTHERS.map((r) => (
          <div
            key={r.t}
            className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 hover:bg-w2 sm:grid-cols-[74px_1fr_auto] sm:items-center sm:gap-4"
          >
            <div className="font-mono text-[12.5px] text-faint">{r.t}</div>
            <div>
              <div className="text-[14.5px] font-[550]">{r.ti}</div>
              <div className="text-[13px] text-soft">{r.sb}</div>
            </div>
            <div className="sm:justify-self-end">
              <StatusTag variant={r.v}>{r.tag}</StatusTag>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. Données servies par{" "}
        <code className="font-mono text-faint">getCall</code> ; la correction
        passe par{" "}
        <code className="font-mono text-faint">correctExtraction</code>, qui
        envoie le SMS de correction au client via l&apos;abstraction téléphonie
        (SPEC §2.1).
      </p>
    </div>
  );
}
