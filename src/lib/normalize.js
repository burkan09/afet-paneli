import { computeImpact } from "./impact";

const LIVE_WINDOW = 7 * 86400000;

function finalize(event) {
  return {
    links: [],
    ...event,
    impactScore: computeImpact(event),
    isLive: Date.now() - event.time < LIVE_WINDOW,
  };
}

export function normalizeUsgs(feature) {
  const [lon, lat, depth] = feature.geometry.coordinates;
  const p = feature.properties;

  return finalize({
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
  });
}

export function normalizeUsgsCollection(json) {
  const features = json?.features ?? [];
  return features
    .filter((f) => f?.geometry?.coordinates && f?.properties?.mag != null)
    .map(normalizeUsgs);
}

const EONET_TYPES = {
  landslides: "landslide",
  floods: "flood",
  wildfires: "wildfire",
  severeStorms: "storm",
  volcanoes: "volcano",
  earthquakes: "earthquake",
  seaLakeIce: "ice",
  drought: "drought",
  dustHaze: "dust",
};

export function normalizeEonetCollection(json) {
  const events = json?.events ?? [];
  const out = [];

  for (const e of events) {
    const geo = e.geometry?.[e.geometry.length - 1];
    if (!geo?.coordinates) continue;

    const coords =
      geo.type === "Point" ? geo.coordinates : geo.coordinates?.[0]?.[0];
    if (!Array.isArray(coords) || coords.length < 2) continue;

    const categoryId = e.categories?.[0]?.id;

    out.push(
      finalize({
        id: `eonet_${e.id}`,
        source: "eonet",
        type: EONET_TYPES[categoryId] ?? "other",
        title: e.title,
        lat: coords[1],
        lon: coords[0],
        time: new Date(geo.date).getTime(),
        magnitude: null,
        depth: null,
        alertLevel: null,
        url: e.link,
        links: (e.sources ?? []).map((s) => ({
          title: s.id,
          source: s.id,
          url: s.url,
        })),
      })
    );
  }

  return out;
}

const GDACS_TYPES = {
  EQ: "earthquake",
  TC: "storm",
  FL: "flood",
  VO: "volcano",
  WF: "wildfire",
  DR: "drought",
  TS: "tsunami",
};

export function normalizeGdacsCollection(json) {
  const features = json?.features ?? [];
  const out = [];

  for (const f of features) {
    const coords = f?.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) continue;

    const p = f.properties ?? {};
    const time = new Date(p.fromdate ?? p.todate ?? Date.now()).getTime();
    if (Number.isNaN(time)) continue;

    out.push(
      finalize({
        id: `gdacs_${p.eventtype}_${p.eventid}`,
        source: "gdacs",
        type: GDACS_TYPES[p.eventtype] ?? "other",
        title: p.name ?? p.htmldescription ?? "GDACS olayı",
        lat: coords[1],
        lon: coords[0],
        time,
        magnitude: null,
        depth: null,
        alertLevel: p.alertlevel ? String(p.alertlevel).toLowerCase() : null,
        url: p.url?.report ?? null,
      })
    );
  }

  return out;
}