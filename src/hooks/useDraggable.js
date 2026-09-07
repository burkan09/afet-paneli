import { useCallback, useRef, useState } from "react";

export function useDraggable(initial) {
  const [pos, setPos] = useState(initial);
  const drag = useRef(null);

  const onPointerDown = useCallback(
    (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
      };
    },
    [pos]
  );

  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d) return;

    const nextX = d.origX + (e.clientX - d.startX);
    const nextY = d.origY + (e.clientY - d.startY);

    setPos({
      x: Math.max(-40, Math.min(window.innerWidth - 120, nextX)),
      y: Math.max(0, Math.min(window.innerHeight - 48, nextY)),
    });
  }, []);

  const onPointerUp = useCallback((e) => {
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  return { pos, handleProps: { onPointerDown, onPointerMove, onPointerUp } };
}