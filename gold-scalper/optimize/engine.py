"""
Réplique en pandas/numpy du moteur multi-facteurs de gold_scalper.pine.

Objectif : calculer, sans biais du futur, les scores des 6 familles + les
éléments de gating (session, news, volatilité, ADX, squeeze, corrélation...),
UNE SEULE FOIS. Le composite (biais/confiance) dépend des poids et se recalcule
vite par-dessus (voir compose()).

⚠️ Fidèle en esprit à la version Pine, pas bit-à-bit identique. Les poids
optimisés ici sont un point de départ à revalider dans le Strategy Tester
TradingView. TradingView reste la référence d'exécution.
"""
from __future__ import annotations
import numpy as np
import pandas as pd

# --------------------------------------------------------------------------
# Indicateurs de base (vectorisés)
# --------------------------------------------------------------------------
def ema(s, n):   return s.ewm(span=n, adjust=False).mean()
def sma(s, n):   return s.rolling(n).mean()
def rma(s, n):   return s.ewm(alpha=1.0 / n, adjust=False).mean()          # Wilder
def stdev(s, n): return s.rolling(n).std(ddof=0)

def rsi(close, n=14):
    d = close.diff()
    up = rma(d.clip(lower=0), n)
    dn = rma((-d).clip(lower=0), n)
    rs = up / dn.replace(0, np.nan)
    return (100 - 100 / (1 + rs)).fillna(50)

def true_range(h, l, c):
    pc = c.shift(1)
    return pd.concat([h - l, (h - pc).abs(), (l - pc).abs()], axis=1).max(axis=1)

def atr(h, l, c, n=14):
    return rma(true_range(h, l, c), n)

def macd(close, f=12, s=26, sig=9):
    line = ema(close, f) - ema(close, s)
    signal = ema(line, sig)
    return line, signal, line - signal

def stoch_k(h, l, c, n=14, smooth=3):
    ll = l.rolling(n).min()
    hh = h.rolling(n).max()
    k = 100 * (c - ll) / (hh - ll).replace(0, np.nan)
    return sma(k, smooth)

def cci(h, l, c, n=20):
    tp = (h + l + c) / 3
    ma = sma(tp, n)
    md = (tp - ma).abs().rolling(n).mean()
    return (tp - ma) / (0.015 * md.replace(0, np.nan))

def williams_r(h, l, c, n=14):
    hh = h.rolling(n).max()
    ll = l.rolling(n).min()
    return (hh - c) / (hh - ll).replace(0, np.nan) * -100

def roc(close, n=9):
    return 100 * (close - close.shift(n)) / close.shift(n)

def bollinger(close, n=20, mult=2.0):
    basis = sma(close, n)
    dev = mult * stdev(close, n)
    return basis, basis + dev, basis - dev

def keltner(h, l, c, n=20, mult=1.5):
    basis = ema(c, n)
    rng = ema(true_range(h, l, c), n)
    return basis, basis + mult * rng, basis - mult * rng

def dmi(h, l, c, n=14):
    up = h.diff()
    dn = -l.diff()
    plus_dm = np.where((up > dn) & (up > 0), up, 0.0)
    minus_dm = np.where((dn > up) & (dn > 0), dn, 0.0)
    tr = true_range(h, l, c)
    atrn = rma(tr, n)
    plus_di = 100 * rma(pd.Series(plus_dm, index=h.index), n) / atrn.replace(0, np.nan)
    minus_di = 100 * rma(pd.Series(minus_dm, index=h.index), n) / atrn.replace(0, np.nan)
    dx = 100 * (plus_di - minus_di).abs() / (plus_di + minus_di).replace(0, np.nan)
    adx = rma(dx, n)
    return plus_di.fillna(0), minus_di.fillna(0), adx.fillna(0)

def supertrend(h, l, c, factor=3.0, n=10):
    a = atr(h, l, c, n)
    hl2 = (h + l) / 2
    upper = hl2 + factor * a
    lower = hl2 - factor * a
    n_ = len(c)
    dir_ = np.ones(n_)          # +1 baissier, -1 haussier (comme Pine: dir<0 = up)
    fu = upper.to_numpy().copy()
    fl = lower.to_numpy().copy()
    cc = c.to_numpy()
    for i in range(1, n_):
        fl[i] = max(fl[i], fl[i - 1]) if cc[i - 1] > fl[i - 1] else lower.iloc[i]
        fu[i] = min(fu[i], fu[i - 1]) if cc[i - 1] < fu[i - 1] else upper.iloc[i]
        if cc[i] > fu[i - 1]:
            dir_[i] = -1
        elif cc[i] < fl[i - 1]:
            dir_[i] = 1
        else:
            dir_[i] = dir_[i - 1]
    return pd.Series(dir_, index=c.index)

def parabolic_sar(h, l, step=0.02, inc=0.02, mx=0.2):
    hi = h.to_numpy(); lo = l.to_numpy(); n = len(hi)
    sar = np.zeros(n); bull = True; af = step
    ep = hi[0]; sar[0] = lo[0]
    for i in range(1, n):
        sar[i] = sar[i - 1] + af * (ep - sar[i - 1])
        if bull:
            if lo[i] < sar[i]:
                bull = False; sar[i] = ep; ep = lo[i]; af = step
            else:
                if hi[i] > ep:
                    ep = hi[i]; af = min(af + inc, mx)
        else:
            if hi[i] > sar[i]:
                bull = True; sar[i] = ep; ep = hi[i]; af = step
            else:
                if lo[i] < ep:
                    ep = lo[i]; af = min(af + inc, mx)
    return pd.Series(sar, index=h.index)

def ichimoku_score(h, l, c):
    tenkan = (h.rolling(9).max() + l.rolling(9).min()) / 2
    kijun = (h.rolling(26).max() + l.rolling(26).min()) / 2
    spanA = (tenkan + kijun) / 2
    spanB = (h.rolling(52).max() + l.rolling(52).min()) / 2
    top = pd.concat([spanA, spanB], axis=1).max(axis=1)
    bot = pd.concat([spanA, spanB], axis=1).min(axis=1)
    up = (c > top) & (tenkan > kijun)
    dn = (c < bot) & (tenkan < kijun)
    return np.where(up, 1.0, np.where(dn, -1.0, 0.0))

def linreg_slope(close, n=20):
    """Pente de la régression linéaire (valeur au point - point précédent)."""
    arr = close.to_numpy(dtype=float)
    x = np.arange(n)
    xm = x.mean()
    denom = ((x - xm) ** 2).sum()
    out = np.full(len(arr), np.nan)
    if len(arr) >= n:
        win = np.lib.stride_tricks.sliding_window_view(arr, n)
        ym = win.mean(axis=1, keepdims=True)
        slope = ((win - ym) * (x - xm)).sum(axis=1) / denom
        intercept = ym.squeeze() - slope * xm
        endpoint = intercept + slope * (n - 1)
        out[n - 1:] = endpoint
    s = pd.Series(out, index=close.index)
    return s - s.shift(1)

def obv(close, vol):
    return (np.sign(close.diff().fillna(0)) * vol.fillna(0)).cumsum()

def mfi(h, l, c, vol, n=14):
    tp = (h + l + c) / 3
    rmf = tp * vol.fillna(0)
    pos = rmf.where(tp > tp.shift(1), 0.0)
    neg = rmf.where(tp < tp.shift(1), 0.0)
    mr = pos.rolling(n).sum() / neg.rolling(n).sum().replace(0, np.nan)
    return (100 - 100 / (1 + mr)).fillna(50)

def cmf(h, l, c, vol, n=20):
    mult = ((c - l) - (h - c)) / (h - l).replace(0, np.nan)
    mfv = (mult * vol).fillna(0)
    return mfv.rolling(n).sum() / vol.rolling(n).sum().replace(0, np.nan)

def session_vwap(h, l, c, vol, idx):
    tp = (h + l + c) / 3
    day = pd.Series(idx.date, index=c.index)
    grp = day.ne(day.shift()).cumsum()
    pv = (tp * vol.fillna(0)).groupby(grp).cumsum()
    vv = vol.fillna(0).groupby(grp).cumsum().replace(0, np.nan)
    return pv / vv

def pivots_lagged(h, l, left, right):
    """Pivots confirmés `right` bougies plus tard (aucun biais du futur)."""
    hh = h.to_numpy(); ll = l.to_numpy(); n = len(hh)
    last_ph = np.full(n, np.nan); last_pl = np.full(n, np.nan)
    cur_ph = np.nan; cur_pl = np.nan
    for i in range(n):
        p = i - right
        if p - left >= 0:
            if hh[p] == hh[p - left:p + right + 1].max():
                cur_ph = hh[p]
            if ll[p] == ll[p - left:p + right + 1].min():
                cur_pl = ll[p]
        last_ph[i] = cur_ph
        last_pl[i] = cur_pl
    return (pd.Series(last_ph, index=h.index), pd.Series(last_pl, index=h.index))

def clamp(s, lo, hi):
    return s.clip(lo, hi)

# --------------------------------------------------------------------------
# Calcul des familles (une seule fois) — renvoie un dict d'arrays numpy
# --------------------------------------------------------------------------
def build_features(df, inter=None, p=None):
    p = p or {}
    o, h, l, c = df["open"], df["high"], df["low"], df["close"]
    v = df.get("volume", pd.Series(0.0, index=df.index)).fillna(0.0)
    idx = df.index
    vol_available = bool(v.abs().sum() > 0)

    ema_f = ema(c, p.get("emaFast", 8))
    ema_m = ema(c, p.get("emaMid", 21))
    ema_s = ema(c, p.get("emaSlow", 50))
    ema_t = ema(c, p.get("emaTrend", 200))
    a = atr(h, l, c, p.get("atrLen", 14))
    a_avg = sma(a, p.get("atrRegime", 100))
    vol_ratio = (a / a_avg).replace([np.inf, -np.inf], np.nan).fillna(1.0)

    # ---------- TENDANCE ----------
    bull_stack = (ema_f > ema_m) & (ema_m > ema_s) & (c > ema_t)
    bear_stack = (ema_f < ema_m) & (ema_m < ema_s) & (c < ema_t)
    s_ribbon = np.where(bull_stack, 1.0, np.where(bear_stack, -1.0,
               np.where(c > ema_m, 0.4, np.where(c < ema_m, -0.4, 0.0))))
    s_super = np.where(supertrend(h, l, c).to_numpy() < 0, 1.0, -1.0)
    s_sar = np.where(c.to_numpy() > parabolic_sar(h, l).to_numpy(), 1.0, -1.0)
    s_ichi = ichimoku_score(h, l, c)
    pdi, mdi, adx = dmi(h, l, c, 14)
    s_adx = np.where(adx > 20, np.where(pdi > mdi, 1.0, -1.0),
                     np.where(pdi > mdi, 0.3, -0.3))
    s_lin = clamp(linreg_slope(c, 20) / (a * 0.15), -1, 1).fillna(0).to_numpy()
    dcU = h.rolling(20).max().shift(1)
    dcL = l.rolling(20).min().shift(1)
    s_donch = np.where(c >= dcU, 1.0, np.where(c <= dcL, -1.0, 0.0))

    # HTF trend (résample) — confirmations
    def htf_trend(rule, slow):
        r = c.resample(rule).last()
        e = ema(r, slow)
        sig = np.where(r > e, 1.0, np.where(r < e, -1.0, 0.0))
        return pd.Series(sig, index=r.index).reindex(idx, method="ffill").shift(1).fillna(0).to_numpy()
    s_htf1 = htf_trend(p.get("htf1", "15min"), p.get("emaSlow", 50))
    s_htf2 = htf_trend(p.get("htf2", "60min"), p.get("emaSlow", 50))

    trend = (s_ribbon + s_htf1 + s_htf2 + s_super + s_sar + s_ichi + s_adx + s_lin + s_donch) / 9.0

    # ---------- MOMENTUM ----------
    s_rsi = clamp((rsi(c, p.get("rsiLen", 14)) - 50) / 20, -1, 1).to_numpy()
    _, _, hist = macd(c)
    s_macd = np.where((hist > 0) & (hist > hist.shift(1)), 1.0,
             np.where((hist < 0) & (hist < hist.shift(1)), -1.0,
             np.where(hist > 0, 0.5, np.where(hist < 0, -0.5, 0.0))))
    s_stoch = clamp((stoch_k(h, l, c) - 50) / 30, -1, 1).fillna(0).to_numpy()
    s_cci = clamp(cci(h, l, c) / 150, -1, 1).fillna(0).to_numpy()
    s_wpr = clamp((williams_r(h, l, c) + 50) / 50, -1, 1).fillna(0).to_numpy()
    s_roc = clamp(roc(c) / 0.3, -1, 1).fillna(0).to_numpy()
    ao = sma((h + l) / 2, 5) - sma((h + l) / 2, 34)
    s_ao = np.where((ao > 0) & (ao > ao.shift(1)), 1.0,
           np.where((ao < 0) & (ao < ao.shift(1)), -1.0,
           np.where(ao > 0, 0.5, np.where(ao < 0, -0.5, 0.0))))
    mom = (s_rsi + s_macd + s_stoch + s_cci + s_wpr + s_roc + s_ao) / 7.0  # divergence omise (négligeable)

    # ---------- VOLATILITÉ (gating) ----------
    _, bbU, bbL = bollinger(c)
    _, kcU, kcL = keltner(h, l, c)
    squeeze = (bbU < kcU) & (bbL > kcL)
    vol_ok = (vol_ratio > 0.6) & (vol_ratio < 2.5)

    # ---------- VOLUME / FLUX ----------
    if vol_available:
        obv_slope = ema(obv(c, v), 10).diff()
        s_obv = np.where(obv_slope > 0, 1.0, np.where(obv_slope < 0, -1.0, 0.0))
        s_mfi = clamp((mfi(h, l, c, v) - 50) / 25, -1, 1).to_numpy()
        s_cmf = clamp(cmf(h, l, c, v) * 3, -1, 1).fillna(0).to_numpy()
        flow = (s_obv + s_mfi + s_cmf) / 3.0
        vol_part = clamp(v / sma(v, 20) - 1, -1, 1).fillna(0).to_numpy()
    else:
        flow = np.zeros(len(c)); vol_part = np.zeros(len(c))

    # ---------- NIVEAUX ----------
    vwap = session_vwap(h, l, c, v if vol_available else pd.Series(1.0, index=idx), idx)
    s_vwap = np.where(c > vwap, 1.0, np.where(c < vwap, -1.0, 0.0))
    daily = df.resample("1D").agg({"high": "max", "low": "min", "close": "last"})
    pdh = daily["high"].shift(1).reindex(idx, method="ffill")
    pdl = daily["low"].shift(1).reindex(idx, method="ffill")
    pdc = daily["close"].shift(1).reindex(idx, method="ffill")
    pivotP = (pdh + pdl + pdc) / 3
    s_pivot = np.where(c > pivotP, 0.5, -0.5)
    s_pdhl = np.where(c > pdh, 1.0, np.where(c < pdl, -1.0, 0.0))
    step = p.get("roundStep", 10.0)
    near_round = ((c - (c / step).round() * step).abs() < a * 0.15).to_numpy()
    level = (s_vwap + s_pivot + s_pdhl) / 3.0

    # ---------- STRUCTURE ----------
    last_ph, last_pl = pivots_lagged(h, l, p.get("pivotLen", 5), p.get("pivotLen", 5))
    s_bos = np.where((c > last_ph), 1.0, np.where((c < last_pl), -1.0, 0.0))
    ph_seq = last_ph.ffill(); pl_seq = last_pl.ffill()
    seq_up = (ph_seq > ph_seq.shift(20)) & (pl_seq > pl_seq.shift(20))
    seq_dn = (ph_seq < ph_seq.shift(20)) & (pl_seq < pl_seq.shift(20))
    s_seq = np.where(seq_up, 1.0, np.where(seq_dn, -1.0, 0.0))
    body = (c - o).abs()
    lw = pd.concat([o, c], axis=1).min(axis=1) - l
    uw = h - pd.concat([o, c], axis=1).max(axis=1)
    bull_eng = (c > o) & (c.shift(1) < o.shift(1)) & (c >= o.shift(1)) & (o <= c.shift(1))
    bear_eng = (c < o) & (c.shift(1) > o.shift(1)) & (c <= o.shift(1)) & (o >= c.shift(1))
    hammer = (body > 0) & (lw > body * 2) & (uw < body)
    star = (body > 0) & (uw > body * 2) & (lw < body)
    s_candle = np.where(bull_eng | hammer, 1.0, np.where(bear_eng | star, -1.0, 0.0))
    struct = (s_bos + s_seq + s_candle) / 3.0

    # ---------- INTER-MARCHÉS ----------
    inter = inter or {}
    inter_len = p.get("interLen", 10)
    def roc_sym(series, sign):
        s = series.reindex(idx, method="ffill")
        r = (s - s.shift(inter_len)) / s.shift(inter_len)
        return np.where(r > 0, sign, np.where(r < 0, -sign, 0.0))
    parts, cnt = [], 0
    for key, sign in [("dxy", -1.0), ("us10y", -1.0), ("silver", 1.0), ("spx", -0.5)]:
        series = inter.get(key)
        if series is not None:
            parts.append(np.nan_to_num(roc_sym(series, sign)))
            cnt += 1
    inter_score = (np.vstack(parts).sum(axis=0) / cnt) if cnt > 0 else np.zeros(len(c))
    # corrélation live or/DXY
    if inter.get("dxy") is not None:
        dxy = inter["dxy"].reindex(idx, method="ffill")
        corr = c.rolling(p.get("corrLen", 20)).corr(dxy)
        corr_strength = clamp(-corr, 0, 1).fillna(0.5).to_numpy()
    else:
        corr_strength = np.full(len(c), 0.5)

    # ---------- SESSIONS / NEWS ----------
    hours = idx.hour + idx.minute / 60.0
    in_london = (hours >= 7) & (hours < 16)
    in_ny = (hours >= 12) & (hours < 21)
    in_session = (in_london | in_ny) if p.get("useSessions", True) else np.ones(len(c), bool)
    overlap = in_london & in_ny
    mins_now = idx.hour * 60 + idx.minute
    news_target = p.get("newsHour", 12) * 60 + p.get("newsMin", 30)
    in_news = (np.abs(mins_now - news_target) <= p.get("newsPad", 15)) if p.get("useNews", True) else np.zeros(len(c), bool)

    # ---------- multiplicateurs de contexte (indépendants des poids) ----------
    sess_mult = np.where(in_session, np.where(overlap, 1.0, 0.85), 0.45)
    vol_mult = np.where(vol_ok, 1.0, np.where(vol_ratio <= 0.6, 0.6, 0.75))
    adx_mult = np.where(adx > 25, 1.1, np.where(adx < 18, 0.75, 1.0))
    part_mult = clamp(pd.Series(0.85 + vol_part * 0.3), 0.7, 1.15).to_numpy() if vol_available else np.ones(len(c))
    squeeze_mult = np.where(squeeze, 0.7, 1.0)
    round_mult = np.where(near_round, 0.85, 1.0)
    inter_mult = clamp(pd.Series(0.85 + corr_strength * 0.3), 0.85, 1.15).to_numpy() if cnt > 0 else np.ones(len(c))
    context_mult = sess_mult * vol_mult * adx_mult * part_mult * squeeze_mult * round_mult * inter_mult

    return {
        "index": idx,
        "open": o.to_numpy(), "high": h.to_numpy(), "low": l.to_numpy(), "close": c.to_numpy(),
        "atr": a.to_numpy(),
        "families": {
            "trend": np.nan_to_num(trend if isinstance(trend, np.ndarray) else trend.to_numpy()),
            "mom": np.nan_to_num(mom if isinstance(mom, np.ndarray) else mom.to_numpy()),
            "flow": np.nan_to_num(flow),
            "level": np.nan_to_num(level),
            "struct": np.nan_to_num(struct),
            "inter": np.nan_to_num(inter_score),
        },
        "inter_active": cnt > 0,
        "vol_available": vol_available,
        "context_mult": np.nan_to_num(context_mult, nan=1.0),
        "in_session": in_session, "in_news": in_news, "vol_ok": vol_ok.to_numpy(),
    }

FAMILY_ORDER = ["trend", "mom", "flow", "level", "struct", "inter"]

def compose(feat, weights):
    """Combine les familles avec des poids -> biais (-100..100) et confiance (0..100)."""
    fam = feat["families"]
    w = np.array([
        weights.get("trend", 0.0),
        weights.get("mom", 0.0),
        weights.get("flow", 0.0) if feat["vol_available"] else 0.0,
        weights.get("level", 0.0),
        weights.get("struct", 0.0),
        weights.get("inter", 0.0) if feat["inter_active"] else 0.0,
    ], float)
    mat = np.vstack([fam[k] for k in FAMILY_ORDER])       # 6 x N
    wtot = w.sum()
    if wtot <= 0:
        n = mat.shape[1]
        return np.zeros(n), np.zeros(n)
    bias = np.round((w[:, None] * mat).sum(axis=0) / wtot * 100)
    dir_sign = np.sign(bias)
    active = w > 0
    fam_sign = np.sign(mat)
    agree = ((fam_sign == dir_sign[None, :]) & (mat != 0) & active[:, None]).sum(axis=0)
    n_active = max(int(active.sum()), 1)
    agree_ratio = agree / n_active
    conf = np.clip(np.abs(bias) * (0.5 + 0.5 * agree_ratio) * feat["context_mult"], 0, 100)
    return bias, np.round(conf)
