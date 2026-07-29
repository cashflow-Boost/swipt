import { createClient } from "@/lib/supabase/server";

export interface UserAndOrg {
  userId: string;
  email: string | null;
  orgId: string | null;
  orgName: string | null;
  agentPaused: boolean;
  /** Jours restants d'essai (négatif si terminé), null si abonnement actif. */
  trialDaysLeft: number | null;
  /** Accès ouvert : abonnement actif, ou essai encore en cours. */
  accessOpen: boolean;
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
    .select("org_id, organizations(name, agent_paused, trial_ends_at, subscription_status)")
    .eq("id", user.id)
    .maybeSingle();

  type OrgRow = {
    name: string;
    agent_paused: boolean;
    trial_ends_at: string | null;
    subscription_status: string | null;
  };
  const org = data?.organizations as OrgRow | OrgRow[] | null;
  const orgRow = Array.isArray(org) ? (org[0] ?? null) : org;

  const subscribed = orgRow?.subscription_status === "active";
  let trialDaysLeft: number | null = null;
  if (!subscribed && orgRow?.trial_ends_at) {
    const ms = new Date(orgRow.trial_ends_at).getTime() - Date.now();
    trialDaysLeft = Math.ceil(ms / 86_400_000);
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    orgId: (data?.org_id as string) ?? null,
    orgName: orgRow?.name ?? null,
    agentPaused: orgRow?.agent_paused ?? false,
    trialDaysLeft,
    // Sans org (avant onboarding) l'accès n'est pas encore la question.
    accessOpen: subscribed || trialDaysLeft === null || trialDaysLeft > 0,
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
