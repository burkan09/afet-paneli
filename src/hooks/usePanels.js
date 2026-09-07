import { useCallback, useState } from "react";

const DEFAULT_PANELS = {
  stats: { label: "İstatistikler", open: true },
  hotspots: { label: "En aktif bölgeler", open: true },
  filters: { label: "Filtreler", open: true },
  events: { label: "Olay listesi", open: true },
  detail: { label: "Seçili olay", open: true },
  charts: { label: "Grafikler", open: false },
  major: { label: "Büyük depremler", open: false },
};

const MIN_OPEN = 3;

export function usePanels() {
  const [panels, setPanels] = useState(DEFAULT_PANELS);

  const openCount = Object.values(panels).filter((p) => p.open).length;
  const atMinimum = openCount <= MIN_OPEN;

  const toggle = useCallback((key) => {
    setPanels((prev) => {
      const acik = Object.values(prev).filter((p) => p.open).length;
      if (prev[key].open && acik <= MIN_OPEN) return prev;
      return { ...prev, [key]: { ...prev[key], open: !prev[key].open } };
    });
  }, []);

  const reset = useCallback(() => setPanels(DEFAULT_PANELS), []);

  return { panels, toggle, reset, openCount, atMinimum, minOpen: MIN_OPEN };
}