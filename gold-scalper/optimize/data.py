"""
Chargement des données : CSV local OU yfinance (chez toi, où Internet marche).

Colonnes CSV attendues (séparateur , ) : datetime, open, high, low, close, volume
`datetime` en UTC de préférence (ISO 8601). L'index est traité en UTC.
"""
from __future__ import annotations
import pandas as pd


def load_csv(path, tz="UTC"):
    df = pd.read_csv(path)
    cols = {c.lower(): c for c in df.columns}
    tcol = cols.get("datetime") or cols.get("date") or cols.get("time") or df.columns[0]
    df.index = pd.to_datetime(df[tcol], utc=True)
    df = df.rename(columns={cols.get(k, k): k for k in ["open", "high", "low", "close", "volume"] if cols.get(k)})
    keep = [c for c in ["open", "high", "low", "close", "volume"] if c in df.columns]
    df = df[keep].sort_index()
    if "volume" not in df.columns:
        df["volume"] = 0.0
    return df.tz_convert(tz).tz_localize(None)


def _yf(symbol, interval, period):
    import yfinance as yf
    d = yf.download(symbol, interval=interval, period=period, progress=False, auto_adjust=False)
    if d is None or len(d) == 0:
        return None
    if isinstance(d.columns, pd.MultiIndex):
        d.columns = d.columns.get_level_values(0)
    d.index = pd.to_datetime(d.index, utc=True).tz_localize(None)
    d = d.rename(columns=str.lower)
    return d


def fetch_yf(tf="5m", period="60d", gold="GC=F",
             dxy="DX-Y.NYB", us10y="^TNX", silver="SI=F", spx="^GSPC",
             use_dxy=True, use_yields=True, use_silver=True, use_spx=False):
    """Télécharge l'or + les marchés liés. Renvoie (df_or, inter dict de close)."""
    g = _yf(gold, tf, period)
    if g is None:
        raise RuntimeError(f"Aucune donnée pour {gold} ({tf}, {period}).")
    df = g[["open", "high", "low", "close", "volume"]].copy()
    inter = {}
    for key, sym, use in [("dxy", dxy, use_dxy), ("us10y", us10y, use_yields),
                          ("silver", silver, use_silver), ("spx", spx, use_spx)]:
        if not use:
            continue
        s = _yf(sym, tf, period)
        if s is not None and "close" in s.columns:
            inter[key] = s["close"]
    return df, inter
