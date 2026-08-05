"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PasswordField } from "@/components/PasswordField";
import { LogoMark } from "@/components/Logo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    // Cet e-mail a-t-il déjà un compte ? Si oui on connecte au lieu d'en créer
    // un second : c'est ce qui faisait « repartir de zéro » avec un espace vide.
    const existing = await supabase.auth.signInWithPassword({ email, password });
    if (!existing.error) {
      window.location.assign("/tableau-de-bord");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(
        /already|exists|registered/i.test(error.message)
          ? "Un compte existe déjà avec cet e-mail. Connectez-vous (le mot de passe saisi ne correspond pas)."
          : error.message,
      );
      setLoading(false);
      return;
    }
    // Supabase renvoie un utilisateur sans identités quand l'e-mail est déjà pris.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      setError("Un compte existe déjà avec cet e-mail. Utilisez « Se connecter ».");
      setLoading(false);
      return;
    }
    if (data.session) {
      window.location.assign("/onboarding");
      return;
    }
    // Les comptes sont auto-confirmés en base (déclencheur) : on se connecte
    // directement, sans étape e-mail.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setInfo("Compte créé. Connectez-vous avec vos identifiants.");
      setLoading(false);
      return;
    }
    window.location.assign("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-w2 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <LogoMark size={26} />
          <span className="text-[20px] font-bold tracking-tight text-nv">Rimova</span>
        </div>

        <form onSubmit={onSubmit} className="rounded-[14px] border border-line bg-w p-6 shadow-sh2">
          <h1 className="text-lg font-[650]">Créer un compte</h1>
          <p className="mb-5 mt-1 text-[13.5px] text-soft">Vos 7 premiers appels sont offerts, sans carte bancaire.</p>

          <label className="mb-1 block text-[13px] font-medium text-soft" htmlFor="email">Adresse e-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-sm border border-line2 bg-w px-3 py-2.5 text-[15px] outline-none focus-visible:border-or" />

          <PasswordField
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={8}
            label={
              <label className="mb-1 block text-[13px] font-medium text-soft" htmlFor="password">
                Mot de passe
              </label>
            }
          />

          {error && <p className="mb-4 rounded-sm border border-[#F2D5D2] bg-rd-wash px-3 py-2 text-[13px] text-rd">{error}</p>}
          {info && <p className="mb-4 rounded-sm border border-or-line bg-or-wash px-3 py-2 text-[13px] text-or-t">{info}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-pill bg-or px-4 py-2.5 text-[14.5px] font-semibold text-w disabled:opacity-60">
            {loading ? "Création…" : "Créer mon compte"}
          </button>

          <p className="mt-4 rounded-sm border border-line bg-w2 px-3 py-2.5 text-[12.5px] leading-relaxed text-soft">
            Aucune carte bancaire n&apos;est demandée. Après vos 7 appels offerts, le service
            s&apos;arrête simplement : rien n&apos;est prélevé et aucun abonnement ne démarre tout seul.
            Pour continuer, vous choisirez une offre à ce moment-là. Voir les{" "}
            <Link href="/cgv" className="underline">conditions de vente</Link>.
          </p>

          <p className="mt-4 text-center text-[13px] text-soft">
            Déjà un compte ? <Link href="/login" className="font-medium text-or-t underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
