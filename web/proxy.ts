import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (ex-Middleware, renommé en Next.js 16) — rafraîchit la session Supabase
 * à chaque requête et propage les cookies d'authentification.
 *
 * NB : SPEC §7 impose que la RLS reste la barrière d'autorisation réelle ;
 * ce proxy ne fait que maintenir la session vivante (pas d'autorisation métier).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Supabase non configuré (ex. avant branchement) : ne rien faire, laisser passer.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Rafraîchit le token si nécessaire. Ne pas insérer de logique entre la
  // création du client et cet appel.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Toutes les routes sauf assets statiques et fichiers images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
