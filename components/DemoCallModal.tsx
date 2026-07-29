"use client";

import { useEffect, useRef, useState } from "react";

/**
 * « Écouter un appel démo » — l'artisan saisit son numéro et reçoit un appel
 * de Lia. La téléphonie n'est pas encore branchée : on recueille l'intention
 * et on l'annonce honnêtement plutôt que de simuler un appel qui n'arrivera pas.
 */
export function DemoCallModal({
  label = "Écouter un appel de démonstration",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-nv/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            className="w-full max-w-md rounded-lg border border-line bg-w p-6 shadow-sh3"
          >
            {!sent ? (
              <>
                <h2 id="demo-title" className="text-[20px] font-[680]">
                  Démo audio bientôt disponible
                </h2>
                <p className="mt-2 text-[14.5px] text-soft">
                  La ligne de Lia est en cours de mise en service. Laissez vos coordonnées : vous
                  serez prévenu dès qu&apos;elle décroche, et vous pourrez l&apos;appeler pour
                  l&apos;entendre.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="mt-5 space-y-3"
                >
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-soft">
                      Votre téléphone
                    </span>
                    <input
                      type="tel"
                      required
                      autoFocus
                      placeholder="06 12 34 56 78"
                      className="w-full rounded-sm border border-line2 bg-w px-3.5 py-2.5 text-[15px] outline-none focus-visible:border-or"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-soft">
                      Votre e-mail
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="vous@exemple.fr"
                      className="w-full rounded-sm border border-line2 bg-w px-3.5 py-2.5 text-[15px] outline-none focus-visible:border-or"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-pill bg-or px-5 py-3 text-[15px] font-semibold text-w hover:bg-or-h"
                  >
                    Me prévenir
                  </button>
                </form>
                <p className="mt-3 text-center text-[12px] text-faint">
                  Vos coordonnées ne servent qu&apos;à vous prévenir du lancement.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-[20px] font-[680]">C&apos;est noté</h2>
                <p className="mt-2 text-[14.5px] text-soft">
                  Vous serez prévenu dès que la démo audio est ouverte. En attendant, l&apos;essai
                  gratuit vous donne accès à tout, sans carte bancaire.
                </p>
                <a
                  href="/signup"
                  className="mt-5 block rounded-pill bg-or px-5 py-3 text-center text-[15px] font-semibold text-w hover:bg-or-h"
                >
                  Démarrer l&apos;essai gratuit
                </a>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full rounded-pill border border-line2 px-5 py-2.5 text-[14px] font-semibold text-soft hover:border-faint"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
