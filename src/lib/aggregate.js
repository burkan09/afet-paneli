export function byTimeBucket(events, range) {
  if (events.length === 0) return [];

  const bucketMs = range === "hour" ? 300000 : range === "day" ? 3600000 : 86400000;
  const buckets = new Map();

  for (const e of events) {
    const key = Math.floor(e.time / bucketMs) * bucketMs;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([time, count]) => ({ time, count }));
}

export function byMagnitudeBand(events) {
  const bands = [
    { label: "0-2", min: 0, max: 2 },
    { label: "2-3", min: 2, max: 3 },
    { label: "3-4", min: 3, max: 4 },
    { label: "4-5", min: 4, max: 5 },
    { label: "5-6", min: 5, max: 6 },
    { label: "6+", min: 6, max: Infinity },
  ];

  return bands.map((b) => ({
    label: b.label,
    count: events.filter((e) => e.magnitude >= b.min && e.magnitude < b.max)
      .length,
  }));
}

export function depthVsMagnitude(events) {
  return events
    .filter((e) => e.depth != null && e.depth >= 0)
    .map((e) => ({
      depth: Number(e.depth.toFixed(1)),
      magnitude: Number(e.magnitude.toFixed(1)),
    }));
}