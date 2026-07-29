import type { PlanId } from "@/lib/plans";

/**
 * Passerelle Stripe — côté navigateur.
 *
 * Rien n'est branché tant que les clés ne sont pas posées : les fonctions le
 * disent franchement plutôt que d'échouer en silence sur un tunnel d'achat.
 * Le SDK n'est chargé qu'au moment du paiement, pour ne pas alourdir chaque
 * page d'un script que la plupart des visiteurs n'utiliseront jamais.
 */

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

/** Vrai quand la clé publique est configurée. */
export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_PUBLISHABLE_KEY);
}

/** Charge le SDK Stripe à la demande. `null` si la clé manque. */
export async function loadStripeClient() {
  if (!STRIPE_PUBLISHABLE_KEY) return null;
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(STRIPE_PUBLISHABLE_KEY);
}

export type CheckoutInput = {
  plan: PlanId;
  email: string;
  companyName: string;
  phone?: string;
};

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not-configured" | "error"; message: string };

/** Demande une session de paiement à notre propre API, qui parle à Stripe. */
export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (res.status === 501) {
    return {
      ok: false,
      reason: "not-configured",
      message: "Le paiement n'est pas encore ouvert. Votre demande a bien été notée.",
    };
  }

  if (!res.ok) {
    return { ok: false, reason: "error", message: "Le paiement n'a pas pu démarrer. Réessayez dans un instant." };
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    return { ok: false, reason: "error", message: "Réponse inattendue du paiement." };
  }
  return { ok: true, url: data.url };
}
