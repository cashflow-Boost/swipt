import { z } from "zod";

/**
 * Couche « actions » — Addendum v1.1 §6 (à appliquer dès la V1, non négociable).
 *
 * Toute action métier est une fonction appelable, séparée de l'interface :
 *  - typée et validée (Zod) ;
 *  - journalisée ;
 *  - porteuse d'une description exploitable en *tool calling* par l'API Claude,
 *    ce qui rend l'assistant vocal interne (Addendum §5) branchable en V2 sans
 *    réécriture.
 *
 * Aucune logique métier ne doit vivre dans un composant React ou une route
 * d'API : l'interface et les routes APPELLENT ces fonctions.
 */

export type Action<I extends z.ZodTypeAny, O> = ((
  input: z.infer<I>,
) => Promise<O>) & {
  actionName: string;
  description: string;
  inputSchema: I;
};

export interface ActionContext {
  /** Organisation courante (cloisonnement RLS — SPEC §7). */
  orgId: string;
  /** Utilisateur agissant (journalisation, calls.corrected_by…). */
  userId?: string;
}

export function defineAction<I extends z.ZodTypeAny, O>(def: {
  name: string;
  description: string;
  input: I;
  handler: (input: z.infer<I>, ctx: ActionContext) => Promise<O>;
}): Action<I, O> & { withContext: (ctx: ActionContext) => Action<I, O> } {
  const make = (ctx?: ActionContext) => {
    const fn = (async (input: z.infer<I>): Promise<O> => {
      const parsed = def.input.parse(input);
      if (!ctx) {
        throw new Error(
          `Action "${def.name}" appelée sans contexte (orgId). ` +
            `Utiliser action.withContext({ orgId }).`,
        );
      }
      console.info(`[action:${def.name}] org=${ctx.orgId}`, parsed);
      return def.handler(parsed, ctx);
    }) as Action<I, O>;
    return Object.assign(fn, {
      actionName: def.name,
      description: def.description,
      inputSchema: def.input,
    });
  };

  const base = make();
  return Object.assign(base, {
    withContext: (ctx: ActionContext) => make(ctx),
  });
}
