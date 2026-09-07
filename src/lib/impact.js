const ALERT_SCORES = { green: 25, orange: 60, red: 90 };

export function magnitudeToImpact(mag) {
  if (mag == null) return 0;
  const score = ((mag - 1) / 8) * 100;
  return Math.round(Math.max(0, Math.min(100, score)));
}

export function alertToImpact(level) {
  if (!level) return 0;
  return ALERT_SCORES[String(level).toLowerCase()] ?? 0;
}

export function computeImpact({ type, magnitude, alertLevel }) {
  if (magnitude != null) {
    const base = magnitudeToImpact(magnitude);
    const alert = alertToImpact(alertLevel);
    return Math.max(base, alert);
  }

  if (alertLevel) return alertToImpact(alertLevel);

  const defaults = {
    wildfire: 40,
    flood: 45,
    landslide: 45,
    volcano: 50,
    storm: 50,
    tsunami: 70,
  };
  return defaults[type] ?? 30;
}

export function impactToColor(score) {
  if (score >= 75) return "#ef4444";
  if (score >= 55) return "#f97316";
  if (score >= 35) return "#facc15";
  return "#22d3ee";
}

export function impactLabel(score) {
  if (score >= 75) return "Çok yüksek";
  if (score >= 55) return "Yüksek";
  if (score >= 35) return "Orta";
  return "Düşük";
}