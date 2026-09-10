import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BASE_DURATION_MS = 30000;

export function useTimeline(events) {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(1);

  const rafRef = useRef(null);
  const lastRef = useRef(0);

  const span = useMemo(() => {
    if (events.length === 0) return null;

    let min = Infinity;
    let max = -Infinity;
    for (const e of events) {
      if (e.time < min) min = e.time;
      if (e.time > max) max = e.time;
    }

    return min === max ? null : { start: min, end: max };
  }, [events]);

  useEffect(() => {
    if (!enabled || !playing || !span) return;

    lastRef.current = performance.now();

    const step = (now) => {
      const delta = now - lastRef.current;
      lastRef.current = now;

      setProgress((prev) => {
        const next = prev + (delta * speed) / BASE_DURATION_MS;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [enabled, playing, speed, span]);

  const cutoff = useMemo(() => {
    if (!enabled || !span) return null;
    return span.start + (span.end - span.start) * progress;
  }, [enabled, span, progress]);

  const play = useCallback(() => {
    setProgress((p) => (p >= 1 ? 0 : p));
    setPlaying(true);
  }, []);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p) setProgress((v) => (v >= 1 ? 0 : v));
      return !p;
    });
  }, []);

  const seek = useCallback((value) => {
    setPlaying(false);
    setProgress(Math.min(1, Math.max(0, value)));
  }, []);

  const enable = useCallback((on) => {
    setEnabled(on);
    setPlaying(false);
    setProgress(on ? 0 : 1);
  }, []);

  return {
    enabled,
    enable,
    playing,
    toggle,
    play,
    pause,
    seek,
    speed,
    setSpeed,
    progress,
    cutoff,
    span,
    available: Boolean(span),
  };
}

export function filterByCutoff(events, cutoff, trailMs = 6 * 3600000) {
  if (cutoff == null) return events;

  return events
    .filter((e) => e.time <= cutoff)
    .map((e) => {
      const age = cutoff - e.time;
      const fresh = Math.max(0, 1 - age / trailMs);
      return { ...e, freshness: fresh };
    });
}