const BASE = "https://api.reliefweb.int/v2";
const APPNAME = "afet-paneli";

export async function fetchDisasters({ limit = 20 } = {}) {
  const url = `${BASE}/disasters?appname=${APPNAME}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ReliefWeb yanıt vermedi (HTTP ${res.status})`);
  return res.json();
}

export async function fetchReports({ query, limit = 5 } = {}) {
  const params = new URLSearchParams({ appname: APPNAME, limit: String(limit) });
  if (query) params.set("query[value]", query);

  const res = await fetch(`${BASE}/reports?${params}`);
  if (!res.ok) throw new Error(`ReliefWeb yanıt vermedi (HTTP ${res.status})`);
  return res.json();
}