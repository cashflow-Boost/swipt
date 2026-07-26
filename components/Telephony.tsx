"use client";

import { useState } from "react";

/**
 * Branchement téléphonique (SPEC §3) — l'artisan garde SON numéro. Un renvoi
 * conditionnel bascule vers le numéro SWIPT après N sonneries sans réponse.
 * Les codes affichés sont les codes GSM standard, composés depuis le mobile
 * de l'artisan : aucune démarche chez l'opérateur.
 */
export function Telephony({
  swiptNumber,
  ringCount,
}: {
  swiptNumber: string | null;
  ringCount: number;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  // GSM : délai en secondes, par pas de 5, borné à 30. ~5 s par sonnerie.
  const delay = Math.min(30, Math.max(5, Math.round((ringCount * 5) / 5) * 5));
  const n = (swiptNumber ?? "").replace(/\s/g, "");

  const codes = n
    ? [
        { k: "Sans réponse", v: `**61*${n}**${delay}#`, d: `bascule après ${delay} s (~${ringCount} sonneries)` },
        { k: "Ligne occupée", v: `**67*${n}#`, d: "vous êtes déjà en ligne" },
        { k: "Injoignable", v: `**62*${n}#`, d: "pas de réseau, téléphone éteint" },
      ]
    : [];

  function copy(v: string) {
    navigator.clipboard.writeText(v).then(() => {
      setCopied(v);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="mt-3 rounded-[11px] border border-line bg-w2 p-4">
      <h3 className="text-[13.5px] font-[650]">Activer le renvoi vers SWIPT</h3>

      {!n ? (
        <p className="mt-2 text-[13px] text-soft">
          Votre numéro SWIPT n&apos;est pas encore attribué. Dès qu&apos;il l&apos;est, les codes
          de renvoi s&apos;affichent ici — vous n&apos;aurez qu&apos;à les composer depuis votre mobile.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[13px] text-soft">
            Composez ces codes <b className="text-ink">depuis votre téléphone professionnel</b>, comme un
            appel normal. Votre numéro ne change pas : il sonne toujours chez vous d&apos;abord.
          </p>
          <ul className="mt-3 space-y-2">
            {codes.map((c) => (
              <li key={c.k} className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="w-28 shrink-0 font-mono text-[10.5px] uppercase tracking-[0.09em] text-faint">
                  {c.k}
                </span>
                <button
                  type="button"
                  onClick={() => copy(c.v)}
                  className="rounded-sm border border-line2 bg-w px-2.5 py-1 font-mono text-[13px] hover:border-or"
                >
                  {copied === c.v ? "Copié ✓" : c.v}
                </button>
                <span className="text-[12px] text-faint">{c.d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-faint">
            Pour tout annuler et reprendre vos appels en direct : composez <code className="font-mono">##002#</code>.
          </p>
        </>
      )}
    </div>
  );
}
