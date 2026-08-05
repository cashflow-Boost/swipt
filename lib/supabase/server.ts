import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SESSION_COOKIE_OPTIONS } from "./cookies";

/**
 * Client Supabase côté serveur (Server Components, Route Handlers, Server Actions).
 * La RLS multi-tenant (SPEC §7) reste la barrière d'autorisation : ce client
 * agit avec le JWT de l'utilisateur, jamais avec la service-role key.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component : le rafraîchissement des
            // cookies est pris en charge par proxy.ts. Sans effet ici.
          }
        },
      },
    },
  );
}
