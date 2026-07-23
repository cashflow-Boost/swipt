# SWIPT — application (`web/`)

Standard téléphonique intelligent des artisans du dépannage. Application
Next.js. La spécification de référence est `../SWIPT_SPEC.md`.

## État — Phase 0 (fondations)

Conformément à l'ordre de construction (SPEC §12), cette phase pose :

- **Next.js 16** (App Router, TypeScript, Tailwind v4).
- **Tokens de conception** (`app/globals.css`) — palette, formes et ombres de
  la SPEC §3, exposés aux utilitaires Tailwind (`bg-w`, `text-ink`, `text-or-t`…).
- **Polices auto-hébergées** (Inter + IBM Plex Mono via `next/font`) — aucune
  requête runtime vers Google (SPEC §8, RGPD).
- **Abstractions fournisseurs** (SPEC §2.1, non négociable) :
  `lib/telephony/provider.ts` et `lib/voice/runtime.ts`. Aucun SDK de
  fournisseur ne doit être appelé hors de ces modules.
- **Supabase** : clients navigateur/serveur (`lib/supabase/`), rafraîchissement
  de session dans `proxy.ts` (ex-middleware, renommé en Next.js 16).
- **Schéma multi-tenant + RLS** : `supabase/migrations/0001_init.sql`. RLS
  activée sur **toutes** les tables (SPEC §7), montants en **centimes entiers**
  (SPEC §13, helpers dans `lib/money.ts`).

Prochaines étapes : Phase 1 — Réglages de l'agent, runtime vocal, puis le
**Journal des appels** (module critique, SPEC §4.1).

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner l'URL et la clé anon Supabase
npm run dev                  # http://localhost:3000
```

Appliquer la migration sur votre projet Supabase (SQL editor, ou CLI
`supabase db push`) avant d'utiliser l'authentification et les données.

> Le claim JWT `org_id` (SPEC §7) s'alimente via un *Custom Access Token Hook*
> Supabase. En son absence, `public.current_org_id()` se rabat sur la table
> `users`.

## Scripts

- `npm run dev` — développement
- `npm run build` — build de production
- `npm run lint` — ESLint
