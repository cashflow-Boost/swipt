"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoMark } from "@/components/Logo";
import { PasswordField } from "@/components/PasswordField";

/** Choix du nouveau mot de passe, après clic sur le lien reçu par e-mail. */
export default function NouveauMotDePassePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(
        /session|token|expired/i.test(error.message)
          ? "Le lien a expiré. Redemandez un lien de réinitialisation."
          : error.message,
      );
      setLoading(false);
      return;
    }
    window.location.assign("/tableau-de-bord");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-w2 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <LogoMark size={26} />
          <span className="text-[20px] font-bold tracking-tight text-nv">Rimova</span>
        </div>

        <form onSubmit={onSubmit} className="rounded-[14px] border border-line bg-w p-6 shadow-sh2">
          <h1 className="text-lg font-[650]">Nouveau mot de passe</h1>
          <p className="mb-5 mt-1 text-[13.5px] text-soft">Choisissez un mot de passe d&apos;au moins 8 caractères.</p>

          <PasswordField
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={8}
            label={
              <label className="mb-1 block text-[13px] font-medium text-soft" htmlFor="password">
                Nouveau mot de passe
              </label>
            }
          />

          {error && (
            <p className="mb-4 rounded-sm border border-[#F2D5D2] bg-rd-wash px-3 py-2 text-[13px] text-rd">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-pill bg-or px-4 py-2.5 text-[14.5px] font-semibold text-w disabled:opacity-60"
          >
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>
    </main>
  );
}
