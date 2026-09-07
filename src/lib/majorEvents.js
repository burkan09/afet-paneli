export function majorFromSeismicity(points, minMag = 5, limit = 200) {
  const out = [];

  for (let i = 0; i < points.length; i++) {
    const [lat, lon, mag] = points[i];
    if (mag >= minMag) out.push({ index: i, lat, lon, magnitude: mag });
  }

  out.sort((a, b) => b.magnitude - a.magnitude);
  return out.slice(0, limit);
}

export function usgsSearchUrl({ lat, lon, magnitude }) {
  const params = new URLSearchParams({
    minmagnitude: String(Math.max(0, magnitude - 0.2)),
    maxmagnitude: String(magnitude + 0.2),
    minlatitude: String(lat - 0.5),
    maxlatitude: String(lat + 0.5),
    minlongitude: String(lon - 0.5),
    maxlongitude: String(lon + 0.5),
  });
  return `https://earthquake.usgs.gov/earthquakes/map/?extent=${lat - 3},${
    lon - 3
  },${lat + 3},${lon + 3}&${params}`;
}