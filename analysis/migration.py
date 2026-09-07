"""Fay boyunca göç analizi + permütasyon testi."""
import json
import sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from faults import FAULTS
from geo import project_on_line, line_length

IN = ROOT / "analysis" / "data" / "catalog.json"
OUT = ROOT / "public" / "analysis" / "migration.json"

DEFAULT_MIN_MAG = 6.0
N_PERMUTATIONS = 5000
RNG = np.random.default_rng(42)


def to_year(ms):
    return 1970 + ms / (365.25 * 86_400_000)


def select_events(rows, fault, min_mag):
    line = fault["line"]
    half = fault["half_width_km"]
    yr = fault.get("year_range")
    out = []

    for r in rows:
        if r["mag"] < min_mag:
            continue

        year = to_year(r["time"])
        if yr and not (yr[0] <= year <= yr[1]):
            continue

        along, perp = project_on_line(r["lat"], r["lon"], line)
        if along is None or perp > half:
            continue

        out.append({
            "along": round(along, 1),
            "perp": round(perp, 1),
            "mag": r["mag"],
            "time": r["time"],
            "year": round(year, 2),
            "lat": r["lat"],
            "lon": r["lon"],
        })

    out.sort(key=lambda e: e["time"])
    return out


def permutation_test(years, along, n=N_PERMUTATIONS):
    if len(years) < 5:
        return None

    observed = float(np.corrcoef(years, along)[0, 1])
    shuffled = along.copy()
    count = 0

    for _ in range(n):
        RNG.shuffle(shuffled)
        if abs(np.corrcoef(years, shuffled)[0, 1]) >= abs(observed):
            count += 1

    return {
        "r": round(observed, 4),
        "p": round((count + 1) / (n + 1), 5),
        "n_permutations": n,
    }


def analyse(rows, key, fault):
    min_mag = fault.get("min_magnitude", DEFAULT_MIN_MAG)
    events = select_events(rows, fault, min_mag)

    if len(events) < 5:
        return None

    years = np.array([e["year"] for e in events])
    along = np.array([e["along"] for e in events])

    slope, intercept = np.polyfit(years, along, 1)
    pred = intercept + slope * years
    ss_res = float(((along - pred) ** 2).sum())
    ss_tot = float(((along - along.mean()) ** 2).sum())

    gaps = np.diff(np.sort(years))

    return {
        "key": key,
        "label": fault["label"],
        "note": fault.get("note"),
        "line": [[lat, lon] for lat, lon in fault["line"]],
        "length_km": round(line_length(fault["line"]), 1),
        "min_magnitude": min_mag,
        "year_range": list(fault["year_range"]) if fault.get("year_range") else None,
        "n": len(events),
        "events": events,
        "migration": {
            "velocity_km_per_year": round(float(slope), 2),
            "direction": "batı" if slope > 0 else "doğu",
            "r2": round(1 - ss_res / ss_tot if ss_tot else 0, 4),
            "intercept": round(float(intercept), 1),
        },
        "significance": permutation_test(years, along),
        "recurrence": {
            "mean_gap_years": round(float(gaps.mean()), 2) if len(gaps) else None,
            "std_gap_years": round(float(gaps.std()), 2) if len(gaps) else None,
            "max_gap_years": round(float(gaps.max()), 2) if len(gaps) else None,
            "years_since_last": round(float(to_year(max(e["time"] for e in events))), 2),
        },
    }


def main():
    rows = json.loads(IN.read_text(encoding="utf-8"))
    OUT.parent.mkdir(parents=True, exist_ok=True)

    result = {}
    for key, fault in FAULTS.items():
        r = analyse(rows, key, fault)
        if not r:
            print(f"{fault['label']:24s} yetersiz veri")
            continue

        result[key] = r
        m, s = r["migration"], r["significance"]
        win = f"{r['year_range'][0]}-{r['year_range'][1]}" if r["year_range"] else "tümü"
        print(
            f"{fault['label']:24s} M{m and r['min_magnitude']:.1f}+ {win:10s} "
            f"n={r['n']:3d}  {m['velocity_km_per_year']:+7.2f} km/yıl {m['direction']:5s} "
            f"R²={m['r2']:.3f}  p={s['p']:.4f}"
        )

    OUT.write_text(json.dumps(result), encoding="utf-8")
    print(f"\n→ {OUT}")


if __name__ == "__main__":
    main()