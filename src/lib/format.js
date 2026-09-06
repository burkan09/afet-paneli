export function formatTime(ms) {
  return new Date(ms).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function timeAgo(ms) {
  const dk = Math.floor((Date.now() - ms) / 60000);
  if (dk < 1) return "az önce";
  if (dk < 60) return `${dk} dk önce`;
  const sa = Math.floor(dk / 60);
  if (sa < 24) return `${sa} sa önce`;
  return `${Math.floor(sa / 24)} gün önce`;
}

export function magnitudeColor(m) {
  if (m >= 6) return "text-red-400";
  if (m >= 5) return "text-orange-400";
  if (m >= 4) return "text-amber-400";
  return "text-slate-400";
}