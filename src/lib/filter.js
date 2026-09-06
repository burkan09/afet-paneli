export function applyFilters(events, { minMag, search }) {
  const term = search.trim().toLowerCase();

  return events.filter((e) => {
    if (e.magnitude < minMag) return false;
    if (term && !e.title.toLowerCase().includes(term)) return false;
    return true;
  });
}

export function computeStats(events) {
  if (events.length === 0) {
    return { count: 0, max: "—", avgDepth: "—" };
  }

  const max = Math.max(...events.map((e) => e.magnitude));
  const withDepth = events.filter((e) => e.depth != null);
  const avg =
    withDepth.reduce((sum, e) => sum + e.depth, 0) / (withDepth.length || 1);

  return {
    count: events.length,
    max: max.toFixed(1),
    avgDepth: withDepth.length ? `${avg.toFixed(0)} km` : "—",
  };
}