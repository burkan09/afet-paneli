const FEEDS = {
  hour: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
  day: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  week: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
};

export async function fetchUsgs(range = "day") {
  const url = FEEDS[range];
  if (!url) throw new Error(`Geçersiz zaman aralığı: ${range}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`USGS yanıt vermedi (HTTP ${res.status})`);
  return res.json();
}