import { typeInfo } from "../../lib/eventTypes";
import { impactToColor } from "../../lib/impact";
import { timeAgo } from "../../lib/format";

export default function LiveFeed({ feed, highlightMs, onSelect, onClear }) {
  if (feed.length === 0) {
    return (
      <p className="p-4 text-xs text-slate-500 text-center">
        Yeni olay bekleniyor. Veri her 60 saniyede bir yenileniyor; yeni gelen
        kayıtlar burada listelenecek.
      </p>
    );
  }

  const now = Date.now();

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-slate-400">
          {feed.length} yeni kayıt
        </span>
        <button
          onClick={onClear}
          className="text-[10px] text-slate-500 hover:text-slate-300"
        >
          Temizle
        </button>
      </div>

      <ul className="space-y-1">
        {feed.map((e) => {
          const info = typeInfo(e.type);
          const isNew = now - e.arrivedAt < highlightMs;

          return (
            <li key={e.id}>
              <button
                onClick={() => onSelect?.(e)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-[11px] transition-colors ${
                  isNew
                    ? "bg-cyan-950/50 border border-cyan-800/50"
                    : "hover:bg-white/5"
                }`}
              >
                {isNew && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                )}
                <span style={{ color: info.color }}>{info.icon}</span>
                <span
                  className="font-bold tabular-nums w-8"
                  style={{ color: impactToColor(e.impactScore) }}
                >
                  {e.magnitude != null ? e.magnitude.toFixed(1) : e.impactScore}
                </span>
                <span className="flex-1 truncate text-slate-300">{e.title}</span>
                <span className="text-slate-600 whitespace-nowrap">
                  {timeAgo(e.time)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}