"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Identifiants incorrects.");
      setLoading(false);
      return;
    }
    // Navigation dure pour que le serveur relise la session depuis les cookies.
    window.location.assign("/tableau-de-bord");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-w2 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2 text-[22px] font-bold tracking-tight">
          <span>Rimova</span>
          <span className="flex gap-0.5">
            <i className="block h-4 w-2 bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
            <i className="block h-4 w-2 bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
          </span>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[14px] border border-line bg-w p-6 shadow-sh2"
        >
          <h1 className="text-lg font-[650]">Connexion</h1>
          <p className="mb-5 mt-1 text-[13.5px] text-soft">
            Accédez à votre standard.
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
            className="mb-4 w-full rounded-sm border border-line2 bg-w px-3 py-2.5 text-[15px] outline-none focus-visible:border-or"
          />

          <div className="mb-1 flex items-baseline justify-between gap-3">
            <label className="block text-[13px] font-medium text-soft" htmlFor="password">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-[12.5px] text-or-t underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <p className="mt-4 text-center text-[13px] text-soft">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="font-medium text-or-t underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
