"""USGS katalogunu indirir ve tek bir parquet/json dosyasina yazar."""
import json
import time
from pathlib import Path
import requests

BASE = "https://earthquake.usgs.gov/fdsnws/event/1/query"
MIN_MAG = 4.5
START_YEAR = 1900
OUT = Path("analysis/data/catalog.json")


def fetch_year(year: int) -> list:
    params = {
        "format": "geojson",
        "starttime": f"{year}-01-01",
        "endtime": f"{year + 1}-01-01",
        "minmagnitude": MIN_MAG,
        "orderby": "time",
        "limit": 20000,
    }
    r = requests.get(BASE, params=params, timeout=60)
    r.raise_for_status()
    return r.json().get("features", [])


def compact(features: list) -> list:
    rows = []
    for f in features:
        geo = f.get("geometry") or {}
        props = f.get("properties") or {}
        coords = geo.get("coordinates")
        mag = props.get("mag")
        if not coords or mag is None:
            continue
        lon, lat, depth = coords[0], coords[1], coords[2] or 0
        rows.append({
            "lat": round(lat, 3),
            "lon": round(lon, 3),
            "mag": round(mag, 1),
            "time": props.get("time"),
            "depth": round(depth, 1),
        })
    return rows


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    all_rows = []

    for year in range(START_YEAR, 2027):
        print(year, end=" ", flush=True)
        all_rows.extend(compact(fetch_year(year)))
        time.sleep(0.5)

    all_rows.sort(key=lambda r: r["time"])
    OUT.write_text(json.dumps(all_rows), encoding="utf-8")

    mb = OUT.stat().st_size / 1_048_576
    print(f"\n{len(all_rows)} kayit · {mb:.1f} MB · {OUT}")


if __name__ == "__main__":
    main()