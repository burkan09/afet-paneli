import { formatTime } from "../../lib/format";

const SPEEDS = [0.5, 1, 2, 4];

export default function TimelineSlider({ timeline, visibleCount }) {
  const { enabled, enable, playing, toggle, seek, speed, setSpeed,
          progress, cutoff, span, available } = timeline;

  if (!available) return null;

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-[min(680px,92vw)]">
      <div className="rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md shadow-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => enable(e.target.checked)}
              className="accent-cyan-500"
            />
            Zaman tüneli
          </label>

          {enabled && (
            <>
              <button
                onClick={toggle}
                className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs shrink-0 transition-colors"
                aria-label={playing ? "Duraklat" : "Oynat"}
              >
                {playing ? "❚❚" : "▶"}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />

              <div className="flex gap-1 shrink-0">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                      speed === s
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-700/60 text-slate-400 hover:bg-slate-600"
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {enabled && (
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 tabular-nums">
            <span>{formatTime(span.start)}</span>
            <span className="text-cyan-400 font-medium">
              {cutoff != null && formatTime(cutoff)}
              {visibleCount != null && ` · ${visibleCount} olay`}
            </span>
            <span>{formatTime(span.end)}</span>
          </div>
        )}
      </div>
    </div>
  );
}