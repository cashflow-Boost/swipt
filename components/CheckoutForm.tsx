"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/lib/stripe";
import type { PlanId } from "@/lib/plans";
import { Spinner } from "@/components/ui";

/**
 * Coordonnées avant paiement. Tant que Stripe n'est pas branché, l'API répond
 * 501 et on l'annonce clairement — mieux vaut « bientôt disponible » qu'un
 * bouton qui tourne dans le vide.
 */
export function CheckoutForm({ planId }: { planId: PlanId }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);

    const fd = new FormData(e.currentTarget);
    const res = await createCheckoutSession({
      plan: planId,
      email: String(fd.get("email") ?? ""),
      companyName: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
    });

    if (res.ok) {
      window.location.href = res.url;
      return;
    }
    setNotice(res.message);
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-10">
      <h2 className="text-[20px] font-semibold tracking-tight">Vos coordonnées</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field name="company" label="Nom de l'entreprise" placeholder="Plomberie Vasseur" required />
        <Field name="email" label="Adresse e-mail" type="email" placeholder="vous@exemple.fr" required />
        <Field name="phone" label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-or px-8 py-4 text-[16px] font-medium text-w transition-colors duration-300 hover:bg-or-h disabled:opacity-60"
      >
        {busy && <Spinner size={16} />}
        Continuer vers le paiement
      </button>

      {notice && (
        <p className="mt-4 rounded-[10px] border border-line bg-w3 px-4 py-3 text-[14px] text-soft">{notice}</p>
      )}

      <p className="mt-6 max-w-[64ch] text-[13px] font-light leading-relaxed text-faint">
        Le paiement est traité par Stripe. Rimova ne conserve aucune donnée de carte bancaire.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-soft">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-sm border border-line2 bg-w px-3.5 py-2.5 text-[15px] outline-none"
      />
    </label>
  );
}
