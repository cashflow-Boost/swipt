import { createClient } from "@/lib/supabase/server";

export interface UserAndOrg {
  userId: string;
  email: string | null;
  orgId: string | null;
  orgName: string | null;
}

/**
 * Résout l'utilisateur connecté et, s'il est rattaché, son organisation.
 * - renvoie null si aucune session (→ /login) ;
 * - orgId/orgName à null si l'utilisateur n'a pas encore fait l'onboarding
 *   (→ /onboarding).
 * La RLS (SPEC §7) garantit que seule l'org de l'utilisateur est lisible.
 */
export async function getUserAndOrg(): Promise<UserAndOrg | null> {
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

  const org = data?.organizations as { name: string } | { name: string }[] | null;
  const orgName = Array.isArray(org) ? (org[0]?.name ?? null) : (org?.name ?? null);
  return {
    userId: user.id,
    email: user.email ?? null,
    orgId: (data?.org_id as string) ?? null,
    orgName,
  };
}

export interface SessionOrg {
  userId: string;
  orgId: string;
  orgName: string | null;
}

/** Variante garantissant une org (null si pas de session ou pas d'org). */
export async function getSessionOrg(): Promise<SessionOrg | null> {
  const s = await getUserAndOrg();
  if (!s || !s.orgId) return null;
  return { userId: s.userId, orgId: s.orgId, orgName: s.orgName };
}
