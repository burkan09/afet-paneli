export function magnitudeToColor(mag) {
  if (mag >= 6) return "#ef4444";
  if (mag >= 5) return "#f97316";
  if (mag >= 4) return "#facc15";
  if (mag >= 3) return "#84cc16";
  return "#22d3ee";
}

export function magnitudeToAltitude(mag) {
  return Math.max(0.008, (mag / 10) * 0.22);
}

export function magnitudeToRadius(mag) {
  return Math.max(0.15, mag * 0.085);
}

export function magnitudeToRingRadius(mag) {
  return Math.max(1, (mag - 2) * 2.2);
}

export function magnitudeToRingSpeed(mag) {
  return 0.6 + mag * 0.14;
}

export const GLOBE_THEMES = {
  day: {
    label: "Gündüz",
    image: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    bump: "//unpkg.com/three-globe/example/img/earth-topology.png",
    background: "rgba(2,6,23,1)",
    atmosphere: "#7dd3fc",
    hexTop: "rgba(190,18,60,0.62)",
    hexSide: "rgba(136,19,55,0.35)",
  },
  night: {
    label: "Gece",
    image: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    bump: null,
    background: "rgba(2,6,23,1)",
    atmosphere: "#38bdf8",
    hexTop: "rgba(244,63,94,0.6)",
    hexSide: "rgba(159,18,57,0.3)",
  },
};