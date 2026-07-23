# SWIPT — Revue des fichiers livrés

> Revue de conformité des trois maquettes HTML au regard de `SWIPT_SPEC.md`.
> Périmètre : les 4 fichiers présents dans le dépôt. Aucune application Next.js n'est
> encore construite — la revue porte donc sur les livrables statiques (spec + site + calculateur + maquette).
> Date : 23 juillet 2026.

---

## 0. Résumé

Les fichiers sont soignés et **cohérents avec leur propre spécification** : palette, typographie,
formes, formule du calculateur et données de démonstration sont conformes. La règle d'or de l'orange
(« encre sur bouton, jamais blanc ») est respectée partout, et j'ai vérifié les contrastes annoncés
par la spec au calcul — ils sont exacts.

Trois corrections **non ambiguës** exigées par la spec ont été appliquées (détail §2). Le reste
relève de **recommandations** (choix de conception ou données fictives) laissées à votre arbitrage (§3, §4).

| Sévérité | Nombre | Traitement |
|---|---|---|
| Correction appliquée (violation spec claire) | 3 | ✅ corrigé dans ce commit |
| Recommandation contraste/accessibilité | 2 | 📋 documenté, à arbitrer |
| Observation (données / robustesse / dépendances) | 4 | 📋 documenté |

---

## 1. Conformité vérifiée (conforme ✅)

| Point de spec | Vérification | Résultat |
|---|---|---|
| §3.1 Palette | Tokens identiques dans les 3 fichiers | ✅ |
| §3.2 R2 — encre sur bouton orange, jamais blanc | `.btn.or{color:var(--ink)}`, calc `.btn{color:#141414}` | ✅ (encre/orange = 5,67:1 ; blanc/orange = 3,33:1, à raison exclu) |
| §3.2 R1 — orange ne porte pas de texte sur clair | Texte orange utilise `--or-t` (#B33A06, 5,96:1) | ✅ |
| §3.1 Mode sombre pour le calculateur | Calculateur en dark, site + maquette en clair | ✅ |
| §3.6 Focus visible partout | `:focus-visible` défini dans les 3 fichiers | ✅ (offset corrigé, cf §2.3) |
| §6.2 Formule du calculateur | `mc=calls×22`, `jobs=mc×rate/10`, `lost=jobs×ticket`, plan, overage 0,79, net=max(0, lost×0,70−cost), payback=ceil(cost/ticket) | ✅ conforme au pseudo-code |
| §6.2 Bornes des curseurs | appels 1→12, ticket 100→600 (pas 10), taux 1→5 | ✅ |
| §6.2 Détail ligne par ligne affiché | `detail.innerHTML` liste chaque étape | ✅ |
| §9 Champs à compléter surlignés | classe `.ph` sur téléphone / SIREN / RCS / adresse | ✅ |
| §9 Pas de faux avis clients | Aucune section témoignages inventée | ✅ |
| §5 / maquette « Je reprends la main » | Présent dans l'en-tête de la maquette | ✅ |
| Langue + viewport | `lang="fr"`, meta viewport présents | ✅ |

---

## 2. Corrections appliquées dans ce commit ✅

### 2.1 `prefers-reduced-motion` absent du site premium — **corrigé**
La spec l'exige deux fois (§3.5 : « doit neutraliser toutes les transitions et animations » ;
§13 : critère de « terminé »). Le calculateur le respectait, **mais `SWIPT_Site_Premium.html`
n'avait aucun bloc `@media (prefers-reduced-motion: reduce)`** alors qu'il anime plusieurs éléments
(`.btn`, `.pillar:hover`, `.pl:hover` en `translateY`). Ajout du bloc en fin de `<style>` +
neutralisation de `scroll-behavior:smooth`.

### 2.2 `prefers-reduced-motion` absent de la maquette — **corrigé**
Même manque dans `SWIPT_Application_Maquette.html`. Bloc ajouté.

### 2.3 Focus offset de la maquette à 2px au lieu de 3px — **corrigé**
§3.6 fixe `outline-offset: 3px`. La maquette utilisait `2px` (les deux autres fichiers étaient déjà à 3px).
Aligné sur la spec.

### 2.4 Complément sur le bloc reduced-motion du calculateur — **corrigé**
Le bloc existait mais ne neutralisait pas `scroll-behavior:smooth` ni les `animation`. Complété.

---

## 3. Recommandations contraste (à arbitrer 📋)

Non corrigées volontairement : la spec dit « ne pas modifier les couleurs à l'œil ». Le correctif
consiste à **choisir un token plus foncé pour le texte porteur de sens**, ce qui est une décision de conception.

### 3.1 Ton « faint / dim2 » utilisé pour du texte porteur de sens
Contrastes recalculés (WCAG) :

| Token | Sur fond | Ratio | Seuil §3.6 |
|---|---|---|---|
| `--faint #98948C` | blanc | **3,02:1** | < 4,5 |
| `--dim2 / d-faint #6E6A63` | `--bg #0E0E0F` | **3,59:1** | < 4,5 |

La spec classe ces tons comme « usage non essentiel » (§3.1). Or ils portent parfois du **sens** :

- **Maquette** : `--faint` habille les **libellés de KPI** (`.kpi .k` — « Appels traités aujourd'hui »),
  les **libellés de fiche** (`.f .k` — « Client », « Adresse ») et les **horaires** (`.li .tm`).
  Ce sont les étiquettes qui donnent leur sens aux chiffres → devraient être en `--soft` (5,70:1).
- **Calculateur** : `--dim2` habille les **graduations de curseurs** (`.scale` : 1…12, 100 €…600 €),
  la **cible de chaque offre** (`.pl .who` : « Artisan seul ») et la **note d'hypothèses** (`.hyp`).
  → passer ce texte en `--dim #9A968D` (6,54:1) sur fond sombre.

**Recommandation** : réserver `--faint`/`--dim2` aux séparateurs et méta purement décoratifs ;
utiliser `--soft` (clair) / `--dim` (sombre) dès qu'un texte est nécessaire à la compréhension.
C'est aussi ce qui évite que le développement, qui prend la maquette comme référence visuelle (§9),
n'hérite du problème.

### 3.2 Rappel positif
Aucune information n'est portée par la **seule** couleur : les statuts sont toujours doublés d'un
texte (« En retard », « Payée », « Transféré »…) — conforme §3.6 et §13.

---

## 4. Observations (📋)

### 4.1 Calculateur — la branche « dépassement » est inatteignable depuis les curseurs
Volume mensuel maximum = 12 appels/jour × 22 = **264**, toujours ≤ 480 (offre Pro). Donc
`planFor()` renvoie toujours une offre dont le forfait couvre le volume, et le bloc `extra>0`
(affichage du surcoût à 0,79 €) **ne se déclenche jamais** en usage réel. Ce n'est pas un bug,
mais l'annexe interne évoque « dépassements compris » alors que ce cas n'est pas exerçable ici.
À décider : soit assumer (le dépassement n'existe qu'au niveau facturation, pas simulation),
soit relever la borne haute du curseur d'appels pour rendre le scénario visible.

### 4.2 Maquette — cohérence des données fictives
Petites incohérences dans les données de démonstration (mockup, sans impact technique, mais la spec
vise « fictif mais réaliste ») :
- Le total « 1 340 € » de la file « à valider » additionne **165 € TTC** (Réaux) + **1 175 € HT**
  (Ferreira) — mélange HT/TTC.
- Fiche client Mme Réaux : « chiffre d'affaires 512 € TTC » mais l'historique affiché somme 192 + 165 = 357 €.
Harmoniser si ces écrans servent de captures de démonstration commerciale.

### 4.3 Les trois pages chargent des polices Google (`fonts.googleapis.com` / `gstatic.com`)
- **Performance** : requêtes externes bloquantes, à rebours de la cible « téléphone de chantier en 4G » (§3.5).
- **RGPD** : le chargement de Google Fonts depuis les serveurs de Google a fait l'objet de mises en demeure
  de la CNIL ; la spec impose un hébergement France/UE (§8). Pour la mise en production Next.js,
  **auto-héberger les polices** (Inter, IBM Plex Mono) via `next/font` — ce qui règle les deux points d'un coup.

### 4.4 Maquette — défilement JS non soumis à reduced-motion
`scrollIntoView({behavior:"smooth"})` (barre d'étapes) ignore la préférence système. Mineur :
à basculer sur `behavior:"auto"` quand `matchMedia('(prefers-reduced-motion: reduce)')` est vrai.

---

## 5. Avant mise en production

Rappel des bloquants déjà listés par la spec (§9, §10) et confirmés présents dans les fichiers :
retirer l'**annexe interne** du calculateur (« ne pas publier »), renseigner les champs `.ph`
(téléphone, raison sociale, SIREN, RCS, TVA, adresse), et ne pas mettre en ligne la section avis
tant qu'il n'y a pas de vrais clients.
