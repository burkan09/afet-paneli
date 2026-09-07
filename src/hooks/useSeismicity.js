import { useEffect, useState } from "react";

export function useSeismicity() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/seismicity.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPoints(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPoints([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { points, loading };
}

export function pointTime(p) {
  return p[3] * 86400000;
}

export function pointYear(p) {
  return new Date(p[3] * 86400000).getUTCFullYear();
}