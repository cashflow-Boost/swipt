import { createClient } from "@/lib/supabase/server";

export interface SessionOrg {
  userId: string;
  orgId: string;
  orgName: string | null;
}

/**
 * Renvoie l'utilisateur connecté et son organisation, ou null si pas de session.
 * La RLS (SPEC §7) garantit que seule l'org de l'utilisateur est lisible.
 */
export async function getSessionOrg(): Promise<SessionOrg | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("org_id, organizations(name)")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) return null;

  const org = data.organizations as { name: string } | { name: string }[] | null;
  const orgName = Array.isArray(org) ? (org[0]?.name ?? null) : (org?.name ?? null);
  return { userId: user.id, orgId: data.org_id as string, orgName };
}
