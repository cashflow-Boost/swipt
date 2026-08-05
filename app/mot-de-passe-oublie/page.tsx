"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoMark } from "@/components/Logo";

/**
 * Réinitialisation du mot de passe. Supabase envoie un lien par e-mail qui
 * ramène sur /nouveau-mot-de-passe pour choisir le nouveau.
 */
export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-w2 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <LogoMark size={26} />
          <span className="text-[20px] font-bold tracking-tight text-nv">Rimova</span>
        </div>

        <div className="rounded-[14px] border border-line bg-w p-6 shadow-sh2">
          <h1 className="text-lg font-[650]">Mot de passe oublié</h1>

          {sent ? (
            <>
              <p className="mb-5 mt-2 text-[13.5px] leading-relaxed text-soft">
                Si un compte existe avec <b className="text-ink">{email}</b>, un lien de
                réinitialisation vient d&apos;être envoyé. Pensez à regarder vos spams.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-pill bg-or px-5 py-2.5 text-[14.5px] font-semibold text-w"
              >
                Retour à la connexion
              </Link>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              <p className="mb-5 mt-1 text-[13.5px] text-soft">
                Indiquez votre e-mail : nous vous envoyons un lien pour en choisir un nouveau.
              </p>

              <label className="mb-1 block text-[13px] font-medium text-soft" htmlFor="email">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-5 w-full rounded-sm border border-line2 bg-w px-3 py-2.5 text-[15px] outline-none focus-visible:border-or"
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
                {loading ? "Envoi…" : "Recevoir le lien"}
              </button>

              <p className="mt-4 text-center text-[13px] text-soft">
                <Link href="/login" className="font-medium text-or-t underline">
                  Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
