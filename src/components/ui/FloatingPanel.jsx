import { useState } from "react";
import { useDraggable } from "../../hooks/useDraggable";

export default function FloatingPanel({
  title,
  initial,
  width = 280,
  maxHeight = 420,
  defaultOpen = true,
  stacked = false,
  children,
}) {
  const { pos, handleProps } = useDraggable(initial);
  const [open, setOpen] = useState(defaultOpen);

  const layout = stacked
    ? { position: "relative", width: "100%" }
    : { position: "absolute", left: pos.x, top: pos.y, width };

  return (
    <section
      className="z-10 rounded-xl border border-white/10 bg-slate-950/45 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden"
      style={layout}
    >
      <header
        {...(stacked ? {} : handleProps)}
        onClick={stacked ? () => setOpen((v) => !v) : undefined}
        className={`flex items-center justify-between px-3 py-2 select-none bg-white/5 border-b border-white/10 touch-none ${
          stacked ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {title}
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="text-slate-400 hover:text-slate-100 text-sm px-1"
          aria-label={open ? "Paneli daralt" : "Paneli genişlet"}
          aria-expanded={open}
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