import { haversine } from "./distance";

const HOUR = 3600000;

export function findNearbyEvents(target, all, { km = 500, hours = 72 } = {}) {
  const windowMs = hours * HOUR;
  const out = [];

  for (const e of all) {
    if (e.id === target.id) continue;

    const dt = e.time - target.time;
    if (dt < 0 || dt > windowMs) continue;

    const dist = haversine(target.lat, target.lon, e.lat, e.lon);
    if (dist > km) continue;

    out.push({ ...e, distanceKm: Math.round(dist), hoursAfter: dt / HOUR });
  }

  return out.sort((a, b) => a.hoursAfter - b.hoursAfter);
}

export function baselineRate(history, lat, lon, km, catalogYears) {
  let count = 0;

  for (const p of history) {
    if (haversine(lat, lon, p[0], p[1]) <= km) count += 1;
  }

  return {
    total: count,
    perYear: count / catalogYears,
    perDay: count / (catalogYears * 365.25),
  };
}

export function assessCluster(observed, baseline, hours) {
  const expected = baseline.perDay * (hours / 24);

  if (expected <= 0) {
    return { expected: 0, observed, ratio: null, verdict: "veri yok" };
  }

  const ratio = observed / expected;

  let verdict;
  if (observed === 0) verdict = "olay yok";
  else if (ratio >= 5) verdict = "belirgin artış";
  else if (ratio >= 2) verdict = "hafif artış";
  else if (ratio >= 0.5) verdict = "normal seviye";
  else verdict = "normalin altında";

  return {
    expected: Number(expected.toFixed(2)),
    observed,
    ratio: Number(ratio.toFixed(2)),
    verdict,
  };
}