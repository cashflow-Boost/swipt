"use client";

import { useState } from "react";
import Link from "next/link";

// Calculateur d'appels manqués. Constantes du modèle.
const WORKDAYS = 22;
const RECOVERY = 0.7; // part réaliste des appels manqués effectivement rattrapés
const OVERAGE = 0.79; // € HT par appel au-delà du forfait Solo

const SOLO = { n: "Solo", m: 99, c: 80 };
const PRO = { n: "Pro", m: 199, c: Infinity };

const fmt = new Intl.NumberFormat("fr-FR");
const fmt1 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Solo tant que le volume tient dans le forfait ; au-delà, Pro (illimité) devient plus juste. */
function bestOffer(monthlyCalls: number) {
  const soloCost = SOLO.m + Math.max(0, monthlyCalls - SOLO.c) * OVERAGE;
  return soloCost <= PRO.m ? { ...SOLO, cost: soloCost } : { ...PRO, cost: PRO.m };
}

export function Calculator() {
  const [calls, setCalls] = useState(3);
  const [ticket, setTicket] = useState(250);
  const [rate, setRate] = useState(3);

  const monthly = calls * WORKDAYS;
  const jobs = (monthly * rate) / 10;
  const lost = jobs * ticket;
  const offer = bestOffer(monthly);
  const recovered = lost * RECOVERY;
  const net = Math.max(0, Math.round(recovered - offer.cost));
  // Part récupérée nette, pour la barre visuelle (bornée à 100 %).
  const netPct = lost > 0 ? Math.min(100, Math.max(4, (net / lost) * 100)) : 0;

  return (
    <div className="grid gap-16 md:grid-cols-2">
      {/* réglages */}
      <div className="space-y-10">
        <Dial label="Appels que vous ne décrochez pas, par jour" value={String(calls)}>
          <input
            type="range" min={1} max={12} step={1} value={calls}
            onChange={(e) => setCalls(+e.target.value)}
            className="swipt-range" aria-label="Appels manqués par jour"
          />
          <Scale left="1" right="12" />
        </Dial>
        <Dial label="Montant moyen d'une intervention" value={`${fmt.format(ticket)} €`}>
          <input
            type="range" min={100} max={600} step={10} value={ticket}
            onChange={(e) => setTicket(+e.target.value)}
            className="swipt-range" aria-label="Montant moyen d'une intervention"
          />
          <Scale left="100 €" right="600 €" />
        </Dial>
        <Dial label="Sur 10 appels manqués, combien seraient devenus un chantier" value={String(rate)}>
          <input
            type="range" min={1} max={5} step={1} value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="swipt-range" aria-label="Taux de conversion des appels manqués"
          />
          <Scale left="1 sur 10" right="5 sur 10" />
        </Dial>
      </div>

      {/* résultat */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
          Chiffre d&apos;affaires perdu chaque mois
        </p>
        <div className="mt-3 text-[clamp(44px,7vw,60px)] font-bold leading-none tracking-tighter text-nv">
          {fmt.format(Math.round(lost))} €
        </div>

        <dl className="mt-10 space-y-3.5">
          <Line l={`${calls} appel${calls > 1 ? "s" : ""} manqué${calls > 1 ? "s" : ""} × ${WORKDAYS} jours`} r={`${fmt.format(monthly)} appels`} />
          <Line l={`dont ${rate} sur 10 deviennent un chantier`} r={`${fmt1.format(jobs)} chantiers`} />
          <Line l={`× ${fmt.format(ticket)} € l'intervention`} r={`${fmt.format(Math.round(lost))} €`} />
        </dl>

        {/* Barre : la part que Gildra vous fait récupérer, net de l'abonnement */}
        <div className="mt-9">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-line2">
            <div
              className="rounded-full bg-gr transition-[width] duration-500"
              style={{ width: `${netPct}%`, transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[12px] font-medium">
            <span className="text-or-t">Récupérable net</span>
            <span className="text-faint">Coût {offer.n} · {fmt.format(Math.round(offer.cost))} €/mois</span>
          </div>
        </div>

        {/* Résultat net mis en avant */}
        <div className="mt-6 rounded-[20px] border border-or-line bg-gradient-to-br from-or-wash to-w p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-or-t">
            Récupéré net avec Gildra
          </p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-[clamp(38px,6vw,52px)] font-bold leading-none tracking-tighter text-or-t">
              {fmt.format(net)} €
            </span>
            <span className="mb-1 text-[15px] font-light text-soft">/ mois</span>
          </div>
          <p className="mt-3 text-[14.5px] font-light leading-relaxed text-soft">
            Pour environ <span className="font-medium text-ink">{fmt.format(monthly)} appels/mois</span>,
            l&apos;offre <span className="font-medium text-ink">{offer.n}</span> à{" "}
            {fmt.format(Math.round(offer.cost))} €/mois suffit.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-full bg-or px-8 py-4 text-[15px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
          >
            Démarrer gratuitement
          </Link>
        </div>

        <p className="mt-8 text-[13px] font-light leading-relaxed text-faint">
          Simulation indicative, calculée à partir des trois valeurs que vous avez réglées sur une base
          de {WORKDAYS} jours travaillés. Elle ne constitue ni une mesure de votre activité, ni une
          promesse de résultat.
        </p>
      </div>
    </div>
  );
}

function Dial({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <span className="max-w-[36ch] text-[11px] uppercase tracking-[0.16em] text-faint">{label}</span>
        <span className="whitespace-nowrap text-[26px] font-light tracking-tight text-nv">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Scale({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-2 flex justify-between font-mono text-[11px] text-faint">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Line({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
      <dt className="text-[15px] font-light tracking-wide text-soft">{l}</dt>
      <dd className="whitespace-nowrap font-mono text-[15px] text-nv">{r}</dd>
    </div>
  );
}
