import { useCallback, useEffect, useState } from "react";
import { fetchUsgs } from "../api/usgs";
import { fetchEonet } from "../api/eonet";
import { fetchGdacs } from "../api/gdacs";
import {
  normalizeUsgsCollection,
  normalizeEonetCollection,
  normalizeGdacsCollection,
} from "../lib/normalize";

export function useDisasters(range = "day") {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [sourceErrors, setSourceErrors] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const tasks = [
      fetchUsgs(range).then(normalizeUsgsCollection),
      fetchEonet({ days: 60, limit: 300 }).then(normalizeEonetCollection),
      fetchGdacs({ days: 14 }).then(normalizeGdacsCollection),
    ];

    Promise.allSettled(tasks).then((results) => {
      if (cancelled) return;

      const names = ["USGS", "EONET", "GDACS"];
      const ok = [];
      const failed = [];

      results.forEach((r, i) => {
        if (r.status === "fulfilled") ok.push(...r.value);
        else failed.push(names[i]);
      });

      if (ok.length === 0) {
        setError("Hiçbir veri kaynağına ulaşılamadı");
      } else {
        setEvents(ok);
        setUpdatedAt(Date.now());
      }

      setSourceErrors(failed);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [range, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { events, loading, error, updatedAt, sourceErrors, reload };
}