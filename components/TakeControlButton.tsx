"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAgentPausedAction } from "@/app/actions";

/**
 * « Je reprends la main » (SPEC §4.9), en interrupteur façon iOS.
 *
 * Actif = Sonia prend les appels ; inactif = l'artisan répond lui-même. Le geste
 * reste immédiat (état optimiste) et discret : pas d'alerte rouge, juste une
 * bascule que l'on comprend d'un coup d'œil.
 */
export function TakeControlButton({ paused: initial }: { paused: boolean }) {
  const [paused, setPaused] = useState(initial);
  const [pending, start] = useTransition();
  const router = useRouter();
  const active = !paused;

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
      role="switch"
      aria-checked={active}
      aria-label={active ? "Sonia prend vos appels" : "Vous répondez vous-même"}
      onClick={toggle}
      disabled={pending}
      className="flex items-center gap-2 disabled:opacity-60"
    >
      <span className={`text-xs font-medium ${active ? "text-soft" : "text-faint"}`}>
        {active ? "Sonia" : "Manuel"}
      </span>
      <span
        className={`relative h-6 w-10 rounded-full transition-colors duration-300 ${
          active ? "bg-gr" : "bg-[#CBD5E1]"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
      >
        <span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300"
          style={{
            transform: active ? "translateX(0)" : "translateX(16px)",
            transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
          }}
        />
      </span>
    </button>
  );
}
