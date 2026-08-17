"""
Optimisation des poids des 6 familles.

Méthode anti-sur-apprentissage :
  1. Découpe chronologique train / test (par défaut 70 / 30).
  2. Recherche aléatoire des poids sur le TRAIN, on garde le top-K.
  3. On évalue le top-K sur le TEST (hors échantillon) ; on choisit le meilleur.
  4. Walk-forward (fenêtres roulantes) pour vérifier la STABILITÉ du gagnant.
  5. Ablation : on met chaque famille à 0 et on mesure l'impact sur le TEST
     -> réponse directe « quelle famille aide, laquelle nuit ».

On ne cherche pas le backtest le plus flatteur : on cherche des poids qui
tiennent hors échantillon. Un poids qu'on peut mettre à 0 sans perdre de
performance doit être mis à 0 (rasoir d'Occam).
"""
from __future__ import annotations
import numpy as np
from backtest import simulate, stats
from engine import FAMILY_ORDER


def slice_feat(feat, lo, hi):
    out = {"inter_active": feat["inter_active"], "vol_available": feat["vol_available"]}
    out["index"] = feat["index"][lo:hi]
    for k in ("open", "high", "low", "close", "atr", "context_mult", "in_session", "in_news", "vol_ok"):
        out[k] = feat[k][lo:hi]
    out["families"] = {k: v[lo:hi] for k, v in feat["families"].items()}
    return out


def evaluate(feat, weights, cfg):
    trades, _, _ = simulate(feat, weights, cfg)
    return stats(trades)


def score_of(st, min_trades):
    """Objectif robuste : R net pénalisé par le drawdown, nul si trop peu de trades."""
    if st["trades"] < min_trades or st["pf"] <= 1.0:
        return -1e9 + st["net_R"]
    return st["net_R"] / (1.0 + st["maxdd_R"])


def random_search(feat, cfg, n_iter, min_trades, seed=42, wmax=2.5):
    rng = np.random.default_rng(seed)
    results = []
    for _ in range(n_iter):
        w = {k: round(float(rng.uniform(0, wmax)), 2) for k in FAMILY_ORDER}
        st = evaluate(feat, w, cfg)
        results.append((score_of(st, min_trades), w, st))
    results.sort(key=lambda x: x[0], reverse=True)
    return results


def walk_forward(feat, weights, cfg, folds=4):
    n = len(feat["close"])
    seg = n // folds
    rows = []
    for f in range(folds):
        lo = f * seg
        hi = n if f == folds - 1 else (f + 1) * seg
        st = evaluate(slice_feat(feat, lo, hi), weights, cfg)
        rows.append(st)
    return rows


def ablation(feat_test, weights, cfg):
    base = evaluate(feat_test, weights, cfg)
    rows = []
    for fam in FAMILY_ORDER:
        w2 = dict(weights); w2[fam] = 0.0
        st = evaluate(feat_test, w2, cfg)
        rows.append((fam, st, st["net_R"] - base["net_R"]))
    return base, rows


def optimize(feat, cfg, n_iter=400, min_trades=30, train_frac=0.7, top_k=25, seed=42):
    n = len(feat["close"])
    split = int(n * train_frac)
    feat_tr = slice_feat(feat, 0, split)
    feat_te = slice_feat(feat, split, n)
    min_tr_train = max(int(min_trades * train_frac), 10)
    min_tr_test = max(int(min_trades * (1 - train_frac)), 8)

    cand = random_search(feat_tr, cfg, n_iter, min_tr_train, seed=seed)[:top_k]
    scored = []
    for _, w, st_tr in cand:
        st_te = evaluate(feat_te, w, cfg)
        scored.append((score_of(st_te, min_tr_test), w, st_tr, st_te))
    scored.sort(key=lambda x: x[0], reverse=True)

    best_score, best_w, best_tr, best_te = scored[0]
    wf = walk_forward(feat, best_w, cfg)
    abl_base, abl = ablation(feat_te, best_w, cfg)

    # Rasoir d'Occam : familles dont le retrait n'enlève rien (ou améliore) -> 0
    pruned = dict(best_w)
    for fam, st, delta in abl:
        if delta >= -1e-9:      # retirer cette famille ne dégrade pas
            pruned[fam] = 0.0
    pruned_te = evaluate(feat_te, pruned, cfg) if any(pruned.values()) else best_te

    return {
        "split": split, "n": n,
        "best_weights": best_w, "best_train": best_tr, "best_test": best_te,
        "walk_forward": wf,
        "ablation_base": abl_base, "ablation": abl,
        "pruned_weights": pruned, "pruned_test": pruned_te,
        "candidates": scored,
    }
