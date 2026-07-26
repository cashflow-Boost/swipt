"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAgentPausedAction } from "@/app/actions";

/**
 * « Je reprends la main » (SPEC §4.9). Sa présence visible en permanence est ce
 * qui rend l'artisan prêt à confier ses appels : il sait qu'il peut couper d'un
 * geste. État optimiste pour un retour immédiat, confirmé côté serveur.
 */
export function TakeControlButton({ paused: initial }: { paused: boolean }) {
  const [paused, setPaused] = useState(initial);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle() {
    const next = !paused;
    setPaused(next);
    const fd = new FormData();
    fd.set("paused", String(next));
    start(async () => {
      await setAgentPausedAction(fd);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={paused}
      title={paused ? "SWIPT ne prend plus vos appels" : "SWIPT répond quand vous ne pouvez pas"}
      className={
        paused
          ? "rounded-pill border border-rd bg-rd px-3.5 py-1.5 text-[12.5px] font-semibold text-w disabled:opacity-60"
          : "rounded-pill border border-line2 bg-w px-3.5 py-1.5 text-[12.5px] font-semibold text-rd disabled:opacity-60"
      }
    >
      {paused ? "▶ Rendre la main à SWIPT" : "⏸ Je reprends la main"}
    </button>
  );
}
