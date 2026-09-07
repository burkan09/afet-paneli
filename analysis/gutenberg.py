"""Gutenberg-Richter uyumu: global ve bolge bazli."""
import json
from pathlib import Path
import numpy as np

IN = Path("analysis/data/catalog.json")
OUT = Path("public/analysis/gutenberg.json")

REGIONS = {
    "global": None,
    "turkiye": (35.0, 43.0, 25.0, 45.0),
    "yunanistan": (34.0, 42.0, 19.0, 29.0),
    "italya": (36.0, 47.0, 6.0, 19.0),
    "izlanda": (63.0, 67.0, -25.0, -13.0),
    "iran": (25.0, 40.0, 44.0, 64.0),
    "afganistan": (29.0, 39.0, 60.0, 75.0),
    "himalaya": (26.0, 36.0, 72.0, 96.0),
    "japonya": (30.0, 46.0, 129.0, 146.0),
    "tayvan": (21.0, 26.0, 119.0, 123.0),
    "filipinler": (5.0, 20.0, 117.0, 127.0),
    "endonezya": (-11.0, 6.0, 95.0, 141.0),
    "papua": (-11.0, -1.0, 130.0, 156.0),
    "kamcatka": (50.0, 62.0, 155.0, 170.0),
    "yeni_zelanda": (-48.0, -34.0, 165.0, 180.0),
    "alaska": (51.0, 72.0, -170.0, -130.0),
    "kaliforniya": (32.0, 42.0, -125.0, -114.0),
    "meksika": (14.0, 33.0, -118.0, -86.0),
    "karayipler": (10.0, 20.0, -85.0, -60.0),
    "peru": (-19.0, -3.0, -82.0, -68.0),
    "sili": (-56.0, -17.0, -76.0, -66.0),
    "dogu_afrika": (-12.0, 15.0, 28.0, 42.0),
}

def in_box(rows, box):
    if box is None:
        return rows
    lat0, lat1, lon0, lon1 = box
    return [r for r in rows
            if lat0 <= r["lat"] <= lat1 and lon0 <= r["lon"] <= lon1]


def fit(rows, min_mag=4.5, max_mag=8.0, step=0.5):
    if len(rows) < 50:
        return None

    mags = np.array([r["mag"] for r in rows])
    edges = np.arange(min_mag, max_mag + step, step)

    # birikimli sayim: M >= edge olan olay sayisi
    counts = np.array([(mags >= e).sum() for e in edges], dtype=float)
    mask = counts > 0
    x, y = edges[mask], np.log10(counts[mask])

    if len(x) < 3:
        return None

    slope, intercept = np.polyfit(x, y, 1)
    pred = intercept + slope * x
    ss_res = float(((y - pred) ** 2).sum())
    ss_tot = float(((y - y.mean()) ** 2).sum())

    times = np.array([r["time"] for r in rows], dtype=np.int64)
    years = (times.max() - times.min()) / (365.25 * 86_400_000)

    b = float(-slope)
    a = float(intercept)

    return {
        "a": round(a, 4),
        "b": round(b, 4),
        "r2": round(1 - ss_res / ss_tot if ss_tot else 0, 5),
        "n": len(rows),
        "years": round(float(years), 1),
        "curve": [
            {"mag": float(m), "logN": round(float(v), 4),
             "fitted": round(a - b * float(m), 4)}
            for m, v in zip(x, y)
        ],
        "recurrence": {
            f"M{m}": round(years / (10 ** (a - b * m)), 2)
            for m in (6.0, 6.5, 7.0, 7.5, 8.0)
        },
    }


def main() -> None:
    rows = json.loads(IN.read_text(encoding="utf-8"))
    OUT.parent.mkdir(parents=True, exist_ok=True)

    result = {}
    for name, box in REGIONS.items():
        subset = in_box(rows, box)
        f = fit(subset)
        if f:
            result[name] = f
            print(f"{name:14s} b={f['b']:.3f}  R²={f['r2']:.4f}  n={f['n']}")

    OUT.write_text(json.dumps(result, indent=1), encoding="utf-8")
    print(f"\n→ {OUT}")


if __name__ == "__main__":
    main()