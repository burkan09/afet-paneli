import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const MIN_MAGNITUDE = 4.5;
const YEARS_BACK = 20;
const OUT = path.join("public", "seismicity.json");

async function fetchYear(year) {
  const params = new URLSearchParams({
    format: "geojson",
    starttime: `${year}-01-01`,
    endtime: `${year + 1}-01-01`,
    minmagnitude: String(MIN_MAGNITUDE),
    orderby: "time",
    limit: "20000",
  });

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`${year} yili alinamadi (HTTP ${res.status})`);

  const json = await res.json();
  return json.features ?? [];
}

function compact(features) {
  return features
    .filter((f) => f?.geometry?.coordinates && f?.properties?.mag != null)
    .map((f) => {
      const [lon, lat] = f.geometry.coordinates;
      return [
        Number(lat.toFixed(2)),
        Number(lon.toFixed(2)),
        Number(f.properties.mag.toFixed(1)),
      ];
    });
}

async function main() {
  const thisYear = new Date().getFullYear();
  const all = [];

  for (let y = thisYear - YEARS_BACK; y <= thisYear; y++) {
    process.stdout.write(`${y} cekiliyor... `);
    const features = await fetchYear(y);
    const rows = compact(features);
    all.push(...rows);
    console.log(`${rows.length} kayit`);
    await new Promise((r) => setTimeout(r, 800));
  }

  await fs.mkdir("public", { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(all));

  const kb = Math.round(JSON.stringify(all).length / 1024);
  console.log(`\nToplam ${all.length} nokta, ${kb} KB -> ${OUT}`);
}

main().catch((err) => {
  console.error("Hata:", err.message);
  process.exit(1);
});