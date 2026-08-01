"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";

/* ═══════════════════════════════════════════════════════════════════════════
   Briques d'interface partagées. Tout le mouvement passe par les classes
   `ac-*` de globals.css, donc par le même easing.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Écran d'ouverture minimaliste : le logo seul, qui apparaît en douceur puis
 * s'efface. Pas de texte, pas d'anneau, pas de points — juste une respiration.
 */
export function Splash() {
  const [gone, setGone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!gone) return;
    const t = setTimeout(() => setHidden(true), 700);
    return () => clearTimeout(t);
  }, [gone]);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-white ${gone ? "ac-splash-out" : ""}`}
    >
      <span className="ac-splash-mark">
        <LogoMark size={56} />
      </span>
    </div>
  );
}

/** Ligne de chargement — même gabarit que les listes réelles. */
export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[11px] border border-line">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-3.5 last:border-b-0">
          <span className="ac-skeleton h-9 w-9 shrink-0 rounded-full" />
          <span className="flex-1 space-y-2">
            <span className="ac-skeleton block h-[11px] w-1/3 rounded" />
            <span className="ac-skeleton block h-[10px] w-2/3 rounded" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <span className="ac-spinner inline-block" style={{ width: size, height: size }} aria-hidden="true" />;
}

export function AnimatedCheck({ size = 16 }: { size?: number }) {
  return (
    <svg className="ac-check" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pastille de statut. Le vert « en cours » respire, les autres non. */
export function Badge({
  tone = "green",
  pulse = false,
  children,
}: {
  tone?: "green" | "amber" | "red";
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const tones = {
    green: { bg: "#D1FAE5", fg: "#047857" },
    amber: { bg: "#FEF3C7", fg: "#92400E" },
    red: { bg: "#FEE2E2", fg: "#991B1B" },
  }[tone];

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{ background: tones.bg, color: tones.fg }}
    >
      {pulse && (
        <i
          className="ac-pulse inline-block h-[6px] w-[6px] rounded-full"
          style={{ background: tones.fg }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/** Bouton principal — onde au point de clic, survol vert. */
export function PrimaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; d: number }[]>([]);

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const id = Date.now();
    setRipples((v) => [...v, { id, x: e.clientX - r.left - d / 2, y: e.clientY - r.top - d / 2, d }]);
    setTimeout(() => setRipples((v) => v.filter((x) => x.id !== id)), 600);
    rest.onClick?.(e);
  }

  return (
    <button
      {...rest}
      onClick={onClick}
      className={`relative overflow-hidden rounded-full bg-or px-6 py-3 text-[15px] font-medium text-w transition-all duration-300 hover:-translate-y-px hover:bg-or-h hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,.5)] active:scale-[.97] ${className}`}
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {ripples.map((r) => (
        <span key={r.id} className="ac-ripple-dot" style={{ left: r.x, top: r.y, width: r.d, height: r.d }} />
      ))}
      {children}
    </button>
  );
}

/** Notification discrète, en bas à droite. */
export function Toast({ message, onDone }: { message: string | null; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) return;
    setOpen(true);
    timer.current = setTimeout(() => {
      setOpen(false);
      setTimeout(() => onDone?.(), 500);
    }, 3200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      role="status"
      data-open={open}
      className="ac-toast fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-[14px] border border-line bg-w px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,.1)]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gr-wash text-gr">
        <AnimatedCheck size={15} />
      </span>
      <span className="text-[14px] font-medium text-nv">{message}</span>
    </div>
  );
}

/**
 * Téléchargement d'un document. La barre de progression est indicative :
 * le navigateur ne signale pas l'avancement d'une ouverture de page, on
 * montre donc une attente, pas une mesure.
 */
export function PdfButton({ href, label = "PDF" }: { href: string; label?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  function go(e: React.MouseEvent<HTMLAnchorElement>) {
    if (state !== "idle") {
      e.preventDefault();
      return;
    }
    setState("loading");
    setTimeout(() => setState("done"), 1500);
    setTimeout(() => setState("idle"), 4000);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={go}
      className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-1.5 text-[12.5px] font-semibold transition-colors duration-300 ${
        state === "done" ? "border-gr bg-gr text-w" : "border-line2 text-nv hover:border-or"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {state === "done" ? (
        <>
          <AnimatedCheck size={14} />
          PDF ouvert
        </>
      ) : (
        label
      )}
      {state === "loading" && (
        <span
          className="absolute bottom-0 left-0 h-[2px] bg-or"
          style={{ width: "100%", animation: "ac-progress 1.5s cubic-bezier(.16,1,.3,1) forwards" }}
        />
      )}
    </a>
  );
}
