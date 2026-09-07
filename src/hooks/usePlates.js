import { useEffect, useState } from "react";

export function usePlates() {
  const [plates, setPlates] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/plates.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;

        const out = [];
        for (const f of json.features ?? []) {
          const g = f.geometry;
          if (!g) continue;

          const name =
            f.properties?.Name ??
            f.properties?.name ??
            f.properties?.LAYER ??
            "sınır";

          const lines =
            g.type === "LineString"
              ? [g.coordinates]
              : g.type === "MultiLineString"
              ? g.coordinates
              : [];

          lines.forEach((coords, i) => {
            out.push({
              id: `${name}-${i}`,
              name,
              kind: "plate",
              coords: coords.map(([lon, lat]) => [lat, lon]),
            });
          });
        }

        setPlates(out);
      })
      .catch(() => {
        if (!cancelled) setPlates([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return plates;
}