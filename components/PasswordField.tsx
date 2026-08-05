"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Champ mot de passe avec bouton « afficher / masquer ».
 * Saisir un mot de passe à l'aveugle sur mobile est la première cause d'échec
 * de connexion : on laisse l'artisan vérifier ce qu'il tape.
 */
export function PasswordField({
  id = "password",
  label,
  value,
  onChange,
  autoComplete = "current-password",
  minLength,
  className = "",
}: {
  id?: string;
  label?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  minLength?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {label}
      <div className={`relative mb-5 ${className}`}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm border border-line2 bg-w px-3 py-2.5 pr-11 text-[15px] outline-none focus-visible:border-or"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-2 text-faint transition-colors hover:text-nv"
        >
          {visible ? <EyeOff size={18} strokeWidth={1.9} /> : <Eye size={18} strokeWidth={1.9} />}
        </button>
      </div>
    </>
  );
}
