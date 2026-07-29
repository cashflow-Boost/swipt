import { NextResponse } from "next/server";

/**
 * Ouverture d'une session de paiement Stripe.
 *
 * NON BRANCHÉ. Tant que STRIPE_SECRET_KEY n'est pas posée, la route répond
 * 501 : le tunnel affiche « bientôt disponible » au lieu de faire croire à un
 * paiement qui n'aboutirait pas.
 *
 * À implémenter ici :
 *   1. valider l'entrée (plan, e-mail, entreprise) ;
 *   2. retrouver ou créer le client Stripe ;
 *   3. stripe.checkout.sessions.create({ mode: "subscription", ... }) avec
 *      trial_period_days: 7 et le price_id du forfait ;
 *   4. renvoyer { url } vers la page hébergée par Stripe.
 */
export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "not-configured", message: "Paiement non encore ouvert." },
      { status: 501 },
    );
  }

  return NextResponse.json(
    { error: "not-implemented", message: "Tunnel de paiement à implémenter." },
    { status: 501 },
  );
}
