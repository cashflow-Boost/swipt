"""
Simulation de la stratégie sur les biais/confiance produits par le moteur.

Exécution volontairement CONSERVATRICE :
- entrée à l'OUVERTURE de la bougie SUIVANT le signal (aucun biais du futur) ;
- si SL et TP sont touchés dans la même bougie, on suppose le SL touché d'abord ;
- résultats mesurés en R (multiples du risque = distance à l'entrée du SL),
  ce qui rend les stats indépendantes de la taille de position.
"""
from __future__ import annotations
import numpy as np
from engine import compose


def signals_from_bias(bias, conf, feat, cfg):
    thr = cfg["biasThreshold"]
    minc = cfg["minConfidence"]
    can = feat["in_session"] & (~feat["in_news"]) & (conf >= minc) & feat["vol_ok"]
    prev = np.r_[0.0, bias[:-1]]
    long_sig = can & (bias >= thr) & (prev < thr)
    short_sig = can & (bias <= -thr) & (prev > -thr)
    return long_sig, short_sig


def simulate(feat, weights, cfg):
    bias, conf = compose(feat, weights)
    long_sig, short_sig = signals_from_bias(bias, conf, feat, cfg)
    o, h, l, c = feat["open"], feat["high"], feat["low"], feat["close"]
    a = feat["atr"]
    n = len(c)
    sl_m, tp1_m, tp2_m = cfg["slMult"], cfg["tp1Mult"], cfg["tp2Mult"]
    tp1_q = cfg["tp1Qty"] / 100.0
    use_be = cfg["useBE"]
    use_opp = cfg["useOppExit"]
    max_bars = cfg["maxBars"]

    trades = []           # R réalisé par trade
    pos = 0               # +1 long, -1 short, 0 flat
    entry = risk = tp1 = tp2 = stop = np.nan
    qty_open = 0.0
    realized = 0.0        # R déjà encaissé (part TP1)
    tp1_hit = False
    ebar = 0

    i = 0
    while i < n - 1:
        if pos == 0:
            if long_sig[i] or short_sig[i]:
                d = 1 if long_sig[i] else -1
                if np.isnan(a[i]) or a[i] <= 0:
                    i += 1; continue
                pos = d
                entry = o[i + 1]                     # entrée bougie suivante
                risk = a[i] * sl_m
                stop = entry - d * risk
                tp1 = entry + d * a[i] * tp1_m
                tp2 = entry + d * a[i] * tp2_m
                qty_open = 1.0; realized = 0.0; tp1_hit = False
                ebar = i + 1
                i += 1
                continue
            i += 1
            continue

        # en position : on gère la bougie i
        d = pos
        hi, lo = h[i], l[i]
        exit_now = False
        # 1) stop d'abord (pessimiste)
        hit_stop = (lo <= stop) if d == 1 else (hi >= stop)
        if hit_stop:
            realized += qty_open * ((stop - entry) * d) / risk
            trades.append(realized); pos = 0; i += 1; continue
        # 2) TP1
        if not tp1_hit and tp1_q > 0:
            hit_tp1 = (hi >= tp1) if d == 1 else (lo <= tp1)
            if hit_tp1:
                realized += tp1_q * ((tp1 - entry) * d) / risk
                qty_open -= tp1_q; tp1_hit = True
                if use_be:
                    stop = entry
        # 3) TP2 (solde)
        hit_tp2 = (h[i] >= tp2) if d == 1 else (l[i] <= tp2)
        if hit_tp2:
            realized += qty_open * ((tp2 - entry) * d) / risk
            trades.append(realized); pos = 0; i += 1; continue
        # 4) signal opposé
        if use_opp and ((d == 1 and short_sig[i]) or (d == -1 and long_sig[i])):
            realized += qty_open * ((c[i] - entry) * d) / risk
            trades.append(realized); pos = 0; i += 1; continue
        # 5) sortie temporelle
        if max_bars > 0 and (i - ebar) >= max_bars:
            realized += qty_open * ((c[i] - entry) * d) / risk
            trades.append(realized); pos = 0; i += 1; continue
        i += 1

    return np.array(trades, float), bias, conf


def stats(trades):
    n = len(trades)
    if n == 0:
        return {"trades": 0, "net_R": 0.0, "pf": 0.0, "win": 0.0, "expectancy": 0.0, "maxdd_R": 0.0}
    wins = trades[trades > 0].sum()
    losses = -trades[trades < 0].sum()
    equity = np.cumsum(trades)
    peak = np.maximum.accumulate(equity)
    maxdd = (peak - equity).max()
    return {
        "trades": n,
        "net_R": float(trades.sum()),
        "pf": float(wins / losses) if losses > 0 else float("inf") if wins > 0 else 0.0,
        "win": float((trades > 0).mean() * 100),
        "expectancy": float(trades.mean()),
        "maxdd_R": float(maxdd),
    }
