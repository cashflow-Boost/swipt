/**
 * Durée de vie de la session.
 *
 * Sans `maxAge` explicite, les cookies d'authentification sont des cookies de
 * session : plusieurs navigateurs les effacent à la fermeture, et l'artisan
 * devait ressaisir son mot de passe à chaque visite. On les rend persistants
 * 30 jours ; le jeton est rafraîchi automatiquement à chaque passage (proxy.ts),
 * donc un usage régulier ne demande jamais de reconnexion. Un nouvel appareil,
 * lui, n'a pas ces cookies : il faudra s'y connecter une fois.
 */
export const SESSION_MAX_AGE_DAYS = 30;

export const SESSION_COOKIE_OPTIONS = {
  maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  sameSite: "lax",
  path: "/",
} as const;
