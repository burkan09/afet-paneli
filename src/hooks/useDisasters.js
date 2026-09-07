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
const TIMEOUT_MS = 12000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} zaman aşımı`)), ms)
    ),
  ]);
}

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
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), events: events.slice(0, 400) })
    );
  } catch {
    // kota dolu olabilir
  }
}

export function useDisasters(range = "day") {
  const cached = useRef(readCache());

  const [events, setEvents] = useState(cached.current?.events ?? []);
  const [loading, setLoading] = useState(!cached.current);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(cached.current?.savedAt ?? null);
  const [stale, setStale] = useState(Boolean(cached.current));
  const [sourceErrors, setSourceErrors] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setError(null);

    const tasks = [
      withTimeout(fetchUsgs(range).then(normalizeUsgsCollection), TIMEOUT_MS, "USGS"),
      withTimeout(
        fetchEonet({ days: 60, limit: 300 }).then(normalizeEonetCollection),
        TIMEOUT_MS,
        "EONET"
      ),
      withTimeout(
        fetchGdacs({ days: 14 }).then(normalizeGdacsCollection),
        TIMEOUT_MS,
        "GDACS"
      ),
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

      if (ok.length > 0) {
        setEvents(ok);
        setUpdatedAt(Date.now());
        setStale(false);
        writeCache(ok);
      } else {
        const yedek = readCache();
        if (yedek) {
          setEvents(yedek.events);
          setUpdatedAt(yedek.savedAt);
          setStale(true);
        } else {
          setError("Hiçbir veri kaynağına ulaşılamadı");
        }
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