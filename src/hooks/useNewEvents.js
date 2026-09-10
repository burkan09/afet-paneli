import { useEffect, useRef, useState } from "react";

const MAX_FEED = 20;
const HIGHLIGHT_MS = 45000;

export function useNewEvents(events, { enabled = true } = {}) {
  const seenRef = useRef(null);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    if (!enabled || events.length === 0) return;

    if (seenRef.current === null) {
      seenRef.current = new Set(events.map((e) => e.id));
      return;
    }

    const fresh = events.filter((e) => !seenRef.current.has(e.id));
    if (fresh.length === 0) return;

    for (const e of fresh) seenRef.current.add(e.id);

    const stamped = fresh.map((e) => ({ ...e, arrivedAt: Date.now() }));
    setFeed((prev) => [...stamped, ...prev].slice(0, MAX_FEED));
  }, [events, enabled]);

  useEffect(() => {
    if (feed.length === 0) return;

    const id = setInterval(() => {
      const now = Date.now();
      setFeed((prev) => prev.filter((e) => now - e.arrivedAt < HIGHLIGHT_MS * 8));
    }, 10000);

    return () => clearInterval(id);
  }, [feed.length]);

  const clear = () => setFeed([]);

  return { feed, clear, highlightMs: HIGHLIGHT_MS };
}