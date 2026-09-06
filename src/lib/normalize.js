export function normalizeUsgs(feature) {
  const [lon, lat, depth] = feature.geometry.coordinates;
  const p = feature.properties;

  return {
    id: `usgs_${feature.id}`,
    source: "usgs",
    type: "earthquake",
    title: p.place ?? "Bilinmeyen konum",
    lat,
    lon,
    time: p.time,
    magnitude: p.mag,
    depth,
    alertLevel: p.alert ?? null,
    url: p.url,
    links: [],
    isLive: true,
  };
}

export function normalizeUsgsCollection(json) {
  const features = json?.features ?? [];
  return features
    .filter((f) => f?.geometry?.coordinates && f?.properties?.mag != null)
    .map(normalizeUsgs);
}