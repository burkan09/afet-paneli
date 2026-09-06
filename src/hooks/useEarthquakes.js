import { useEffect, useState } from "react";
import { fetchUsgs } from "../api/usgs";
import { normalizeUsgsCollection } from "../lib/normalize";

export function useEarthquakes(range = "day") {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchUsgs(range)
      .then((json) => {
        if (cancelled) return;
        setEvents(normalizeUsgsCollection(json));
        setUpdatedAt(Date.now());
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { events, loading, error, updatedAt, reload };
}