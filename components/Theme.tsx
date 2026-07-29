"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "ac:theme";

/**
 * Script posé avant le rendu : il applique le thème mémorisé sur <html> dès la
 * première peinture. Sans lui, un utilisateur en sombre voit un éclair blanc à
 * chaque navigation — le défaut le plus visible d'un thème mal branché.
 */
export const THEME_BOOT = `(function(){try{var t=localStorage.getItem('${KEY}');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.dataset.theme='dark'}}catch(e){}})()`;

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    setReady(true);
  }, []);

  function set(next: boolean) {
    setDark(next);
    localStorage.setItem(KEY, next ? "dark" : "light");
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }

  return (
    <div className="rounded-[12px] border border-line bg-w p-4">
      <h2 className="text-[14.5px] font-[650]">Apparence</h2>
      <p className="mt-1 text-[13px] text-soft">
        Le thème est enregistré sur cet appareil. Par défaut, AlloChantier suit le réglage de votre
        téléphone ou de votre ordinateur.
      </p>

      <div
        role="radiogroup"
        aria-label="Thème de l'interface"
        className="mt-4 inline-flex rounded-pill border border-line2 p-1"
      >
        {[
          { v: false, label: "Clair", Icon: Sun },
          { v: true, label: "Sombre", Icon: Moon },
        ].map(({ v, label, Icon }) => {
          const on = ready && dark === v;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => set(v)}
              className={`flex items-center gap-2 rounded-pill px-4 py-2 text-[13.5px] font-medium transition-colors duration-300 ${
                on ? "bg-or text-w" : "text-soft hover:text-ink"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              <Icon size={16} strokeWidth={1.9} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
