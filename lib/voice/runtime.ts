/**
 * Abstraction runtime vocal — SPEC §2.1 (règle d'architecture non négociable).
 *
 * Le runtime vocal temps réel (Retell AI, SPEC §2) est facturé à l'usage mais
 * DOIT rester encapsulé derrière cette interface. Aucun appel direct au SDK du
 * fournisseur hors d'une implémentation de ce module.
 *
 * Exigences dures rattachées (SPEC §5.1) :
 *  - latence de décrochage  < 2 s
 *  - latence en conversation < 1,2 s
 *  - annonce du caractère automatique systématique dès le décroché
 */

export type Urgency = "low" | "normal" | "high" | "critical";

/** Fiche structurée extraite d'un appel (alimente calls.extraction — SPEC §7). */
export interface CallExtraction {
  customerName?: string;
  address?: string;
  floor?: string;
  accessCode?: string;
  request?: string;
  urgency: Urgency;
  proposedSlotStartsAt?: string; // ISO 8601
}

export interface TranscriptTurn {
  role: "caller" | "agent";
  text: string;
  at: string; // ISO 8601
}

export interface CallResult {
  providerCallId: string;
  transcript: TranscriptTurn[];
  extraction: CallExtraction;
  recordingUrl?: string;
  durationSeconds: number;
  costCents: number; // coût mesuré réel — SPEC §5.4 (à instrumenter dès J1)
}

/** Contexte passé au runtime au décroché (réglages agent + historique client). */
export interface AnswerContext {
  announcedName: string; // ex. « Plomberie Vasseur, bonsoir »
  trade: string;
  knownCustomer?: { fullName: string; lastInterventionSummary?: string };
}

export interface VoiceRuntime {
  /** Décroche un appel entrant et pilote la qualification (SPEC §5.2). */
  answer(providerCallId: string, context: AnswerContext): Promise<CallResult>;
}

class NoopVoiceRuntime implements VoiceRuntime {
  async answer(providerCallId: string): Promise<CallResult> {
    console.warn("[voice:noop] answer");
    return {
      providerCallId,
      transcript: [],
      extraction: { urgency: "normal" },
      durationSeconds: 0,
      costCents: 0,
    };
  }
}

let instance: VoiceRuntime | null = null;

export function getVoiceRuntime(): VoiceRuntime {
  if (instance) return instance;
  switch (process.env.VOICE_RUNTIME) {
    // case "retell": instance = new RetellVoiceRuntime(); break;
    default:
      instance = new NoopVoiceRuntime();
  }
  return instance;
}
