import { useEffect, useState } from "react";

export function usePlates(enabled = true) {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    fetch("/plates.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;

        const lines = [];
        for (const f of json.features ?? []) {
          const g = f.geometry;
          if (!g) continue;

          if (g.type === "LineString") {
            lines.push(g.coordinates);
          } else if (g.type === "MultiLineString") {
            lines.push(...g.coordinates);
          }
        }

        setPaths(lines.map((c) => c.map(([lon, lat]) => [lat, lon])));
      })
      .catch(() => {
        if (!cancelled) setPaths([]);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return paths;
}