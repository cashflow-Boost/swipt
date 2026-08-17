# Gold Scalper — Indicateur multi-facteurs XAU/USD (Pine Script v6)

Indicateur TradingView pour le **scalping de l'or** qui agrège plusieurs
sources d'information en un **biais directionnel (-100 … +100)** et un
**score de confiance (0 … 100 %)**, avec signaux Buy/Sell et SL/TP calés
sur l'ATR.

> ⚠️ **À lire avant tout.** Aucun indicateur ne « prédit » le marché. Celui-ci
> synthétise des signaux pour t'aider à décider ; il ne remplace ni ta gestion
> du risque, ni ton jugement. Le trading comporte un risque de perte réel.
> Backteste et teste en démo avant d'engager du capital.

---

## Fichier

- [`gold_scalper.pine`](./gold_scalper.pine) — le script à coller dans TradingView.

## Installation

1. Ouvre un graphique **XAU/USD** (ex. `OANDA:XAUUSD`, `FXCM:XAUUSD`, ou l'or de ton broker).
2. Menu **Pine Editor** (en bas de TradingView) → colle le contenu de `gold_scalper.pine`.
3. Clique **Add to chart / Ajouter au graphique**.
4. Choisis ton timeframe de scalping (M1 / M5) et laisse le **HTF de confirmation** sur 15 ou 60.

### Créer les alertes

- Clic droit sur le graphique → **Add alert** → Condition = *Gold Scalper* →
  choisis `🟢 Signal ACHAT`, `🔴 Signal VENTE` ou `⚪ Tout signal`.

---

## Ce que l'indicateur regarde (les facteurs)

Chaque facteur vote `▲ haussier`, `▼ baissier` ou `— neutre`. Les votes sont
**pondérés** (réglables), sommés, puis normalisés en un biais -100…+100.

| Facteur | Ce qu'il capte | Poids par défaut |
|---|---|---|
| **Tendance HTF** | Clôture vs EMA sur un timeframe supérieur (`request.security`) | 2.0 |
| **Alignement EMA** | Empilement EMA 8/21/50 + position vs EMA 200 | 2.0 |
| **Structure de marché** | Cassure du dernier swing high/low (BOS) | 1.5 |
| **RSI** | Momentum autour de 50 (55/45) | 1.0 |
| **MACD** | Sens + accélération de l'histogramme | 1.0 |
| **VWAP** | Prix au-dessus / en-dessous du VWAP de session | 1.0 |
| **DXY (inversé)** | Dollar Index — l'or monte quand le dollar baisse | 1.5 |
| **Rendements 10Y (inversé)** | US10Y — rendements en hausse ≈ or sous pression | 1.0 |

### Confiance

La confiance n'est pas juste la force du biais. Elle combine :

- **Magnitude** du biais,
- **Accord** entre facteurs (combien pointent dans le même sens),
- **Session** active (Londres / New York ; bonus sur le chevauchement LDN×NY),
- **Régime de volatilité** (ATR courant vs sa moyenne : ni marché mort, ni chaos).

Un signal n'est émis que si : `biais ≥ seuil` **et** `confiance ≥ minimum`
**et** on est en session **et** hors fenêtre news **et** la volatilité est exploitable.

---

## Gestion du risque

Sur chaque signal, l'indicateur trace :

- **SL** = `1.2 × ATR` (réglable),
- **TP1** = `1.0 × ATR`, **TP2** = `2.0 × ATR`.

Ce sont des **repères**, pas des ordres. Adapte-les à ton money management
(risque fixe par trade, ex. 0,5–1 % du capital).

---

## Réglages recommandés (points de départ, à backtester)

| Style | Chart | HTF confirm. | Seuil biais | Confiance min. |
|---|---|---|---|---|
| Scalp rapide | M1 | 15 | 45 | 60 |
| Scalp standard | M5 | 60 | 40 | 55 |
| Intraday | M15 | 240 | 35 | 50 |

- **Trop de signaux ?** monte le seuil de biais et la confiance minimale.
- **Trop peu ?** baisse-les, ou réduis les poids DXY/10Y si ton broker n'a pas ces flux.

---

## Limites — à connaître, pas à contourner

- **Pas de calendrier économique live.** Pine n'y a pas accès. La « fenêtre news »
  est une **plage horaire UTC que tu renseignes** (ex. 12:30 pour NFP/CPI, 18:00
  pour le FOMC). Ce n'est pas de la détection automatique de news.
- **Pas de carnet d'ordres / flux d'ordres.** Aucun indicateur de prix ne le voit.
- **DXY / US10Y** dépendent de la disponibilité des symboles `TVC:DXY` / `TVC:US10Y`
  sur ton offre TradingView. Sinon, désactive ces facteurs dans les réglages.
- **`request.security`** utilise `lookahead_off` : pas de biais du futur, mais la
  valeur HTF ne se fige qu'à la clôture de la bougie supérieure (normal et sain).
- Le scalping de l'or est **fortement bruité** : un biais fort n'est pas une
  certitude. Vise un avantage statistique sur beaucoup de trades, pas la
  perfection sur un seul.

---

## Feuille de route possible (si tu veux aller plus loin)

- Version **`strategy()`** avec backtest chiffré (win-rate, profit factor, drawdown).
- Filtre de **spread** et d'heure de rollover.
- Détection de **divergences** RSI/prix.
- Zones de **liquidité / order blocks** (structure fine).
