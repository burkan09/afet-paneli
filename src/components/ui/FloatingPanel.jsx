import { useState } from "react";
import { useDraggable } from "../../hooks/useDraggable";

export default function FloatingPanel({
  title,
  initial,
  width = 280,
  maxHeight = 420,
  defaultOpen = true,
  children,
}) {
  const { pos, handleProps } = useDraggable(initial);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className="absolute z-10 rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden"
      style={{ left: pos.x, top: pos.y, width }}
    >
      <header
        {...handleProps}
        className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none bg-white/5 border-b border-white/10 touch-none"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {title}
        </h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-slate-400 hover:text-slate-100 text-xs px-1"
          aria-label={open ? "Paneli daralt" : "Paneli genişlet"}
        >
          {open ? "−" : "+"}
        </button>
      </header>

      {open && (
        <div className="overflow-y-auto" style={{ maxHeight }}>
          {children}
        </div>
      )}
    </section>
  );
}