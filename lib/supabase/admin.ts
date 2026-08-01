import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase à privilèges élevés (service-role) — RÉSERVÉ aux appels
 * machine-à-machine sans session utilisateur : le webhook de l'agent vocal
 * (Retell AI) qui écrit un rendez-vous après un appel.
 *
 * ⚠ Ce client CONTOURNE la RLS. Toute requête DOIT donc filtrer explicitement
 * par `org_id` — la barrière de cloisonnement n'est plus automatique ici.
 * La clé n'existe QUE côté serveur (jamais NEXT_PUBLIC_) et n'est jamais
 * exposée au navigateur.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante : le webhook vocal ne peut pas écrire en base.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
