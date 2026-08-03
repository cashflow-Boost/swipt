"use client";

import { useState } from "react";

/**
 * Formulaire de rappel pour la démonstration. La ligne de Sonia n'est pas encore
 * ouverte : on recueille le numéro et on le dit franchement, plutôt que de
 * promettre un appel « dans 2 minutes » qui n'arrivera pas.
 */
export function DemoCallForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="mx-auto mt-8 max-w-md text-[15px] font-light leading-relaxed tracking-wide text-soft">
        C&apos;est noté. Vous serez prévenu dès que la ligne de Sonia est ouverte — en attendant,
        l&apos;essai gratuit vous donne accès à tout, sans carte bancaire.
      </p>
    );
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mx-auto mt-8 flex max-w-md"
      >
        <label htmlFor="demo-tel" className="sr-only">
          Votre numéro de téléphone
        </label>
        <input
          id="demo-tel"
          type="tel"
          required
          placeholder="06 12 34 56 78"
          className="w-full rounded-l-full border border-line2 px-6 py-3.5 text-[16px] text-nv outline-none transition-shadow focus:ring-2 focus:ring-line2"
        />
        <button
          type="submit"
          className="shrink-0 rounded-r-full bg-or px-7 py-3.5 text-[15px] font-medium text-w transition-colors duration-300 hover:bg-or-h"
        >
          M&apos;appeler
        </button>
      </form>
      <p className="mt-3 text-[12px] tracking-wide text-faint">
        Votre numéro ne sert qu&apos;à cet appel de démonstration.
      </p>
    </>
  );
}
