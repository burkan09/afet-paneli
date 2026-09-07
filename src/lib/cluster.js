import { latLngToCell, cellToLatLng } from "h3-js";

export function resolutionForAltitude(altitude) {
  if (altitude > 2.0) return 1;
  if (altitude > 1.2) return 2;
  if (altitude > 0.7) return 3;
  if (altitude > 0.35) return 4;
  return 5;
}
export function binPoints(points, resolution, weightBy = "count") {
  const bins = new Map();

  for (const [lat, lon, mag] of points) {
    const cell = latLngToCell(lat, lon, resolution);
    const current = bins.get(cell);
    const weight = weightBy === "energy" ? Math.pow(10, 1.5 * mag + 4.8) : 1;

    if (current) {
      current.count += 1;
      current.weight += weight;
      if (mag > current.maxMag) current.maxMag = mag;
    } else {
      bins.set(cell, { cell, count: 1, weight, maxMag: mag });
    }
  }

  return [...bins.values()].map((b) => {
    const [lat, lng] = cellToLatLng(b.cell);
    return { ...b, lat, lng };
  });
}

export function topBins(bins, limit = 10) {
  return [...bins].sort((a, b) => b.count - a.count).slice(0, limit);
}

export function sample(points, maxCount) {
  if (points.length <= maxCount) return points;

  const step = Math.ceil(points.length / maxCount);
  const out = [];
  for (let i = 0; i < points.length; i += step) out.push(points[i]);
  return out;
}

export function throttle(fn, ms) {
  let last = 0;
  let timer = null;

  return (...args) => {
    const now = Date.now();
    const remaining = ms - (now - last);

    if (remaining <= 0) {
      clearTimeout(timer);
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}