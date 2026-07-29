"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

/**
 * Assemble la barre latérale et le contenu. Le bouton d'ouverture du tiroir
 * n'existe qu'en dessous de `md` : au-dessus, la colonne est toujours là.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-[1400px] gap-6 px-5 py-6">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <main className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[13.5px] font-medium text-soft md:hidden"
        >
          <Menu size={18} strokeWidth={1.9} />
          Menu
        </button>
        {children}
      </main>
    </div>
  );
}
