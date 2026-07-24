/**
 * Abstraction téléphonie — SPEC §2.1 (règle d'architecture non négociable).
 *
 * « Aucun fournisseur ne doit détenir la relation client ni la donnée métier. »
 *
 * La téléphonie est facturée à l'usage, c'est accepté ; mais elle DOIT être
 * encapsulée derrière cette interface pour être remplaçable sans réécriture.
 * AUCUN appel direct au SDK d'un fournisseur (Twilio, opérateur FR…) ne doit
 * exister ailleurs que dans une implémentation de ce module.
 */

export type PhoneNumber = string; // format E.164, ex. "+33123456789"

export interface InboundCall {
  providerCallId: string;
  from: PhoneNumber;
  to: PhoneNumber;
  startedAt: Date;
}

export interface SmsMessage {
  to: PhoneNumber;
  body: string;
}

export interface TelephonyProvider {
  /** Renvoi conditionnel : bascule vers SWIPT après N sonneries sans réponse. */
  configureConditionalForward(params: {
    orgNumber: PhoneNumber;
    forwardTo: PhoneNumber;
    ringCount: number;
  }): Promise<void>;

  /** Transfère un appel entrant vers l'artisan (urgence, demande humaine). */
  transferCall(providerCallId: string, to: PhoneNumber): Promise<void>;

  /** Coupe le renvoi immédiatement — « Je reprends la main » (SPEC §4.9). */
  disableForward(orgNumber: PhoneNumber): Promise<void>;

  /** Envoi d'un SMS (confirmation client, correction de rendez-vous). */
  sendSms(message: SmsMessage): Promise<{ providerMessageId: string }>;
}

/**
 * Implémentation de développement : ne contacte aucun réseau, journalise.
 * Le fournisseur réel (SPEC §2 : « [À DÉFINIR : Twilio ou opérateur FR] »)
 * fournira sa propre implémentation de TelephonyProvider.
 */
class NoopTelephonyProvider implements TelephonyProvider {
  async configureConditionalForward(): Promise<void> {
    console.warn("[telephony:noop] configureConditionalForward");
  }
  async transferCall(): Promise<void> {
    console.warn("[telephony:noop] transferCall");
  }
  async disableForward(): Promise<void> {
    console.warn("[telephony:noop] disableForward");
  }
  async sendSms(): Promise<{ providerMessageId: string }> {
    console.warn("[telephony:noop] sendSms");
    return { providerMessageId: "noop" };
  }
}

let instance: TelephonyProvider | null = null;

/** Point d'entrée unique. Sélectionne l'implémentation via l'environnement. */
export function getTelephonyProvider(): TelephonyProvider {
  if (instance) return instance;
  switch (process.env.TELEPHONY_PROVIDER) {
    // case "twilio": instance = new TwilioTelephonyProvider(); break;
    default:
      instance = new NoopTelephonyProvider();
  }
  return instance;
}
