/**
 * Registre des actions métier (Addendum v1.1 §6).
 *
 * Point d'entrée unique. Chaque action est typée, validée et journalisée, et
 * porte une `description` exploitable en *tool calling* par l'API Claude —
 * ce qui rend l'assistant vocal interne (Addendum §5) branchable en V2 sans
 * réécriture : il suffira d'exposer ce registre comme liste d'outils.
 */
import { blockSlot, moveAppointment } from "./appointments";
import { getCall, correctExtraction } from "./calls";
import { getCustomer, getHistory } from "./customers";
import { createQuote, sendQuote } from "./quotes";
import { markPaid, sendReminder } from "./invoices";

export { blockSlot, moveAppointment } from "./appointments";
export { getCall, correctExtraction } from "./calls";
export { getCustomer, getHistory } from "./customers";
export { createQuote, sendQuote } from "./quotes";
export { markPaid, sendReminder } from "./invoices";
export { defineAction } from "./types";
export type { Action, ActionContext } from "./types";

/** Toutes les actions, pour exposition en tool-calling ou introspection. */
export const ACTIONS = [
  blockSlot,
  moveAppointment,
  getCall,
  correctExtraction,
  getCustomer,
  getHistory,
  createQuote,
  sendQuote,
  markPaid,
  sendReminder,
] as const;

/** Métadonnées des actions (nom + description) — base d'une liste d'outils Claude. */
export const actionCatalog = ACTIONS.map((a) => ({
  name: a.actionName,
  description: a.description,
}));
