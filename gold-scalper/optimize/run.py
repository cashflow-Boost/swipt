#!/usr/bin/env python3
"""
Optimiseur de poids — Gold Scalper.

Exemples :
  # Avec téléchargement automatique (nécessite Internet + yfinance) :
  pip install -r requirements.txt
  python run.py --tf 5m --period 60d

  # Avec un CSV que tu as exporté (datetime,open,high,low,close,volume) :
  python run.py --csv xauusd_5m.csv --dxy-csv dxy_5m.csv

  # Écrire les poids optimisés dans les fichiers .pine :
  python run.py --tf 5m --period 60d --write

  # Test de la mécanique sans données réelles (résultat NON significatif) :
  python run.py --synthetic
"""
from __future__ import annotations
import argparse, json, os, re, sys
import numpy as np
import pandas as pd

from engine import build_features, FAMILY_ORDER
from optimize import optimize

FAM_FR = {"trend": "Tendance", "mom": "Momentum", "flow": "Volume/Flux",
          "level": "Niveaux", "struct": "Structure", "inter": "Inter-marchés"}
PINE_VAR = {"trend": "wTrend", "mom": "wMom", "flow": "wFlow",
            "level": "wLevel", "struct": "wStruct", "inter": "wInter"}
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def default_cfg():
    return dict(biasThreshold=35, minConfidence=55, slMult=1.2, tp1Mult=1.0,
                tp2Mult=2.0, tp1Qty=50, useBE=True, useOppExit=True, maxBars=48)


def engine_params(tf):
    step = {"1m": "1min", "3m": "3min", "5m": "5min", "15m": "15min",
            "30m": "30min", "60m": "60min", "1h": "60min"}.get(tf, "5min")
    htf1 = "15min" if tf in ("1m", "3m", "5m") else "60min"
    htf2 = "60min" if tf in ("1m", "3m", "5m") else "240min"
    return dict(htf1=htf1, htf2=htf2, useSessions=True, useNews=True)


def synthetic(n=8000, seed=1):
    rng = np.random.default_rng(seed)
    idx = pd.date_range("2025-01-01", periods=n, freq="5min", tz="UTC").tz_localize(None)
    ret = rng.normal(0, 1, n).cumsum()
    price = 2000 + ret + 20 * np.sin(np.arange(n) / 200.0)
    close = pd.Series(price, index=idx)
    high = close + rng.uniform(0, 1.5, n)
    low = close - rng.uniform(0, 1.5, n)
    open_ = close.shift(1).fillna(close.iloc[0])
    vol = pd.Series(rng.uniform(100, 1000, n), index=idx)
    df = pd.DataFrame({"open": open_, "high": high, "low": low, "close": close, "volume": vol})
    inter = {"dxy": pd.Series(100 - ret * 0.1 + rng.normal(0, 0.2, n), index=idx),
             "us10y": pd.Series(4 + rng.normal(0, 0.05, n).cumsum() * 0.01, index=idx)}
    return df, inter


def fmt(st):
    pf = "inf" if st["pf"] == float("inf") else f"{st['pf']:.2f}"
    return (f"trades={st['trades']:4d}  R net={st['net_R']:7.2f}  PF={pf:>5}  "
            f"win={st['win']:4.1f}%  esp={st['expectancy']:+.3f}R  maxDD={st['maxdd_R']:.2f}R")


def patch_pine(weights):
    changed = []
    for fname in ("gold_scalper.pine", "gold_scalper_strategy.pine"):
        path = os.path.join(ROOT, fname)
        if not os.path.exists(path):
            continue
        txt = open(path, encoding="utf-8").read()
        for fam, val in weights.items():
            var = PINE_VAR[fam]
            txt = re.sub(rf'({var}\s*=\s*input\.float\()\s*[-\d.]+',
                         rf'\g<1>{val:.2f}', txt)
        open(path, "w", encoding="utf-8").write(txt)
        changed.append(fname)
    return changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv"); ap.add_argument("--dxy-csv"); ap.add_argument("--us10y-csv")
    ap.add_argument("--silver-csv"); ap.add_argument("--spx-csv")
    ap.add_argument("--tf", default="5m"); ap.add_argument("--period", default="60d")
    ap.add_argument("--gold-symbol", default="GC=F")
    ap.add_argument("--n-iter", type=int, default=400)
    ap.add_argument("--min-trades", type=int, default=30)
    ap.add_argument("--bias-threshold", type=int, help="Seuil de biais (défaut 35). Baisser si trop peu de trades.")
    ap.add_argument("--min-confidence", type=int, help="Confiance min. (défaut 55). Baisser si trop peu de trades.")
    ap.add_argument("--max-bars", type=int, help="Sortie forcée après N bougies (défaut 48).")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--synthetic", action="store_true")
    a = ap.parse_args()

    if a.synthetic:
        print("⚠️  MODE SYNTHÉTIQUE — données aléatoires, résultat NON significatif "
              "(test de la mécanique uniquement).\n")
        df, inter = synthetic()
    elif a.csv:
        from data import load_csv
        df = load_csv(a.csv)
        inter = {}
        for key, path in [("dxy", a.dxy_csv), ("us10y", a.us10y_csv),
                          ("silver", a.silver_csv), ("spx", a.spx_csv)]:
            if path:
                inter[key] = load_csv(path)["close"]
    else:
        from data import fetch_yf
        print(f"Téléchargement yfinance {a.gold_symbol} {a.tf}/{a.period} ...")
        df, inter = fetch_yf(tf=a.tf, period=a.period, gold=a.gold_symbol)

    print(f"Bougies : {len(df)}  du {df.index[0]} au {df.index[-1]}")
    print(f"Marchés liés : {', '.join(inter) or 'aucun'}\n")

    feat = build_features(df, inter=inter, p=engine_params(a.tf))
    cfg = default_cfg()
    if a.bias_threshold is not None: cfg["biasThreshold"] = a.bias_threshold
    if a.min_confidence is not None: cfg["minConfidence"] = a.min_confidence
    if a.max_bars is not None: cfg["maxBars"] = a.max_bars
    res = optimize(feat, cfg, n_iter=a.n_iter, min_trades=a.min_trades, seed=a.seed)

    print(f"Découpe train/test à l'indice {res['split']} / {res['n']}\n")
    print("=== MEILLEURS POIDS (choisis sur le TEST hors échantillon) ===")
    for fam in FAMILY_ORDER:
        print(f"  {FAM_FR[fam]:<14} {res['best_weights'][fam]:.2f}")
    print(f"  TRAIN : {fmt(res['best_train'])}")
    print(f"  TEST  : {fmt(res['best_test'])}\n")

    print("=== WALK-FORWARD (stabilité sur 4 fenêtres) ===")
    for i, st in enumerate(res["walk_forward"], 1):
        print(f"  fenêtre {i} : {fmt(st)}")
    print()

    print("=== ABLATION (impact du retrait de chaque famille, sur le TEST) ===")
    print(f"  base : {fmt(res['ablation_base'])}")
    for fam, st, delta in res["ablation"]:
        tag = "→ inutile/nuisible (candidate à 0)" if delta >= -1e-9 else "→ utile"
        print(f"  sans {FAM_FR[fam]:<14} ΔR={delta:+7.2f}  {tag}")
    print()

    if any(res["pruned_weights"].values()) and res["pruned_weights"] != res["best_weights"]:
        print("=== POIDS ÉLAGUÉS (rasoir d'Occam) ===")
        for fam in FAMILY_ORDER:
            print(f"  {FAM_FR[fam]:<14} {res['pruned_weights'][fam]:.2f}")
        print(f"  TEST  : {fmt(res['pruned_test'])}\n")

    final = res["pruned_weights"] if (any(res["pruned_weights"].values())
             and res["pruned_test"]["net_R"] >= res["best_test"]["net_R"]) else res["best_weights"]

    out = {"weights": final, "cfg": cfg, "tf": a.tf,
           "best_test": res["best_test"], "best_weights": res["best_weights"]}
    with open(os.path.join(HERE, "weights.json"), "w") as f:
        json.dump(out, f, indent=2, default=str)
    print(f"Poids retenus écrits dans optimize/weights.json : "
          f"{ {k: round(v,2) for k,v in final.items()} }")

    if a.write:
        changed = patch_pine(final)
        print(f"✅ Fichiers Pine mis à jour : {', '.join(changed)}")
    else:
        print("(ajoute --write pour injecter ces poids dans les .pine)")


if __name__ == "__main__":
    main()
