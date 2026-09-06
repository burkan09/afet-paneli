import { timeAgo, magnitudeColor, formatTime } from "../lib/format";

export default function EventCard({ event }) {
  return (
    <li className="flex items-center gap-4 bg-slate-800/60 hover:bg-slate-800 rounded-lg px-4 py-3 transition-colors">
      <span
        className={`text-lg font-bold w-14 tabular-nums ${magnitudeColor(
          event.magnitude
        )}`}
      >
        {event.magnitude.toFixed(1)}
      </span>

      <div className="flex-1 min-w-0">
        <p className="truncate text-slate-200">{event.title}</p>
        <p className="text-xs text-slate-500">
          {formatTime(event.time)}
          {event.depth != null && ` · ${event.depth.toFixed(0)} km derinlik`}
        </p>
      </div>

      <span className="text-sm text-slate-500 whitespace-nowrap">
        {timeAgo(event.time)}
      </span>
    </li>
  );
}