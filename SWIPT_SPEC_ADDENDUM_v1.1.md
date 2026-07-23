# SWIPT — Addendum v1.1 à la spécification

> **À lire avec `SWIPT_SPEC.md` (v1.0), qu'il complète et corrige.**
> En cas de contradiction, **ce document fait foi**.
> Date : 23 juillet 2026.

---

## 1. Ce qui a changé, en une page

| # | Sujet | Décision |
|---|---|---|
| 1 | Positionnement | On ne vend plus un logiciel, on vend **un poste** : l'assistante de gestion que l'artisan n'a jamais pu embaucher |
| 2 | Prix | **On ne baisse pas à 99 €.** On garde 149 € jusqu'aux premiers entretiens terrain |
| 3 | Fonctionnalité nouvelle V1.5 | **Appels sortants** : relance vocale des devis dormants et remplissage des créneaux vides |
| 4 | Fonctionnalité nouvelle V2 | **Assistant vocal interne** : l'artisan pilote son application à la voix |
| 5 | Contrainte d'architecture | Toute action doit être une **fonction appelable**, séparée de l'interface — condition pour le point 4 |
| 6 | Concurrence | Nouvelle carte en 4 couches, et identification de la vraie menace : **Obat** |
| 7 | Interdiction ajoutée | Pas de déclaration fiscale — profession réglementée |

---

## 2. Positionnement — remplace la §1 de la spec

### 2.1 Ce qu'on vend

> **« Le poste que vous n'avez jamais pu embaucher. »**

SWIPT n'est pas un logiciel de gestion avec une IA vocale. C'est **une assistante de gestion**, pour une entreprise artisanale de 1 à 10 personnes qui ne peut pas se payer un mi-temps administratif.

**Slogan de page d'accueil (retenu, ne pas modifier) :**
> *Vous êtes sur le chantier. Vos clients ne restent jamais sans réponse.*

### 2.2 Le périmètre du poste — fermé, à ne pas élargir

Ce que fait une assistante de gestion, et donc SWIPT :

1. Répondre au téléphone, qualifier, poser les rendez-vous
2. Tenir l'agenda
3. Établir et envoyer les devis
4. Facturer
5. Relancer les impayés et les devis sans réponse
6. **Rappeler les clients quand la journée a un trou** (nouveau, voir §4)
7. Préparer le dossier pour l'expert-comptable — pièces classées, TVA préparée
8. Sortir les attestations sur demande client : décennale, RGE, Kbis, URSSAF

### 2.3 Ce qui est explicitement exclu

- **Déclaration fiscale et tenue de comptabilité.** L'expertise comptable est une profession réglementée en France depuis 1945 ; l'exercice illégal est pénalement sanctionné. SWIPT **prépare et transmet** à l'expert-comptable, il ne déclare pas.
- Diagnostic technique à distance.
- Tout ce qui figure déjà en §11 de la spec v1.0 : stock, paie, achats fournisseurs, marketplace.

### 2.4 Conséquence sur l'argumentaire

Le référentiel de comparaison n'est plus « les autres logiciels » mais **le coût d'un poste** : une assistante de gestion à mi-temps coûte 1 100 à 1 400 € par mois chargés. Toute la page d'accueil et tout l'argumentaire commercial doivent ancrer là.

---

## 3. Tarification — remplace la §6.1 de la spec

### 3.1 Décision

**On conserve la grille v1.0 : 149 € / 299 € / 549 €.**

La baisse à 99 € a été étudiée et **rejetée** pour l'instant. Raisons à conserver au dossier :

- 99 € est la pire zone : trop cher face à Costructor (gratuit) et ChantierFlow (22,50 €), trop bon marché pour être crédible en tant que poste.
- Aucune donnée terrain ne justifie la baisse : zéro artisan interrogé à ce jour.
- Une baisse ne se rattrape pas ; une remise de lancement, si.
- Le frein réel n'est pas le prix, c'est « est-ce que je laisse une machine parler à mes clients ». Un prix bas peut même aggraver ce doute.

### 3.2 Si un palier d'entrée à 99 € est décidé plus tard

Il ne peut exister que **bridé**, et uniquement comme marche vers l'offre supérieure :

| Formule | Prix HT | Appels inclus | COGS @0,36 € | Marge |
|---|---|---|---|---|
| Essentiel *(optionnel)* | 99 € | **85** | 31 € | 69 % |
| Solo | 149 € | 130 | 47 € | 69 % |
| Équipe | 299 € | 260 | 94 € | 69 % |
| Pro | 549 € | 480 | 173 € | 69 % |

> ⚠️ **Ne jamais mettre 130 appels dans une offre à 99 €** : la marge tombe à 53 %.
> 85 appels ≈ 4 appels manqués par jour, profil d'un artisan seul.

Le palier Essentiel exclut : relance automatique, planning partagé, appels sortants.

---

## 4. Nouvelle fonctionnalité — Appels sortants (V1.5)

> **C'est la principale différenciation face à Jobber.** Leur AI Receptionist est **entrant uniquement**. Personne ne fait de sortant sur le marché français.

### 4.1 Trois cas d'usage

| Déclencheur | Action |
|---|---|
| Devis sans réponse à J+7 | Appel vocal de relance, courtois, propose de répondre aux questions ou d'ajuster |
| Créneau vide détecté dans l'agenda (≥ 2 h libres à moins de 48 h) | Rappelle les devis en attente géographiquement proches pour combler |
| Facture impayée à J+15 | Appel de rappel — **validation de l'artisan obligatoire avant lancement** |

### 4.2 Règles dures

- **Aucun appel sortant sans règle activée explicitement par l'artisan.**
- Plafond quotidien configurable, par défaut 5 appels sortants par jour.
- Horaires stricts : jamais avant 9 h, jamais après 19 h, jamais le dimanche.
- Respect de Bloctel et de toute opposition exprimée par le client.
- L'appel s'annonce comme automatique, comme en entrant.
- Journalisé dans le module Appels au même titre que les entrants, avec transcription.
- **Compté dans le quota d'appels** de la formule.

---

## 5. Nouvelle fonctionnalité — Assistant vocal interne (V2)

L'artisan commande son application à la voix, en appelant son propre numéro ou depuis un bouton de l'app.

### 5.1 Deux modes

**Sur demande** — il parle, l'assistant exécute :
> « Sors-moi la facture de Mme Réaux »
> « C'est quoi mon planning de jeudi ? »
> « Envoie l'attestation décennale à Ferreira »
> « Le devis Lopes, passe-le à 180 »

**Proactif** — l'assistant signale, dans le résumé de fin de journée :
> « Trois devis dorment depuis dix jours, je les relance ? »
> « Tu as un trou jeudi après-midi, je rappelle les devis en attente ? »
> « Mme Réaux, troisième fuite au même endroit — probablement la colonne »
> « Il te manque deux factures fournisseur pour la TVA du trimestre »

### 5.2 Limites dures

- Agit **uniquement** sur les données présentes dans SWIPT, avec les droits de l'utilisateur connecté.
- Aucune navigation web, aucune commande fournisseur, aucun envoi à un client sans confirmation explicite.
- Toute action modifiante est confirmée oralement avant exécution et journalisée.
- **Ne jamais implémenter un chat texte « demandez-moi n'importe quoi ».** L'artisan n'écrit pas, et un assistant sans périmètre n'a aucune valeur à l'ouverture.

---

## 6. Contrainte d'architecture — À APPLIQUER DÈS LA V1

> **Cette contrainte ne coûte rien maintenant et vaut six mois de travail plus tard.**

Toute action métier doit être exposée comme une **fonction appelable**, dans une couche séparée de l'interface :

```
lib/actions/
  quotes.ts      → createQuote, updateQuoteLine, sendQuote, convertToInvoice
  appointments.ts→ createAppointment, moveAppointment, blockSlot
  customers.ts   → getCustomer, getHistory, sendDocument
  invoices.ts    → issueInvoice, markPaid, sendReminder
  calls.ts       → getCall, correctExtraction
```

Règles :
- Aucune logique métier dans un composant React ou une route d'API. Les routes et l'interface **appellent** ces fonctions, elles ne les contiennent pas.
- Chaque fonction est typée, validée (Zod), et journalisée.
- Chaque fonction porte une description exploitable en *tool calling* par l'API Claude.

Conséquence : la commande vocale de la §5 devient un branchement de trois semaines au lieu d'un chantier de six mois.

---

## 7. Concurrence — remplace et complète la §14 de la spec

### 7.1 Référence produit à étudier : Jobber

**Jobber est le meilleur cahier des charges gratuit disponible.** Son AI Receptionist, lancé en août 2025, a traité plus de 200 000 conversations. Il répond aux appels et textos 24 h/24, fait correspondre le numéro entrant aux fiches clients, prend les messages, pose les rendez-vous, capte le détail de la demande et relance par SMS ceux qui ont raccroché. 99 $/mois en option, inclus dans le plan Plus à 599 $. Cible : 1 à 15 salariés.

Structure des trois acteurs américains, pour situer :

| Acteur | Taille | Segment | Prix |
|---|---|---|---|
| ServiceTitan | ~10 800 entreprises | 20 techniciens et plus | 250–500 $/technicien/mois + 5 000–50 000 $ d'implémentation |
| Housecall Pro | ~30 000 entreprises | Milieu de marché | — |
| Jobber | ~400 000 professionnels | **1 à 15 salariés — notre segment** | 29–529 $/mois |

**Aucun ne vend en France.** Les paiements Jobber ne fonctionnent qu'aux États-Unis, au Canada et au Royaume-Uni. Barrières à l'entrée en notre faveur : voix en français métier, Factur-X et Plateforme Agréée, TVA bâtiment à trois taux, taille de ticket trop faible pour justifier leur investissement.

### 7.2 Carte française en quatre couches

**Couche devis-facture** — la plus encombrée, prix plancher à zéro
Obat (**21 000+ professionnels, devis vocal IA, prêt septembre 2026**) · Tolteck (30 000 artisans, 19 €, sans signature ni IA en standard) · Costructor (gratuit puis 12,50 €) · ChantierFlow (22,50 € tout compris) · VOX BATI (assistant basé sur Claude d'Anthropic) · Vertuoza (VertuoAI, devis dicté) · Batappli, EBP, Sage, Henrri, Attix, Renalto, Boby, So-Fa, Kryva

**Couche gestion d'interventions** — l'équivalent Jobber
Praxedo (leader FSM français, PME et ETI, briques IA de planification) · Organilog (500+ entreprises, 90 secteurs) · Synchroteam (artisans et PME du BTP) · Yuman, AntsRoute, Ermeo, Kizeo, Twimm, InterFast, Archipad

**Couche agents vocaux** — récente, fragmentée, aucune levée connue
**LeadFlow AI (dès 39 €/mois)** · monstandard.ai · Elio · Airagent · Tensoria · Nerolia · VOCALIS AI (France, Suisse, Belgique — déploiement 48 h) · SOS Assistant Numérique (300 €/mois)

**Couche ERP BTP** — hors cible
Onaya, Mediabat, Extrabat, Codial

### 7.3 Lecture stratégique

**L'espace est réel.** Obat fait du devis *dicté* par l'artisan, pas de l'accueil d'appel entrant. Les vocaux décrochent mais n'ont pas de back-office. Praxedo et Organilog ont le back-office mais visent des équipes de techniciens.

**Il se referme des deux côtés.** Obat n'a qu'un pas à faire de la voix-dictée vers la voix-entrante. Tensoria tente déjà le pontage, mais par intégration à EBP, Sage, Obat et Mediabat — donc en agence, pas en produit, ce qui est fragile.

**La menace principale est Obat**, pas les agences vocales.

**Correction importante :** le plancher de prix de la couche vocale est à **39 €**, pas à 300 € comme indiqué en v1.0. Conséquence directe : les 149 € ne se défendent que par le poste (§2), jamais par la fonction.

---

## 8. Ce qui reste à vérifier

| # | Question | Pourquoi ça change la stratégie |
|---|---|---|
| 1 | Obat a-t-il annoncé un accueil téléphonique entrant ? | Si oui, la fenêtre se referme et le positionnement doit changer |
| 2 | Levées de fonds et traction d'Obat, Praxedo, Organilog | Un acteur autofinancé et un acteur qui vient de lever ne sont pas le même adversaire |
| 3 | Jobber, ServiceTitan ou Housecall Pro ont-ils une feuille de route européenne ? | Non vérifié à ce jour |
| 4 | Un « Jobber français » est-il en préparation ? | Idem |

---

## 9. Rappel — le blocage numéro un n'a pas bougé

> **Zéro artisan interrogé à ce jour.**

Dix appels, trois questions, quatre minutes chacun :
1. Combien d'appels ratez-vous par jour ?
2. Combien vaut une intervention moyenne ?
3. Combien de temps passez-vous sur vos devis, le soir ?

Tant que ce n'est pas fait, le prix, le positionnement et le périmètre de ce document sont des hypothèses argumentées — pas des faits.

---

## 10. Ordre de construction — mise à jour de la §12

Aucun changement pour les phases 0 à 3. Ajouts :

**Phase 1 → ajouter :** mise en place de `lib/actions/` dès le premier module. Non négociable.

**Phase 3.5 — Appels sortants** (après le module Relances)
Règles, plafonds, horaires, Bloctel, journalisation, comptage dans le quota.

**Phase 5 — Assistant vocal interne** (après les 20 premiers clients payants)
Branchement du *tool calling* sur `lib/actions/`, puis mode proactif dans le résumé de fin de journée.
