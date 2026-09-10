"""Ulke bazli Gutenberg-Richter analizi."""
import json
from pathlib import Path
import numpy as np
from shapely.geometry import shape, Point
from shapely.strtree import STRtree

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "analysis" / "data" / "catalog.json"
COUNTRIES = ROOT / "analysis" / "data" / "countries.geojson"
OUT = ROOT / "public" / "analysis" / "gutenberg.json"

MIN_EVENTS = 300
MIN_MAG = 8
MAX_MAG = 8.5
STEP = 0.5


def load_countries():
    data = json.loads(COUNTRIES.read_text(encoding="utf-8"))
    geoms, names = [], []

    for f in data["features"]:
        props = f.get("properties", {})
        name = props.get("ADMIN") or props.get("name") or props.get("NAME")
        if not name or not f.get("geometry"):
            continue
        geoms.append(shape(f["geometry"]))
        names.append(name)

    return geoms, names, STRtree(geoms)


def assign_countries(rows, geoms, names, tree):
    buckets = {}
    unassigned = 0

    for i, r in enumerate(rows):
        if i % 50000 == 0:
            print(f"  {i}/{len(rows)}", flush=True)

        p = Point(r["lon"], r["lat"])
        hit = None
        for idx in tree.query(p):
            if geoms[idx].contains(p):
                hit = names[idx]
                break

        if hit is None:
            near = tree.query_nearest(p, max_distance=3.0)
            if len(near):
                idx = int(near[0])
                hit = names[idx]
            else:
                unassigned += 1
                continue
        buckets.setdefault(hit, []).append(r)

    print(f"  denizde/atanamayan: {unassigned}")
    return buckets


def fit(rows):
    if len(rows) < MIN_EVENTS:
        return None

    mags = np.array([r["mag"] for r in rows])
    edges = np.arange(MIN_MAG, MAX_MAG + STEP, STEP)
    counts = np.array([(mags >= e).sum() for e in edges], dtype=float)

    mask = counts > 0
    x, y = edges[mask], np.log10(counts[mask])
    if len(x) < 4:
        return None

    slope, intercept = np.polyfit(x, y, 1)
    pred = intercept + slope * x
    ss_res = float(((y - pred) ** 2).sum())
    ss_tot = float(((y - y.mean()) ** 2).sum())

    times = np.array([r["time"] for r in rows], dtype=np.int64)
    years = (times.max() - times.min()) / (365.25 * 86_400_000)

    a, b = float(intercept), float(-slope)

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


def main():
    rows = json.loads(CATALOG.read_text(encoding="utf-8"))
    print(f"{len(rows)} deprem yuklendi")

    geoms, names, tree = load_countries()
    print(f"{len(names)} ulke poligonu yuklendi")

    print("ulkelere ataniyor...")
    buckets = assign_countries(rows, geoms, names, tree)

    result = {"global": fit(rows)}
    for name, subset in buckets.items():
        f = fit(subset)
        if f:
            result[name] = f

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result), encoding="utf-8")

    ranked = sorted(
        ((k, v) for k, v in result.items() if k != "global"),
        key=lambda kv: kv[1]["b"],
    )
    print(f"\n{len(ranked)} ulke analiz edildi\n")
    print("--- en dusuk b (kilitli fay) ---")
    for k, v in ranked[:8]:
        print(f"  {k:22s} b={v['b']:.3f}  n={v['n']:6d}")
    print("--- en yuksek b ---")
    for k, v in ranked[-8:]:
        print(f"  {k:22s} b={v['b']:.3f}  n={v['n']:6d}")
    print(f"\n→ {OUT}")


if __name__ == "__main__":
    main()