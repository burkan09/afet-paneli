import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUsgs } from "../api/usgs";
import { fetchEonet } from "../api/eonet";
import { fetchGdacs } from "../api/gdacs";
import {
  normalizeUsgsCollection,
  normalizeEonetCollection,
  normalizeGdacsCollection,
} from "../lib/normalize";

const CACHE_KEY = "afet-paneli:son-veri";
const CACHE_MAX_AGE = 6 * 3600000;

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > CACHE_MAX_AGE) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(events) {
  try {
    const trimmed = events.slice(0, 400);
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), events: trimmed })
    );
  } catch {
    // Kota dolu olabilir, önemli değil
  }
}

export function useDisasters(range = "day") {
  const cached = useRef(readCache());

  const [events, setEvents] = useState(cached.current?.events ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(cached.current?.savedAt ?? null);
  const [stale, setStale] = useState(Boolean(cached.current));
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
        const yedek = readCache();
        if (yedek) {
          setEvents(yedek.events);
          setUpdatedAt(yedek.savedAt);
          setStale(true);
        } else {
          setError("Hiçbir veri kaynağına ulaşılamadı");
        }
      } else {
        setEvents(ok);
        setUpdatedAt(Date.now());
        setStale(false);
        writeCache(ok);
      }

      setSourceErrors(failed);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [range, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { events, loading, error, updatedAt, stale, sourceErrors, reload };
}