import { useState } from "react";

export default function ToolbarMenu({
  panels,
  onToggle,
  onReset,
  inline,
  atMinimum,
  minOpen = 3,
}) {
  const [open, setOpen] = useState(false);
  const total = Object.keys(panels).length;
  const activeCount = Object.values(panels).filter((p) => p.open).length;

  return (
    <div
      className={
        inline ? "relative" : "absolute top-4 left-1/2 -translate-x-1/2 z-20"
      }
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-md text-sm text-slate-200 hover:bg-slate-900/70 transition-colors shadow-lg"
      >
        <span>Araçlar</span>
        <span className="text-xs text-slate-500 tabular-nums">
          {activeCount}/{total}
        </span>
      </button>

      {open && (
        <div className="absolute mt-2 w-60 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md p-2 shadow-2xl z-30">
          {Object.entries(panels).map(([key, p]) => {
            const kilitli = p.open && atMinimum;

            return (
              <label
                key={key}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded text-sm ${
                  kilitli
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-300 hover:bg-white/5 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={p.open}
                  disabled={kilitli}
                  onChange={() => onToggle(key)}
                  className="accent-emerald-500"
                />
                {p.label}
              </label>
            );
          })}

          <div className="border-t border-white/10 mt-1 pt-2 flex items-center justify-between px-2">
            <span className="text-[10px] text-slate-600">
              En az {minOpen} panel açık kalır
            </span>
            <button
              onClick={onReset}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Sıfırla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}