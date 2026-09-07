export function applyFilters(events, { minMag, search, types, minImpact }) {
  const term = (search ?? "").trim().toLowerCase();

  return events.filter((e) => {
    if (types && types.length > 0 && !types.includes(e.type)) return false;
    if (minImpact != null && e.impactScore < minImpact) return false;

    if (e.type === "earthquake" && e.magnitude != null) {
      if (e.magnitude < (minMag ?? 0)) return false;
    }

    if (term && !e.title.toLowerCase().includes(term)) return false;
    return true;
  });
}

export function computeStats(events) {
  if (events.length === 0) {
    return { count: 0, max: "—", avgDepth: "—", quakes: 0 };
  }

  const quakes = events.filter((e) => e.magnitude != null);
  const withDepth = events.filter((e) => e.depth != null);

  const max = quakes.length
    ? Math.max(...quakes.map((e) => e.magnitude)).toFixed(1)
    : "—";

  const avg = withDepth.length
    ? withDepth.reduce((s, e) => s + e.depth, 0) / withDepth.length
    : null;

  return {
    count: events.length,
    max,
    avgDepth: avg != null ? `${avg.toFixed(0)} km` : "—",
    quakes: quakes.length,
  };
}

export function countByType(events) {
  const counts = {};
  for (const e of events) counts[e.type] = (counts[e.type] ?? 0) + 1;
  return counts;
}