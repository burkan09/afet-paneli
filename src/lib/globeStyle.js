export function magnitudeToColor(mag) {
  if (mag >= 6) return "#f87171";
  if (mag >= 5) return "#fb923c";
  if (mag >= 4) return "#fbbf24";
  if (mag >= 3) return "#a3e635";
  return "#38bdf8";
}

export function magnitudeToAltitude(mag) {
  return Math.max(0.01, (mag / 10) * 0.35);
}

export function magnitudeToRadius(mag) {
  return Math.max(0.15, mag * 0.09);
}

export function magnitudeToRingRadius(mag) {
  return Math.max(1, (mag - 2) * 2.2);
}

export function magnitudeToRingSpeed(mag) {
  return 0.6 + mag * 0.14;
}

export const GLOBE_TEXTURES = {
  night: "//unpkg.com/three-globe/example/img/earth-night.jpg",
  day: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  topology: "//unpkg.com/three-globe/example/img/earth-topology.png",
};