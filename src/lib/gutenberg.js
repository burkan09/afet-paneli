export function magnitudeCounts(points, step = 0.5, minMag = 4.5) {
  const bins = new Map();

  for (const p of points) {
    const mag = p[2];
    if (mag < minMag) continue;
    const bin = Math.floor(mag / step) * step;
    bins.set(bin, (bins.get(bin) ?? 0) + 1);
  }

  return [...bins.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([mag, count]) => ({ mag, count }));
}

export function cumulativeCounts(counts) {
  const out = [];
  let running = 0;

  for (let i = counts.length - 1; i >= 0; i--) {
    running += counts[i].count;
    out.unshift({
      mag: counts[i].mag,
      n: running,
      logN: Math.log10(running),
    });
  }

  return out;
}

export function fitGutenbergRichter(cumulative, minMag = 4.5, maxMag = 8) {
  const pts = cumulative.filter(
    (d) => d.mag >= minMag && d.mag <= maxMag && d.n > 0
  );

  if (pts.length < 3) return null;

  const n = pts.length;
  const sx = pts.reduce((s, d) => s + d.mag, 0);
  const sy = pts.reduce((s, d) => s + d.logN, 0);
  const sxy = pts.reduce((s, d) => s + d.mag * d.logN, 0);
  const sxx = pts.reduce((s, d) => s + d.mag * d.mag, 0);

  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;

  const meanY = sy / n;
  const ssTot = pts.reduce((s, d) => s + (d.logN - meanY) ** 2, 0);
  const ssRes = pts.reduce(
    (s, d) => s + (d.logN - (intercept + slope * d.mag)) ** 2,
    0
  );

  return {
    a: intercept,
    b: -slope,
    r2: ssTot === 0 ? 0 : 1 - ssRes / ssTot,
    points: pts,
  };
}

export function expectedCount(fit, magnitude) {
  if (!fit) return null;
  return Math.pow(10, fit.a - fit.b * magnitude);
}

export function recurrenceYears(fit, magnitude, catalogYears) {
  const n = expectedCount(fit, magnitude);
  if (!n || n <= 0) return null;
  return catalogYears / n;
}