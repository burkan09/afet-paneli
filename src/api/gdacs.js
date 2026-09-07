const BASE = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export async function fetchGdacs({ days = 14, alertLevel = "Orange;Red" } = {}) {
  const to = new Date();
  const from = new Date(to.getTime() - days * 86400000);

  const url =
    `${BASE}?eventlist=EQ,TC,FL,VO,WF,DR` +
    `&alertlevel=${alertLevel}` +
    `&fromDate=${isoDate(from)}` +
    `&toDate=${isoDate(to)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GDACS yanıt vermedi (HTTP ${res.status})`);
  return res.json();
}