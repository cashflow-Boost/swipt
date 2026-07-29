import { NextResponse } from "next/server";

/**
 * Réception des événements Stripe.
 *
 * NON BRANCHÉ. La signature DOIT être vérifiée avec STRIPE_WEBHOOK_SECRET
 * avant toute écriture en base : sans cette vérification, n'importe qui
 * pourrait activer un abonnement en appelant cette adresse.
 *
 * Événements à traiter :
 *   checkout.session.completed        → subscription_status = 'active', plan posé
 *   customer.subscription.updated     → changement de forfait
 *   customer.subscription.deleted     → subscription_status = 'canceled'
 *   invoice.payment_failed            → subscription_status = 'past_due'
 *
 * Le corps doit être lu brut (await req.text()) pour que la signature reste
 * vérifiable — un req.json() la casserait.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not-configured" }, { status: 501 });
  }

  return NextResponse.json({ error: "not-implemented" }, { status: 501 });
}
