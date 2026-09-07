export const EVENT_TYPES = {
  earthquake: { label: "Deprem", icon: "◆", color: "#f97316" },
  flood: { label: "Sel", icon: "≈", color: "#3b82f6" },
  landslide: { label: "Heyelan", icon: "▼", color: "#a16207" },
  wildfire: { label: "Yangın", icon: "▲", color: "#dc2626" },
  volcano: { label: "Volkan", icon: "⬟", color: "#e11d48" },
  storm: { label: "Fırtına", icon: "✳", color: "#8b5cf6" },
  tsunami: { label: "Tsunami", icon: "〜", color: "#06b6d4" },
  drought: { label: "Kuraklık", icon: "▬", color: "#ca8a04" },
  ice: { label: "Buz", icon: "❄", color: "#67e8f9" },
  dust: { label: "Toz", icon: "░", color: "#a8a29e" },
  other: { label: "Diğer", icon: "●", color: "#94a3b8" },
};

export function typeInfo(type) {
  return EVENT_TYPES[type] ?? EVENT_TYPES.other;
}

export const FILTERABLE_TYPES = [
  "earthquake",
  "flood",
  "landslide",
  "wildfire",
  "volcano",
  "storm",
];