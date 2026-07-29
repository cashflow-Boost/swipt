"use client";

/** Déclenche l'impression du document — le navigateur propose « Enregistrer en PDF ». */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-pill bg-ink px-4 py-2 text-[13.5px] font-semibold text-w"
    >
      Imprimer / Enregistrer en PDF
    </button>
  );
}
