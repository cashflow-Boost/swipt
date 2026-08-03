/**
 * Grille tarifaire — source unique. La landing, la page /tarifs, le tunnel
 * d'achat et la page Abonnement lisent tous ici : un prix ne peut plus être
 * juste à un endroit et faux à un autre.
 */

/**
 * Offre de découverte : les premiers appels TRAITÉS sont offerts, sans carte
 * bancaire. Au-delà, il faut un abonnement pour que Sonia continue de décrocher.
 * (Remplace l'ancien essai limité dans le temps.)
 */
export const FREE_CALL_QUOTA = 7;

export const PLANS = [
  {
    id: "solo",
    name: "Solo",
    who: "Artisan seul",
    price: 99,
    cta: "Essai gratuit",
    feats: [
      "80 appels inclus",
      "Devis illimités",
      "1 utilisateur",
      "Prise de rendez-vous",
      "Relance des impayés",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    who: "Jusqu'à 3 personnes",
    price: 199,
    top: true,
    cta: "Essai gratuit",
    feats: [
      "Appels illimités",
      "Devis illimités",
      "Jusqu'à 3 utilisateurs",
      "Planning partagé",
      "Relance des impayés",
      "Plusieurs zones d'intervention",
    ],
  },
  {
    id: "agence",
    name: "Agence",
    who: "Équipe complète",
    price: 399,
    cta: "Essai gratuit",
    feats: [
      "Appels illimités",
      "Utilisateurs illimités",
      "Affectation automatique",
      "Rappel des devis sans réponse",
      "Interlocuteur dédié",
    ],
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export function planById(id: string | undefined) {
  return PLANS.find((p) => p.id === id);
}
