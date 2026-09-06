const BASE = "https://eonet.gsfc.nasa.gov/api/v3/events";

export async function fetchEonet({ days = 20, limit = 100 } = {}) {
  const url = `${BASE}?days=${days}&limit=${limit}&status=open`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EONET yanıt vermedi (HTTP ${res.status})`);
  return res.json();
}