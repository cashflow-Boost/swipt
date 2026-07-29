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
  const net = Math.max(0, Math.round(lost * RECOVERY - offer.cost));

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-w shadow-sh2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-w2 px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-or-t">
          Vos trois chiffres
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          Simulation indicative · base {WORKDAYS} jours travaillés
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        {/* curseurs */}
        <div className="space-y-7 p-6">
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
        <div className="border-t border-line bg-nv p-6 text-w md:border-l-0 md:border-t-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-or-2">
            Chiffre d&apos;affaires perdu chaque mois
          </div>
          <div className="mt-2 font-mono text-[clamp(38px,7vw,54px)] font-[700] leading-none tracking-[-0.03em] text-or-2">
            {fmt.format(Math.round(lost))} €
          </div>
          <p className="mt-2 text-[12px] text-[#9FB2C6]">
            Estimation calculée à partir des trois valeurs que vous avez réglées. Elle ne constitue
            ni une mesure de votre activité, ni une promesse de résultat.
          </p>

          <div className="mt-5 space-y-2 border-t border-[#2E4A69] pt-4 text-[13.5px] text-[#B8C6D6]">
            <Line l={`${calls} appel${calls > 1 ? "s" : ""} manqué${calls > 1 ? "s" : ""} × ${WORKDAYS} jours`} r={`${fmt.format(monthly)} appels`} />
            <Line l={`dont ${rate} sur 10 → chantier`} r={`${fmt1.format(jobs)} chantiers`} />
            <Line l={`× ${fmt.format(ticket)} € l'intervention`} r={`${fmt.format(Math.round(lost))} €`} />
          </div>

          <div className="mt-5 rounded-[12px] bg-[#24405C] p-4">
            <div className="text-[14px] text-w">
              Pour ~<b>{fmt.format(monthly)} appels/mois</b>, la formule adaptée est{" "}
              <b className="text-or-2">{offer.n}</b>, à {fmt.format(Math.round(offer.cost))} €/mois.
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#9FB2C6]">
                  Récupéré, net
                </div>
                <div className="font-mono text-[27px] font-[700] leading-none text-w">
                  {fmt.format(net)} €/mois
                </div>
              </div>
              <Link
                href="/signup"
                className="rounded-pill bg-or px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-or-h"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dial({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <span className="max-w-[34ch] text-[14.5px] text-ink">{label}</span>
        <span className="whitespace-nowrap font-mono text-[19px] font-[600] text-or-t">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Scale({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-1 flex justify-between font-mono text-[10.5px] text-faint">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Line({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[#2E4A69] pb-2 last:border-b-0">
      <span>{l}</span>
      <b className="whitespace-nowrap font-mono text-[14px] font-[500] text-w">{r}</b>
    </div>
  );
}
