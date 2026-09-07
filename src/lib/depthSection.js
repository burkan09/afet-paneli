import { haversine } from "./distance";

export const SECTION_PRESETS = {
  japonya: {
    label: "Japonya Hendeği",
    from: [38.0, 145.5],
    to: [38.0, 136.0],
    halfWidthKm: 250,
  },
  sili: {
    label: "Şili (Nazca dalması)",
    from: [-22.0, -72.5],
    to: [-22.0, -64.0],
    halfWidthKm: 250,
  },
  tonga: {
    label: "Tonga Hendeği",
    from: [-20.0, -172.0],
    to: [-20.0, -178.0],
    halfWidthKm: 300,
  },
  sumatra: {
    label: "Sumatra (Sunda dalması)",
    from: [-2.0, 99.0],
    to: [-2.0, 106.0],
    halfWidthKm: 250,
  },
  kuril: {
    label: "Kuril Hendeği",
    from: [47.0, 155.0],
    to: [47.0, 146.0],
    halfWidthKm: 250,
  },
  anadolu: {
    label: "Anadolu (kıtasal)",
    from: [42.0, 33.0],
    to: [36.0, 33.0],
    halfWidthKm: 250,
  },
};

export function projectSection(points, preset) {
  const { from, to, halfWidthKm } = preset;
  const total = haversine(from[0], from[1], to[0], to[1]);
  if (total === 0) return [];

  const out = [];

  for (const [lat, lon, mag, , depth] of points) {
    const dFrom = haversine(from[0], from[1], lat, lon);
    const dTo = haversine(to[0], to[1], lat, lon);

    // kesit ekseni dışındakileri hızlıca ele
    if (dFrom > total + halfWidthKm || dTo > total + halfWidthKm) continue;

    // kosinüs teoremiyle eksen üzerindeki izdüşüm
    const along = (dFrom ** 2 - dTo ** 2 + total ** 2) / (2 * total);
    if (along < 0 || along > total) continue;

    const perpSq = dFrom ** 2 - along ** 2;
    const perp = perpSq > 0 ? Math.sqrt(perpSq) : 0;
    if (perp > halfWidthKm) continue;

    out.push({
      distance: Math.round(along),
      depth: depth ?? 0,
      mag,
      size: Math.max(6, (mag - 4) ** 2 * 14),
    });
  }

  return out;
}

export function sectionStats(rows) {
  if (rows.length === 0) return null;

  const deep = rows.filter((r) => r.depth > 300).length;
  const mid = rows.filter((r) => r.depth > 70 && r.depth <= 300).length;
  const shallow = rows.filter((r) => r.depth <= 70).length;
  const maxDepth = Math.max(...rows.map((r) => r.depth));

  return { total: rows.length, shallow, mid, deep, maxDepth };
}