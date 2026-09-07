const BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";

export async function fetchEonet({ days = 60, limit = 300 } = {}) {
  const url = `${BASE}?days=${days}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EONET yanıt vermedi (HTTP ${res.status})`);
  return res.json();
}