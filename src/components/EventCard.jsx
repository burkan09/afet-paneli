import { timeAgo } from "../lib/format";
import { typeInfo } from "../lib/eventTypes";
import { impactToColor } from "../lib/impact";

export default function EventCard({ event, onSelect }) {
  const info = typeInfo(event.type);

  return (
    <li>
      <button
        onClick={() => onSelect?.(event)}
        className="w-full flex items-center gap-3 bg-slate-800/40 hover:bg-slate-700/50 rounded-lg px-3 py-2.5 text-left transition-colors"
      >
        <span className="text-lg w-6 text-center" style={{ color: info.color }}>
          {info.icon}
        </span>

        <span
          className="text-sm font-bold w-9 tabular-nums"
          style={{ color: impactToColor(event.impactScore) }}
        >
          {event.magnitude != null
            ? event.magnitude.toFixed(1)
            : event.impactScore}
        </span>

        <span className="flex-1 min-w-0">
          <span className="block truncate text-sm text-slate-200">
            {event.title}
          </span>
          <span className="block text-[11px] text-slate-500">
            {info.label} · {event.source.toUpperCase()}
          </span>
        </span>

        <span className="text-xs text-slate-500 whitespace-nowrap">
          {timeAgo(event.time)}
        </span>
      </button>
    </li>
  );
}