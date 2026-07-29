"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Révèle son contenu quand il entre dans la fenêtre. L'élément reste visible
 * une fois révélé — rien ne « re-disparaît » au défilement inverse, ce qui
 * fatigue à la lecture. Neutralisé par prefers-reduced-motion (cf. globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Décalage en ms, pour faire apparaître une grille en cascade. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Sans IntersectionObserver, on affiche immédiatement plutôt que de masquer.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown={shown}
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      className={`ac-reveal ${className}`}
    >
      {children}
    </div>
  );
}
