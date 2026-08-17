# Gold Scalper Pro — Moteur multi-facteurs XAU/USD (Pine Script v6)

Deux scripts TradingView pour le **scalping de l'or** :

| Fichier | Rôle |
|---|---|
| [`gold_scalper.pine`](./gold_scalper.pine) | **Indicateur** : biais -100…+100, confiance 0…100 %, signaux, tableau de bord, alertes. |
| [`gold_scalper_strategy.pine`](./gold_scalper_strategy.pine) | **Stratégie** : même moteur, exécutée en trades pour le **backtest** (win-rate, profit factor, drawdown). |

Le moteur calcule **tout ce que les maths peuvent tirer du prix, du volume et
des marchés liés**, regroupé en **6 familles**, et le condense en un biais
directionnel + un score de confiance.

> ⚠️ **Lis ceci.** Aucun indicateur ne « prédit » le marché. Celui-ci **synthétise**
> beaucoup d'informations pour t'aider à décider. Et surtout : **empiler
> 30 indicateurs ne rend pas le signal plus juste** — beaucoup mesurent la même
> chose (colinéarité) et peuvent créer une fausse impression de certitude. Le
> **seul** juge de valeur, c'est le **backtest** (fichier stratégie). Teste en
> démo avant d'engager du capital. Le trading comporte un risque de perte réel.

---

## Les 6 familles et leurs mesures

Chaque mesure vote entre `-1` (baissier) et `+1` (haussier). On **moyenne** à
l'intérieur d'une famille (pour qu'une famille bourrée d'oscillateurs corrélés
ne domine pas), puis on combine les familles par des **poids réglables**.

| Famille | Mesures calculées |
|---|---|
| **① Tendance** | EMA 8/21/50/200, 2 timeframes supérieurs, Supertrend, Parabolic SAR, Ichimoku (nuage + Tenkan/Kijun), ADX/DMI, pente de régression linéaire, cassure Donchian |
| **② Momentum** | RSI, MACD (sens + accélération), Stochastique, CCI, Williams %R, ROC, Awesome Oscillator, **divergences RSI** |
| **③ Volatilité** | Régime ATR (marché mort / normal / chaotique), **squeeze Bollinger/Keltner** — sert à filtrer, pas à donner une direction |
| **④ Volume / Flux** | OBV, MFI, CMF, participation du volume *(auto-désactivé si le flux n'a pas de volume réel)* |
| **⑤ Niveaux / Prix** | VWAP de session, **pivots journaliers**, **plus-haut/plus-bas de la veille**, proximité des **nombres ronds** |
| **⑥ Structure** | Cassure de structure (BOS), séquence HH/HL vs LH/LL, **chandeliers** (engulfing, marteau, étoile) |
| **Inter-marchés** | **DXY** (inverse), **rendements US10Y** (inverse), **Argent XAG** (corrélation +), **SPX** (risk-on/off), + **corrélation live** or/DXY pour jauger la fiabilité |

### Comment le biais et la confiance sont calculés

- **Biais (-100…+100)** = moyenne pondérée des scores de familles.
- **Confiance (0…100 %)** = magnitude du biais × **accord entre familles** ×
  multiplicateurs de contexte :
  - session active (bonus au chevauchement **Londres × New York**),
  - régime de **volatilité** exploitable,
  - **force de tendance** (ADX),
  - **participation du volume**,
  - pénalité en **squeeze** (compression = pas de direction claire),
  - pénalité près d'un **nombre rond** (zone de réaction),
  - bonus si la **corrélation or/DXY** est bien inverse.

Un signal n'est émis que si **tous** ces filtres sont verts :
`|biais| ≥ seuil` **et** `confiance ≥ minimum` **et** en session **et**
hors fenêtre news **et** volatilité exploitable.

---

## Installation

1. Graphique **XAU/USD** (`OANDA:XAUUSD`, `FXCM:XAUUSD`, ou l'or de ton broker), en **M1** ou **M5**.
2. **Pine Editor** → colle le fichier → **Add to chart**.
3. Pour les alertes : clic droit → **Add alert** → condition *Gold Scalper Pro*.

### Backtester (fichier stratégie)

1. Colle `gold_scalper_strategy.pine` → **Add to chart**.
2. Onglet **Strategy Tester** en bas → lis *Net Profit*, *Profit Factor*,
   *Max Drawdown*, *Win Rate*, *Nombre de trades*.
3. Règle **slippage** et **commission** dans *Settings → Properties* pour du
   réalisme (défaut : slippage 2 ticks). Limite la période dans *⑧ Backtest*.
4. **Ne crois pas un backtest avec peu de trades** : vise plusieurs centaines
   d'opérations sur plusieurs mois avant de conclure quoi que ce soit.

---

## Réglages recommandés (points de départ, à backtester)

| Style | Chart | HTF 1 / 2 | Seuil biais | Confiance min. |
|---|---|---|---|---|
| Scalp rapide | M1 | 15 / 60 | 40 | 60 |
| Scalp standard | M5 | 15 / 60 | 35 | 55 |
| Intraday | M15 | 60 / 240 | 30 | 50 |

- **Trop de signaux ?** monte le seuil de biais et la confiance min.
- **Trop peu ?** baisse-les, ou allège les familles qui votent rarement.
- **Broker sans volume réel** (spot FX) → la famille Volume se neutralise seule.

### Gestion du risque (stratégie)

- SL = `1.2 × ATR`, TP1 = `1.0 × ATR` (ferme 50 %), TP2 = `2.0 × ATR`.
- Option **stop au point d'entrée après TP1** (sécurise le trade).
- Option **sortie sur signal opposé** et **sortie temporelle** (scalping = trades courts).
- Adapte la taille à un **risque fixe par trade** (0,5–1 % du capital).

---

## Limites — à connaître, pas à contourner

- **Pas de calendrier news live.** Pine n'y a pas accès. La « fenêtre news » est
  une **plage horaire UTC que tu renseignes** (NFP/CPI ≈ 12:30, FOMC ≈ 18:00).
- **Pas de carnet d'ordres / order flow.** Invisible pour tout indicateur de prix.
- **DXY / US10Y / XAG / SPX** dépendent de la disponibilité des symboles sur ton
  offre TradingView ; désactivables un par un.
- `request.security` en `lookahead_off` : **aucun biais du futur**, mais les
  valeurs HTF/journalières ne se figent qu'à la clôture de leur bougie (sain).
- **Plus de facteurs ≠ plus de précision.** La richesse ne remplace pas la
  validation statistique. Si une famille dégrade ton backtest, **baisse son poids
  à 0**. Un modèle simple qui marche bat un modèle complexe qui sur-apprend.

---

## Note technique

Je n'ai pas de compilateur Pine dans cet environnement, donc je n'ai pas pu
exécuter les scripts ici. Le code respecte la syntaxe Pine v6 ; si TradingView
signale une ligne en rouge au collage, copie-moi le message d'erreur et je corrige.

## Pistes d'amélioration

- Optimisation des poids par **walk-forward** (éviter le sur-apprentissage).
- Filtre de **spread** et gestion du **rollover** quotidien.
- Détection d'**order blocks / zones de liquidité** (structure fine).
- Export des signaux via **webhook** vers un bot d'exécution.
