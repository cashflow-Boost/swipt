"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/login");
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-pill border border-line2 bg-w px-3 py-1.5 text-[12.5px] font-medium text-soft hover:text-ink"
    >
      Déconnexion
    </button>
  );
}
