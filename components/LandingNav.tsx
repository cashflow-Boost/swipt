"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#questions", label: "FAQ" },
];

/** Barre de navigation : transparente en haut, opaque et ombrée au défilement. */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "border-b border-line bg-w/90 shadow-sh2" : "bg-w/60"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-8">
          <div className="flex items-center gap-10">
            <Logo />
            <div className="hidden items-center gap-8 md:flex">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-[14px] font-medium tracking-wide text-soft transition-colors hover:text-nv-2">
                  {l.label}
                </a>
              ))}
              <Link href="/login" className="text-[14px] font-medium tracking-wide text-soft transition-colors hover:text-nv-2">
                Se connecter
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-or px-5 py-2 text-[14px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
            >
              Essai gratuit
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="rounded-lg p-1.5 text-soft md:hidden"
            >
              <Menu size={22} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </nav>

      {/* Tiroir mobile */}
      <div aria-hidden={!open} className={`fixed inset-0 z-[120] md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-nv/50 transition-opacity duration-300"
          style={{ opacity: open ? 1 : 0, transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[280px] bg-w p-6"
          style={{
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform .3s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="flex justify-end">
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" className="rounded-lg p-1.5 text-soft">
              <X size={22} strokeWidth={1.9} />
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-5">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[17px] font-medium text-nv">
                {l.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="text-[17px] font-medium text-nv">
              Se connecter
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-or px-5 py-3 text-center text-[15px] font-medium text-w"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
