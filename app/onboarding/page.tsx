"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState("");
  const [trade, setTrade] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("onboard", {
      p_org_name: orgName,
      p_trade: trade || null,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.assign("/tableau-de-bord");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-w2 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2 text-[22px] font-bold tracking-tight">
          <span>AlloChantier</span>
          <span className="flex gap-0.5">
            <i className="block h-4 w-2 bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
            <i className="block h-4 w-2 bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
          </span>
        </div>

        <form onSubmit={onSubmit} className="rounded-[14px] border border-line bg-w p-6 shadow-sh2">
          <h1 className="text-lg font-[650]">Votre entreprise</h1>
          <p className="mb-5 mt-1 text-[13.5px] text-soft">
            Une dernière étape pour créer votre standard.
          </p>

          <label className="mb-1 block text-[13px] font-medium text-soft" htmlFor="orgName">
            Nom de l&apos;entreprise
          </label>
          <input id="orgName" type="text" required value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Plomberie Vasseur"
            className="mb-4 w-full rounded-sm border border-line2 bg-w px-3 py-2.5 text-[15px] outline-none focus-visible:border-or" />

          <label className="mb-1 block text-[13px] font-medium text-soft" htmlFor="trade">
            Métier
          </label>
          <input id="trade" type="text" value={trade}
            onChange={(e) => setTrade(e.target.value)}
            placeholder="Plomberie et chauffage"
            className="mb-5 w-full rounded-sm border border-line2 bg-w px-3 py-2.5 text-[15px] outline-none focus-visible:border-or" />

          {error && <p className="mb-4 rounded-sm border border-[#F2D5D2] bg-rd-wash px-3 py-2 text-[13px] text-rd">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-pill bg-or px-4 py-2.5 text-[14.5px] font-semibold text-w disabled:opacity-60">
            {loading ? "Création…" : "Créer mon standard"}
          </button>
        </form>
      </div>
    </main>
  );
}
