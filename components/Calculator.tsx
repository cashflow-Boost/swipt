"use client";

import { useState } from "react";
import Link from "next/link";

// Calculateur d'appels manqués (SPEC §6.2). Constantes fixées par la spec.
const WORKDAYS = 22;
const RECOVERY = 0.7;
const OVERAGE = 0.79;
const PLANS = [
  { n: "Solo", m: 149, c: 130 },
  { n: "Équipe", m: 299, c: 260 },
  { n: "Pro", m: 549, c: 480 },
] as const;

const fmt = new Intl.NumberFormat("fr-FR");
const fmt1 = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function planFor(monthlyCalls: number) {
  for (let i = 0; i < PLANS.length; i++) if (monthlyCalls <= PLANS[i].c) return PLANS[i];
  return PLANS[2];
}

export function Calculator() {
  const [calls, setCalls] = useState(3);
  const [ticket, setTicket] = useState(250);
  const [rate, setRate] = useState(3);

  const monthly = calls * WORKDAYS;
  const jobs = (monthly * rate) / 10;
  const lost = jobs * ticket;
  const plan = planFor(monthly);
  const extra = Math.max(0, monthly - plan.c);
  const cost = plan.m + extra * OVERAGE;
  const net = Math.max(0, Math.round(lost * RECOVERY - cost));
  const payback = Math.max(1, Math.ceil(cost / ticket));

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-w2 shadow-sh2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-w px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-or-t">
          Calculateur — appels manqués
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          Base {WORKDAYS} jours travaillés
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        {/* curseurs */}
        <div className="space-y-6 p-6">
          <Dial label="Appels que vous ne décrochez pas, par jour" value={String(calls)}>
            <input type="range" min={1} max={12} step={1} value={calls} onChange={(e) => setCalls(+e.target.value)} className="swipt-range" />
            <Scale left="1" right="12" />
          </Dial>
          <Dial label="Montant moyen d'une intervention" value={`${fmt.format(ticket)} €`}>
            <input type="range" min={100} max={600} step={10} value={ticket} onChange={(e) => setTicket(+e.target.value)} className="swipt-range" />
            <Scale left="100 €" right="600 €" />
          </Dial>
          <Dial label="Sur 10 appels manqués, combien seraient devenus un chantier" value={String(rate)}>
            <input type="range" min={1} max={5} step={1} value={rate} onChange={(e) => setRate(+e.target.value)} className="swipt-range" />
            <Scale left="1 sur 10" right="5 sur 10" />
          </Dial>
        </div>

        {/* résultat */}
        <div className="border-t border-line bg-w p-6 md:border-l md:border-t-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-rd">
            Chiffre d&apos;affaires perdu chaque mois
          </div>
          <div className="mt-2 font-mono text-[clamp(38px,7vw,56px)] font-[650] leading-none tracking-[-0.03em] text-rd">
            {fmt.format(Math.round(lost))} €
          </div>

          <div className="mt-5 space-y-2 border-t border-line pt-4 text-[13.5px] text-soft">
            <Line l={`${calls} appel${calls > 1 ? "s" : ""} manqué${calls > 1 ? "s" : ""} × ${WORKDAYS} jours`} r={`${fmt.format(monthly)} appels`} />
            <Line l={`dont ${rate} sur 10 → chantier`} r={`${fmt1.format(jobs)} chantiers`} />
            <Line l={`× ${fmt.format(ticket)} € l'intervention`} r={`${fmt.format(Math.round(lost))} €`} />
          </div>

          <div className="mt-5 rounded-[11px] border border-or-line bg-or-wash p-4">
            <div className="text-[14px] text-ink">
              Pour ~<b>{fmt.format(monthly)} appels/mois</b>, la formule adaptée est{" "}
              <b className="text-or-t">{plan.n}</b>
              {extra > 0 ? `, soit ${fmt.format(Math.round(cost))} €/mois.` : `, à ${plan.m} €/mois.`}
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-soft">Récupéré, net</div>
                <div className="font-mono text-[26px] font-[650] leading-none text-or-t">{fmt.format(net)} €/mois</div>
              </div>
              <Link href="/signup" className="rounded-pill bg-or px-4 py-2.5 text-[14px] font-semibold text-ink">
                Commencer l&apos;essai
              </Link>
            </div>
            <div className="mt-2 text-[12px] text-soft">
              {payback <= 1 ? "Une intervention récupérée rembourse le mois." : `${payback} interventions récupérées remboursent le mois.`}
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
        <span className="whitespace-nowrap font-mono text-[19px] font-[550] text-or-t">{value}</span>
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
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2 last:border-b-0">
      <span>{l}</span>
      <b className="whitespace-nowrap font-mono text-[14px] font-[500] text-ink">{r}</b>
    </div>
  );
}
