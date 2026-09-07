import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const MIN_MAGNITUDE = 4.5;
const START_YEAR = 2000;
const OUT = path.join("public", "seismicity.json");

async function fetchRange(start, end) {
  const params = new URLSearchParams({
    format: "geojson",
    starttime: start,
    endtime: end,
    minmagnitude: String(MIN_MAGNITUDE),
    orderby: "time",
    limit: "20000",
  });

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`${start} alinamadi (HTTP ${res.status})`);
  const json = await res.json();
  return json.features ?? [];
}

function compact(features) {
  return features
    .filter((f) => f?.geometry?.coordinates && f?.properties?.mag != null)
    .map((f) => {
      const [lon, lat, depth] = f.geometry.coordinates;
      return [
        Number(lat.toFixed(2)),
        Number(lon.toFixed(2)),
        Number(f.properties.mag.toFixed(1)),
        Math.round(f.properties.time / 86400000),
        Math.round(depth ?? 0),
      ];
    });
}

async function main() {
  const thisYear = new Date().getFullYear();
  const all = [];

  for (let y = START_YEAR; y <= thisYear; y++) {
    process.stdout.write(`${y} `);
    const rows = compact(await fetchRange(`${y}-01-01`, `${y + 1}-01-01`));
    all.push(...rows);
    await new Promise((r) => setTimeout(r, 600));
  }

  all.sort((a, b) => a[3] - b[3]);

  await fs.mkdir("public", { recursive: true });
  const text = JSON.stringify(all);
  await fs.writeFile(OUT, text);

  console.log(
    `\n${all.length} nokta · ${Math.round(text.length / 1024)} KB · ${OUT}`
  );
}

main().catch((err) => {
  console.error("\nHata:", err.message);
  process.exit(1);
});