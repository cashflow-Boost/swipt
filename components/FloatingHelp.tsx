"use client";

import { useEffect, useState } from "react";

/**
 * Lien d'aide flottant. Encre pleine et texte seul — pas de pastille verte ni
 * de pictogramme, la page n'en porte aucun. Le numéro se règle par
 * NEXT_PUBLIC_WHATSAPP_NUMBER (format international sans « + »).
 */
const FALLBACK = "33600000000";

export function FloatingHelp({ phone }: { phone?: string }) {
  const [visible, setVisible] = useState(false);
  const number = phone || FALLBACK;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent("Bonjour, j'ai une question sur AlloChantier")}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-[90] rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-w transition-all duration-300 hover:bg-or-h ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      Une question ?
    </a>
  );
}
