"use client";

import { useFormStatus } from "react-dom";

/** Bouton de soumission désactivé pendant l'envoi — évite les doubles soumissions. */
export function SubmitButton({
  children,
  className,
  pendingText,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className ?? ""} disabled:opacity-60`}>
      {pending ? (pendingText ?? "…") : children}
    </button>
  );
}
