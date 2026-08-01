"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Phone, Calendar, FileText, Receipt, Bell, Users, Euro, Settings,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { NAV, type NavIcon } from "@/lib/nav";
import { LogoMark } from "@/components/Logo";

const ICONS: Record<NavIcon, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  dashboard: LayoutDashboard,
  phone: Phone,
  calendar: Calendar,
  file: FileText,
  receipt: Receipt,
  bell: Bell,
  users: Users,
  euro: Euro,
  settings: Settings,
};

const KEY = "ac:sidebar-collapsed";

/**
 * Navigation latérale repliante.
 *
 * Le repli n'existe qu'au pointeur : sur mobile la barre devient un tiroir,
 * car à 72 px les libellés disparaissent et l'infobulle de survol n'existe pas
 * au doigt — la navigation deviendrait une rangée d'icônes muettes.
 */
export function Sidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(KEY) === "1");
  }, []);

  function toggle() {
    setCollapsed((v) => {
      localStorage.setItem(KEY, v ? "0" : "1");
      return !v;
    });
  }

  function items(compact: boolean) {
    return (
      <nav aria-label="Modules" className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              title={compact ? item.label : undefined}
              className={[
                "group relative flex items-center gap-3 rounded-lg py-2.5 text-sm transition-colors duration-200",
                compact ? "justify-center px-0" : "pl-4 pr-3",
                active ? "bg-or-wash font-medium text-or-t" : "text-soft hover:bg-w3 hover:text-ink",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-[3px] origin-center rounded-r bg-gr transition-transform duration-200"
                style={{
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                  transform: active ? "scaleY(1)" : "scaleY(0)",
                }}
              />
              <Icon size={20} strokeWidth={1.9} />
              {!compact && <span className="truncate">{item.label}</span>}

              {compact && (
                <span className="pointer-events-none absolute left-full z-30 ml-2 whitespace-nowrap rounded-md bg-nv px-2.5 py-1.5 text-[12.5px] font-medium text-w opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      {/* Colonne — grand écran */}
      <aside
        className="relative hidden shrink-0 md:block"
        style={{ width: collapsed ? 72 : 240, transition: "width .3s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Poignée flottante : discrète, chevauche légèrement le contenu. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          aria-expanded={!collapsed}
          className="absolute -right-3.5 top-6 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-md transition-all duration-200 hover:scale-105 hover:text-slate-900 hover:shadow-lg"
        >
          {collapsed ? <ChevronRight size={16} strokeWidth={2.2} /> : <ChevronLeft size={16} strokeWidth={2.2} />}
        </button>
        <div className="sticky top-[80px] pt-1">{items(collapsed)}</div>
      </aside>

      {/* Tiroir — petit écran */}
      <div aria-hidden={!mobileOpen} className={`fixed inset-0 z-[110] md:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={onClose}
          className="absolute inset-0 bg-nv/50 transition-opacity duration-300"
          style={{ opacity: mobileOpen ? 1 : 0, transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[264px] bg-w p-4"
          style={{
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform .3s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <LogoMark size={32} />
            <button type="button" onClick={onClose} aria-label="Fermer le menu" className="rounded-lg p-1.5 text-soft hover:bg-w3">
              <X size={20} strokeWidth={1.9} />
            </button>
          </div>
          {items(false)}
        </div>
      </div>
    </>
  );
}
