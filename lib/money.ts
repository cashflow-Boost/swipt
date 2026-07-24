/**
 * Montants — SPEC §13 : « Les montants sont en centimes entiers en base,
 * jamais en flottants. » Toute la logique métier manipule des centimes (number
 * entier). Le formatage n'intervient qu'à l'affichage.
 */

export type Cents = number;

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** 15000 -> "150,00 €" */
export function formatEuros(cents: Cents): string {
  return eur.format(cents / 100);
}

/** Taux de TVA autorisés dans le bâtiment (SPEC §8), en points de pourcentage. */
export const VAT_RATES = [20, 10, 5.5] as const;
export type VatRate = (typeof VAT_RATES)[number];

/** TVA d'une ligne HT, arrondie au centime entier. */
export function vatOf(htCents: Cents, rate: VatRate): Cents {
  return Math.round((htCents * rate) / 100);
}

export function ttcOf(htCents: Cents, rate: VatRate): Cents {
  return htCents + vatOf(htCents, rate);
}
