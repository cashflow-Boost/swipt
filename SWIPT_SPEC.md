# SWIPT — Spécification de développement

> **À qui s'adresse ce document.** À Claude Code, ou à tout développeur reprenant le projet.
> Il contient tout ce qui est nécessaire pour construire l'application sans revenir poser de questions.
> **Version 1.0 — 23 juillet 2026.**

---

## 0. Comment utiliser ce document

- **Ne pas inventer de valeurs.** Toutes les couleurs, tous les prix, tous les volumes sont fixés ici. S'ils ne sont pas ici, demander avant de choisir.
- **Ne pas ajouter de fonctionnalité hors périmètre.** La section 11 liste ce qui est explicitement refusé.
- **Respecter l'ordre de construction** de la section 12. Le journal d'appels avant le tableau de bord, pas l'inverse.
- Les valeurs marquées `[À DÉFINIR]` bloquent la mise en production mais pas le développement.

---

## 1. Le produit en une page

**SWIPT** est un standard téléphonique automatique pour artisans du dépannage, doublé d'un outil de devis-facture.

Le téléphone de l'artisan sonne normalement. S'il ne décroche pas au bout de 4 sonneries, l'appel bascule sur un agent vocal IA qui :
1. annonce le nom de l'entreprise et le fait qu'il s'agit d'un accueil automatique,
2. qualifie la demande (nature de la panne, urgence, adresse, étage, code),
3. propose et pose un rendez-vous dans l'agenda,
4. confirme au client par SMS et envoie un résumé à l'artisan,
5. prépare un devis chiffré depuis la bibliothèque de prix,
6. après validation et signature, émet la facture au format Factur-X,
7. relance les devis dormants et les factures impayées.

**Promesse commerciale :** « Vous êtes sur le chantier. Vos clients ne restent jamais sans réponse. »

**Cible :** plomberie, chauffage, climatisation, électricité, serrurerie, vitrerie, couverture, débouchage, volets et portails, menuiserie, ramonage. Entreprises de 1 à 10 personnes, France.

**Ce qui différencie :** les concurrents vocaux s'arrêtent au rendez-vous ; les logiciels de devis commencent au devis. SWIPT couvre la chaîne entière, donc **zéro ressaisie**. C'est le seul argument produit qui compte.

---

## 2. Stack technique

| Couche | Choix | Note |
|---|---|---|
| Front | Next.js (App Router) + React + TypeScript | |
| Style | Tailwind CSS, tokens de la section 3 | Pas de librairie de composants imposée |
| Base | Supabase (Postgres + Auth + Storage + RLS) | RLS obligatoire dès le premier jour |
| Hébergement | Vercel | Région `cdg1` (Paris) |
| Paiement | Stripe Billing, abonnements + facturation à l'usage | |
| IA texte | API Claude — qualification, rédaction devis, relances | |
| IA voix | Runtime temps réel `Retell AI` (téléphonie + LLM tout-en-un) | Doit rester derrière une abstraction, voir §2.1 |
| Téléphonie | `[À DÉFINIR : Twilio ou opérateur FR]` | Numéros FR, renvoi conditionnel |
| SMS | Même fournisseur que la téléphonie si possible | |
| Facturation électronique | Plateforme Agréée, `[À DÉFINIR : en propre ou adossement type Iopole]` | Bloquant production |

### 2.1 Règle d'architecture non négociable

> **Aucun fournisseur ne doit détenir la relation client ni la donnée métier.**

La téléphonie et le runtime vocal sont facturés à l'usage : c'est accepté. En revanche ils doivent être encapsulés derrière une interface interne (`lib/telephony/provider.ts`, `lib/voice/runtime.ts`) pour être remplaçables sans réécriture. Aucun appel direct au SDK d'un fournisseur ailleurs que dans ces modules.

---

## 3. Code couleur et design tokens

Valeurs échantillonnées au pixel dans le logo, puis vérifiées au contraste WCAG. **Ne pas les modifier à l'œil.**

### 3.1 Couleurs

```css
:root{
  /* Base — mode clair (par défaut) */
  --w:      #FFFFFF;  /* fond principal */
  --w2:     #FAFAF8;  /* fond de section alternée */
  --w3:     #F4F3F0;  /* surfaces internes, bulles client */

  --ink:    #111113;  /* texte principal, boutons pleins  — 18,9:1 sur blanc */
  --soft:   #6A6660;  /* texte secondaire                 —  5,7:1 sur blanc */
  --faint:  #98948C;  /* légendes, méta                   — usage non essentiel */

  --line:   #E9E7E2;  /* bordures */
  --line2:  #DDDAD3;  /* bordures accentuées */

  /* Marque */
  --or:      #F35B0F;  /* orange du logo — APLATS SEULEMENT */
  --or-t:    #B33A06;  /* orange pour TEXTE sur clair — 5,96:1 */
  --or-2:    #F76A20;  /* orange pour texte sur fond sombre — 5,95:1 */
  --or-wash: #FFF4EC;  /* fond teinté */
  --or-line: #FBDDC9;  /* bordure teintée */

  /* Sémantiques */
  --gr:      #1F7A3D;  --gr-wash: #F0F7F2;  /* succès, payé */
  --rd:      #B3261E;  --rd-wash: #FDF2F1;  /* retard, perte, alerte */

  /* Mode sombre (écrans secondaires, calculateur) */
  --bg: #0E0E0F;  --bg2: #151517;  --card: #1A1A1D;
  --d-line: #26262A;  --d-line2: #33333A;
  --d-txt: #F2F0EB;   --d-dim: #9A968D;  --d-faint: #6E6A63;
}
```

### 3.2 Les trois règles d'usage de l'orange

1. **`--or` (#F35B0F) ne porte jamais de texte sur fond clair.** Il plafonne à 2,77:1, échec WCAG à tous les niveaux. Il sert aux aplats : boutons, chevrons, badges, jauges, points d'état.
2. **Le texte sur un bouton orange est `--ink`, jamais blanc.** Blanc sur orange = 3,33:1 (insuffisant) ; encre sur orange = 5,67:1.
3. **L'orange ne marque que ce qui avance ou ce qui demande une action.** Dès qu'il décore, il cesse d'être un signal. Sur un écran, une à trois occurrences maximum.

### 3.3 Typographie

| Usage | Police | Graisse | Réglage |
|---|---|---|---|
| Interface, texte | **Inter** | 450 courant, 500–550 accentué, 600–650 titres | `letter-spacing: -.028em` sur les titres |
| Chiffres, codes, libellés techniques | **IBM Plex Mono** | 400–500 | `letter-spacing: .12em` + majuscules pour les libellés |
| Titres marketing | Inter 650 | | `letter-spacing: -.035em` |

Corps de texte 15–16 px dans l'app, 16–17 px sur le site. Interligne 1,55 dans l'app, 1,6 sur le site.

### 3.4 Formes et ombres

```css
--radius-sm: 7px;    /* petits contrôles */
--radius:    11px;   /* cartes, listes */
--radius-lg: 14px;   /* fenêtres, panneaux principaux */
--radius-pill: 100px;/* boutons, badges, onglets */

--sh:  0 1px 2px rgba(17,17,19,.05);
--sh2: 0 1px 2px rgba(17,17,19,.04), 0 10px 28px -10px rgba(17,17,19,.12);
--sh3: 0 2px 4px rgba(17,17,19,.04), 0 24px 56px -16px rgba(17,17,19,.14);
```

Boutons en pilule. Cartes à `--radius`. Élévation au survol : `translateY(-1px)` + passage de `--sh` à `--sh2`, transition `.25s cubic-bezier(.25,.6,.25,1)`.

### 3.5 Mouvement

- Transitions courtes : 200–300 ms. Aucune animation d'apparition différée au chargement — **tout doit être visible immédiatement**.
- `@media (prefers-reduced-motion: reduce)` doit neutraliser toutes les transitions et animations.
- Pas de 3D, pas de parallaxe, pas de sections épinglées au défilement. Cible : téléphone de chantier en 4G.

### 3.6 Accessibilité

- Contraste minimum 4,5:1 pour tout texte porteur de sens.
- `:focus-visible` visible partout : `outline: 2px solid var(--or); outline-offset: 3px`.
- Toute information portée par la couleur doit l'être aussi par le texte (ex. « En retard » écrit, pas seulement rouge).
- Cibles tactiles ≥ 44 px.

---

## 4. Modules de l'application

Huit écrans. Ordre de construction en §12.

### 4.1 Journal des appels — `/appels` ⭐ module critique

Le plus important de l'application. Les deux premières semaines l'artisan relit tout ; s'il peut corriger et constater l'amélioration, il reste.

- Liste des appels : heure, numéro, durée, statut (`traité` / `transféré` / `hors zone` / `écarté`), résumé en une ligne.
- Détail d'un appel : **transcription intégrale** en bulles, lecteur audio de l'enregistrement, et à côté la fiche extraite (client, adresse, demande, urgence, rendez-vous, devis préparé).
- Action **« Corriger la fiche »** : modifie les données extraites, et si le rendez-vous change, envoie un SMS de correction au client.
- Filtres par statut et par date. Export CSV.

### 4.2 Agenda — `/agenda`

- Vues jour et semaine. **Mobile d'abord** : consulté en camionnette.
- Distinction visuelle obligatoire : rendez-vous posés par SWIPT (fond `--or-wash`, bordure `--or-line`) vs posés par l'artisan (fond `--w3`, bordure `--line2`).
- **Un créneau bloqué par l'artisan est intouchable par l'agent.**
- Action « Bloquer un créneau ».
- Contraintes respectées par l'agent lors de la prise de rendez-vous : zone d'intervention, horaires, temps de trajet estimé, créneaux déjà occupés.

### 4.3 Devis — `/devis`

Trois files, dans cet ordre visuel :
1. **À valider** — chiffrés par l'IA, en attente de l'artisan. File mise en avant (fond `--or-wash`). Compteur dans la navigation.
2. **Envoyés** — en attente de signature, avec indication des relances déjà parties.
3. **Signés** — prêts à facturer ou déjà facturés.

Fonctions : édition ligne à ligne au doigt, TVA par ligne (20 % / 10 % / 5,5 %), génération de l'attestation de TVA à taux réduit, envoi par SMS et e-mail, signature électronique, conversion en facture en un clic.

**Objectif de performance produit : validation d'un devis en moins de 30 secondes sur mobile.**

### 4.4 Factures — `/factures`

- États : `émise` / `payée` / `en retard`.
- Découle du devis signé, aucune ressaisie.
- Format **Factur-X** via Plateforme Agréée. Contrôle automatique des mentions obligatoires.
- Export comptable (CSV + lot de PDF/Factur-X).

### 4.5 Relances — `/relances`

- Règles configurables : devis sans réponse à J+5 puis J+12 (2 maximum) ; facture à échéance puis J+7 et J+15 (le 3ᵉ envoi requiert validation de l'artisan).
- Historique des relances envoyées et de leur issue.
- **Afficher le montant récupéré grâce aux relances.** C'est le chiffre qui fait renouveler l'abonnement.

### 4.6 Clients — `/clients`

- Fiche : coordonnées, adresse, historique d'interventions, chiffre d'affaires, comportement de paiement.
- **L'agent vocal consulte cet historique pendant l'appel** pour reconnaître un habitué.
- Signaler les interventions répétées au même endroit (indice de problème non résolu).

### 4.7 Tableau de bord — `/tableau-de-bord`

Quatre indicateurs, pas plus :
1. Appels traités aujourd'hui
2. Rendez-vous posés
3. **Devis qui attendent l'artisan** (seul chiffre en `--or-t`, seule action requise)
4. Argent qui dort (devis sans réponse + factures en retard)

Suivi d'un fil des derniers événements.

### 4.8 Réglages de l'agent — `/reglages`

C'est ce qui transforme un service générique en *son* standard.

| Réglage | Exemple |
|---|---|
| Nom annoncé | « Plomberie Vasseur, bonsoir » |
| Métier | Plomberie et chauffage → détermine le questionnement |
| Zone d'intervention | Ville + rayon en km |
| Horaires de rendez-vous | Lu–ve 8 h–18 h, sa 9 h–12 h |
| Déclenchement | Après N sonneries (défaut 4) |
| Forfait de déplacement | 45 € TTC, annoncé pendant l'appel |
| Bibliothèque de prix | Ouvrages et tarifs |
| Urgences à transférer | Fuite active, coupure totale, personne bloquée, odeur de gaz |
| Ce que l'agent refuse | Démarchage, hors zone, hors métier, négociation |

### 4.9 Élément global

Bouton **« Je reprends la main »** visible en permanence dans l'en-tête. Coupe le renvoi immédiatement. Sa présence visible est ce qui rend l'artisan prêt à confier ses appels.

---

## 5. Agent vocal — spécification

### 5.1 Exigences dures

| Exigence | Valeur | Conséquence si non tenue |
|---|---|---|
| Latence de décrochage | **< 2 s** | Le client raccroche, l'argumentaire s'effondre |
| Latence de réponse en conversation | < 1,2 s | Sensation de robot, perte de confiance |
| Langue | Français uniquement en V1 | Sinon transfert |
| Annonce du caractère automatique | **Systématique, dès le décroché** | Obligation d'information + choix produit |
| Transfert humain | À la demande, ou si incompréhension, ou si urgence critique | Jamais d'impasse |

### 5.2 Déroulé de qualification

1. Annonce : nom de l'entreprise + accueil automatique.
2. Reconnaissance du numéro → si client connu, mention de l'historique.
3. Nature du problème, en vocabulaire métier.
4. **Détermination de l'urgence** → si critique, alerte immédiate + proposition de transfert.
5. Adresse, étage, code d'accès, digicode.
6. Vérification de la zone d'intervention → si hors zone, refus poli et explicite.
7. Proposition de créneau selon l'agenda réel.
8. Annonce du forfait de déplacement et d'une fourchette de prix.
9. Confirmation, coordonnées, fin d'appel.
10. Post-traitement : fiche, SMS client, résumé artisan, devis préparé.

### 5.3 Cas limites à traiter explicitement

Démarchage commercial · numéro masqué · appelant agressif · demande hors métier · hors zone · client qui exige un prix ferme · client qui demande à parler à un humain · urgence vitale (odeur de gaz, personne en danger) · appel muet ou coupé.

### 5.4 Coût

Estimation retenue : **0,36 € par appel de 2 minutes** (télécom ≈ 0,02 € + voix temps réel ≈ 0,17 €/min).

> ⚠️ **Cette valeur n'a jamais été mesurée.** Instrumenter le coût réel par appel dès le premier jour et remonter la mesure sur les 50 premiers appels. À 0,60 €, la formule Solo tombe à 48 % de marge et toute la grille est à refaire.

---

## 6. Règles métier et tarification

### 6.1 Grille

| Formule | Prix HT/mois | Appels inclus | Coût variable | Marge brute |
|---|---|---|---|---|
| Solo | 149 € | 130 | 47 € | 69 % |
| Équipe | 299 € | 260 | 94 € | 69 % |
| Pro | 549 € | 480 | 173 € | 69 % |
| Dépassement | **0,79 €/appel** | — | 0,36 € | 54 % |

**Règles :**
- Le volume compte **uniquement les appels traités par SWIPT**, pas ceux décrochés par l'artisan.
- Dépassement facturé le mois suivant. **Le service ne se coupe jamais.**
- Si dépassement 2 mois consécutifs → proposer la formule supérieure automatiquement.
- Facturation annuelle : **2 mois offerts**. Le total annuel (prix mensuel × 10) fait foi ; l'équivalent mensuel s'affiche avec ses décimales, jamais arrondi.
- Essai 14 jours, sans carte bancaire. Résiliation en ligne, effet immédiat, sans préavis.
- Export des données pendant 6 mois après résiliation.

### 6.2 Calculateur d'appels manqués (page publique)

```
appelsMensuels = appelsManquesParJour × 22
chantiersPerdus = appelsMensuels × (tauxSur10 / 10)
perteMensuelle  = chantiersPerdus × ticketMoyen

formule = premier palier dont (appelsInclus ≥ appelsMensuels), sinon Pro
depassement = max(0, appelsMensuels − formule.appelsInclus)
coutMensuel = formule.prix + depassement × 0.79

netRecupere = max(0, perteMensuelle × 0.70 − coutMensuel)
interventionsPourRembourser = ceil(coutMensuel / ticketMoyen)
```

Bornes des curseurs : appels 1→12, ticket 100→600 (pas de 10), taux 1→5 sur 10.
Constantes : **22** jours ouvrés, **0,70** taux de récupération, **0,79 €** dépassement.

**Le détail du calcul doit être affiché ligne par ligne.** Un chiffre sans démonstration est perçu comme faux.

---

## 7. Schéma Supabase (base)

```sql
-- Multi-tenant : une entreprise artisanale = une organisation
organizations(id, name, siren, trade, phone_number, plan, plan_calls_included,
              trial_ends_at, stripe_customer_id, stripe_subscription_id, created_at)

users(id, org_id, email, full_name, role)  -- role: owner | member

agent_settings(org_id PK, announced_name, trade, zone_center, zone_radius_km,
               business_hours jsonb, ring_count, callout_fee_cents,
               urgent_triggers jsonb, refusal_rules jsonb, updated_at)

customers(id, org_id, phone, full_name, address, floor, access_code,
          notes, first_seen_at, created_at)

calls(id, org_id, customer_id, started_at, duration_seconds, direction,
      status,              -- handled | transferred | out_of_zone | discarded
      recording_url, transcript jsonb, extraction jsonb,
      urgency,             -- low | normal | high | critical
      cost_cents, counted_in_quota bool, corrected_by, corrected_at)

appointments(id, org_id, customer_id, call_id, starts_at, ends_at,
             source,       -- agent | manual
             locked bool, status, notes)

price_items(id, org_id, label, unit, unit_price_cents, vat_rate, trade_category)

quotes(id, org_id, customer_id, call_id, number, status,  -- draft|to_validate|sent|signed|expired
       lines jsonb, total_ht_cents, total_ttc_cents, vat_breakdown jsonb,
       sent_at, signed_at, signature_data)

invoices(id, org_id, quote_id, number, status,            -- issued|paid|overdue
         due_date, total_ttc_cents, facturx_url, paid_at)

reminders(id, org_id, target_type, target_id, rule, sequence_index,
          sent_at, outcome)                                -- pending|converted|no_reply

usage_counters(org_id, period_start, calls_handled, overage_calls, computed_at)
```

**RLS obligatoire** sur toutes les tables : `org_id = auth.jwt() -> org_id`. Aucune exception, y compris sur les tables de lecture.

---

## 8. Conformité

| Sujet | Exigence |
|---|---|
| Facturation électronique | Émission et réception Factur-X via **Plateforme Agréée** (PA). Réception obligatoire pour toutes les entreprises au **1ᵉʳ septembre 2026**. Vocabulaire à jour : PA (ex-PDP) et SC (ex-OD). |
| TVA bâtiment | 20 % neuf · 10 % rénovation · 5,5 % amélioration énergétique. Application **ligne par ligne**, pas globale. Génération automatique des attestations de taux réduit. |
| Mentions obligatoires | Contrôle automatique sur devis et factures avant envoi. |
| RGPD | Hébergement France/UE. Information de l'appelant en début d'appel. Conservation des enregistrements **12 mois** puis suppression. Export et effacement à la demande. DPA avec chaque sous-traitant, dont Anthropic. |
| Information IA | L'agent annonce son caractère automatique au décroché et ne prétend jamais être humain. |
| Publicité comparative | Toute comparaison nominative doit être objective, vérifiable et non dénigrante. Validation juridique avant mise en ligne. |

---

## 9. Site public

Trois pages, toutes construites, à brancher :

| Page | Rôle |
|---|---|
| Accueil (`SWIPT_Site_Premium.html`) | Présentation du service, mode clair premium. Titre : « Vous êtes sur le chantier. Vos clients ne restent jamais sans réponse. » |
| Calculateur (`SWIPT_Calculateur.html`) | Manque à gagner des appels manqués → recommandation de formule. |
| Maquette app (`SWIPT_Application_Maquette.html`) | Référence visuelle des 8 écrans pour le développement. |

**Les trois contiennent des champs surlignés à compléter** : téléphone, raison sociale, SIREN, RCS, TVA, adresse. Ne pas mettre en ligne avant.

**Section « avis clients » : laisser vide tant qu'il n'y a pas de vrais clients.** Aucun témoignage fabriqué, aucun logo emprunté, aucun « déjà N artisans ». C'est un choix de positionnement, pas un oubli.

---

## 10. Éléments bloquants avant production

| # | Blocage | Type |
|---|---|---|
| 1 | **Validation terrain : 10 appels à des artisans** — combien d'appels ratés par jour, ticket moyen, temps passé sur les devis | Marché |
| 2 | Immatriculation de la société, SIREN, adresse | Juridique |
| 3 | Ligne téléphonique réelle, décrochée | Commercial |
| 4 | Vérification du nom SWIPT : `annuaire-entreprises.data.gouv.fr`, puis INPI classes 9 et 42, puis domaines. **Risque phonétique avec SWIFT et Swile.** | Juridique |
| 5 | **Bibliothèque de prix préremplie** par métier — non résolu. Un outil de devis vide n'est jamais adopté (référence : Obat, 30 000 ouvrages) | Produit |
| 6 | Voie Plateforme Agréée : en propre ou adossement | Réglementaire |
| 7 | Mesure réelle du coût par appel | Économique |
| 8 | CGV, mentions légales, politique de confidentialité, DPA | Juridique |
| 9 | Arbitrage de la capacité de développement | Organisation |

---

## 11. Hors périmètre — à refuser explicitement

**Fonctionnalités :** gestion de stock · pointage et RH · achats fournisseurs · comptabilité complète · marketplace de mise en relation · CRM commercial avancé · compte bancaire · outils de communication ou de site vitrine client.

**Décisions déjà tranchées, à ne pas rouvrir sans donnée nouvelle et sourcée :**
- Pas de positionnement « employés IA » ni de plateforme horizontale (catégorie saturée).
- Pas de production comptable (Pennylane : 115 M€ ARR, 3,5 Md€ de valorisation).
- Pas de devis-facture vendu comme produit principal (Costructor gratuit, Tolteck 19 €).
- Pas de deuxième verticale commercialisée avant 20 clients payants. Le moteur doit toutefois être conçu pour en accueillir une sans réécriture.

---

## 12. Ordre de construction

**Phase 0 — Fondations (semaine 1)**
Next.js + Supabase + auth + RLS multi-tenant · design tokens de la §3 · abstractions téléphonie et voix (§2.1) · schéma de base.

**Phase 1 — Le cœur (semaines 2–4)**
1. `agent_settings` et écran Réglages — rien ne fonctionne sans configuration.
2. Runtime vocal : décrochage, qualification, extraction.
3. **Journal des appels** avec transcription et correction.
4. Agenda et prise de rendez-vous par l'agent.
5. SMS de confirmation client + résumé artisan.

**Phase 2 — La chaîne argent (semaines 5–7)**
6. Bibliothèque de prix + Devis (les 3 files, TVA par ligne).
7. Signature électronique.
8. Factures + Factur-X.
9. Relances automatiques.

**Phase 3 — Le liant (semaine 8)**
10. Clients et historique + branchement sur l'agent vocal.
11. Tableau de bord.
12. Stripe : abonnements, essai 14 jours, comptage d'usage et dépassement.

**Phase 4 — Mise en service**
Site public branché · onboarding en 1 heure · instrumentation du coût par appel · **bouton « Je reprends la main » testé de bout en bout**.

---

## 13. Définition de « terminé »

Une fonctionnalité est terminée quand :

- [ ] Elle fonctionne sur un téléphone, en 4G, à une main.
- [ ] Le contraste de tous ses textes est ≥ 4,5:1.
- [ ] Aucune information n'est portée par la seule couleur.
- [ ] `prefers-reduced-motion` est respecté.
- [ ] La RLS empêche tout accès inter-organisation (testé, pas supposé).
- [ ] Les montants sont en centimes entiers en base, jamais en flottants.
- [ ] Les erreurs des fournisseurs externes sont rattrapées et n'exposent jamais l'artisan à un appel perdu en silence.
- [ ] Rien n'apparaît avec un délai : tout est visible au chargement.

---

## 14. Sources des données citées

Vérifications effectuées les 22 et 23 juillet 2026.

- **Avoca** (modèle US, 1 Md$, 800+ clients) : serviceagent.ai, siliconreport.com, contractortoolstack.com, goodmunity.com.
- **Concurrence vocale FR** : monstandard.ai, eliocall.com, airagent.fr, leadflow-ai.fr, tensoria.fr, nerolia-ai.fr, sos-assistant-numerique.fr.
- **Devis-facture FR** : vox-bati.com, batemark.com, blog.tiime.fr, artisansmart.fr, independant.io.
- **Douleurs terrain** : ARTIBAT 2025, CAPEB — 68 % contactent 3 artisans, 57 % signent avec celui qui rappelle sous 2 h, 12 h/semaine de tâches non facturables, 63 % des entreprises artisanales du bâtiment sans salarié.
- **Réglementation** : DGFiP (renommage PDP→PA et OD→SC depuis juillet 2025), échéance du 1ᵉʳ septembre 2026.

> ⚠️ Plusieurs de ces sources sont des comparatifs édités par des acteurs du marché, donc juges et parties. **Recouper auprès des sources primaires — CAPEB, FFB, DGFiP, INSEE — avant tout usage devant un investisseur ou un client.**
