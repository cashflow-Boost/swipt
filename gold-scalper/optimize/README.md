# Optimiseur de poids — Gold Scalper

Outil **Python** qui reproduit le moteur des 6 familles de `gold_scalper.pine`,
backteste sur de **vraies données**, et cherche les **poids des familles** qui
tiennent **hors échantillon** (pas les plus flatteurs en backtest).

> ⚠️ **Pourquoi cet outil existe.** « Optimiser à partir du backtest » demande de
> lancer des milliers de backtests avec des poids différents — impossible à la
> main dans TradingView. Ce script le fait. Les poids trouvés sont un **point de
> départ à revalider dans le Strategy Tester TradingView**, qui reste la
> référence d'exécution (le moteur Python est fidèle *en esprit*, pas bit-à-bit).

## Ce qu'il fait

1. **Train / test** chronologique (70 / 30) — on n'optimise jamais sur les données de validation.
2. **Recherche aléatoire** des 6 poids sur le train, on garde le top-K.
3. **Sélection sur le test** (hors échantillon) → le gagnant généralise.
4. **Walk-forward** (4 fenêtres) → on voit si le gagnant est stable ou chanceux.
5. **Ablation** : chaque famille mise à 0, impact mesuré → *quelle famille aide, laquelle nuit*.
6. **Rasoir d'Occam** : toute famille dont le retrait ne coûte rien est ramenée à 0.

Métriques (en **R** = multiples du risque, indépendant de la taille) : nombre de
trades, R net, **profit factor**, win rate, espérance/trade, drawdown max.

## Installation

```bash
pip install -r requirements.txt
```

## Utilisation

```bash
# 1) Téléchargement automatique (Internet requis — bloqué dans l'environnement
#    d'origine, à lancer sur ta machine) :
python run.py --tf 5m --period 60d

# 2) Depuis tes propres CSV (datetime,open,high,low,close,volume) :
python run.py --csv xauusd_5m.csv --dxy-csv dxy_5m.csv --us10y-csv us10y_5m.csv

# 3) Écrire les poids optimisés DIRECTEMENT dans les .pine :
python run.py --tf 5m --period 60d --write

# 4) Tester la mécanique sans données (résultat NON significatif) :
python run.py --synthetic
```

### Options utiles

| Option | Effet |
|---|---|
| `--tf` | Timeframe (`1m`, `5m`, `15m`…). yfinance limite le `1m` à ~7 j, le `5m` à ~60 j. |
| `--period` | Profondeur d'historique (`60d`, `30d`…). |
| `--n-iter` | Nombre de combinaisons de poids testées (défaut 400). |
| `--min-trades` | Rejette les réglages avec trop peu de trades (anti-hasard). |
| `--bias-threshold`, `--min-confidence` | **Baisse-les si trop peu de trades.** |
| `--max-bars` | Sortie forcée après N bougies (scalping = trades courts). |
| `--write` | Injecte les poids retenus dans `gold_scalper.pine` et `..._strategy.pine`. |

Les symboles par défaut : or `GC=F`, dollar `DX-Y.NYB`, 10Y `^TNX`, argent `SI=F`,
SPX `^GSPC` (modifiables dans `data.py`).

## Lire le rapport

- **Best test** avec un **PF > 1.3** et assez de trades = piste sérieuse.
- **Walk-forward** : si une fenêtre s'effondre, le réglage est fragile → ne pas le trader.
- **Ablation** : une famille marquée *« candidate à 0 »* n'apporte rien sur ces
  données — **baisse son poids**. C'est la réponse concrète à « quelles infos
  servent vraiment ».

## Honnêteté

- Le backtest **passé ne garantit rien** du futur. Le walk-forward réduit le
  sur-apprentissage, il ne l'annule pas.
- 60 jours de M5, c'est un **échantillon court**. Refais l'optimisation
  régulièrement et sur plusieurs périodes avant de conclure.
- Si un réglage n'a pas **assez de trades** (< ~100 sur l'ensemble), ses stats ne
  veulent rien dire — augmente la période ou baisse les seuils.
- Différences attendues avec TradingView : spread/commission réels, exécution
  intrabar, `request.security`. **Valide toujours le gagnant dans le Strategy Tester.**

## Fichiers

| Fichier | Rôle |
|---|---|
| `engine.py` | Réplique du moteur : indicateurs + 6 familles + biais/confiance. |
| `backtest.py` | Simulation de la stratégie (SL/TP1/TP2, R par trade). |
| `optimize.py` | Recherche de poids, walk-forward, ablation, élagage. |
| `data.py` | Chargement CSV / yfinance. |
| `run.py` | Ligne de commande + rapport + écriture des .pine. |
