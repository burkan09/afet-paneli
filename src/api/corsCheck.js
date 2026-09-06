function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

const now = new Date();
const weekAgo = new Date(now.getTime() - 7 * 86400000);

const ENDPOINTS = [
  {
    key: "usgs",
    name: "USGS (deprem)",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  },
  {
    key: "eonet",
    name: "NASA EONET",
    url: "https://eonet.gsfc.nasa.gov/api/v3/events?days=20&limit=50&status=open",
  },
  {
    key: "gdacs",
    name: "GDACS",
    url:
      "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH" +
      `?eventlist=EQ,TC,FL,VO,WF,DR&alertlevel=Orange;Red` +
      `&fromDate=${isoDate(weekAgo)}&toDate=${isoDate(now)}`,
  },
  {
    key: "reliefweb",
    name: "ReliefWeb v2",
    url: "https://api.reliefweb.int/v2/disasters?appname=afet-paneli&limit=5",
  },
];

function describe(json) {
  if (Array.isArray(json)) return `${json.length} kayıt`;
  if (Array.isArray(json?.features)) return `${json.features.length} kayıt`;
  if (Array.isArray(json?.events)) return `${json.events.length} kayıt`;
  if (Array.isArray(json?.data)) return `${json.data.length} kayıt`;
  return "yanıt alındı";
}

async function checkOne(ep) {
  const start = performance.now();
  try {
    const res = await fetch(ep.url);
    const ms = Math.round(performance.now() - start);
    if (!res.ok) return { ...ep, ok: false, ms, detail: `HTTP ${res.status}` };
    const json = await res.json();
    return { ...ep, ok: true, ms, detail: describe(json) };
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    return { ...ep, ok: false, ms, detail: err.message };
  }
}

export function checkAll() {
  return Promise.all(ENDPOINTS.map(checkOne));
}