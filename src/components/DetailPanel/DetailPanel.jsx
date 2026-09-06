import { formatTime, timeAgo, magnitudeColor } from "../../lib/format";
import { energyJoules, energyComparison } from "../../lib/energy";

export default function DetailPanel({ event, onClose }) {
  if (!event) {
    return (
      <div className="bg-slate-800/40 rounded-lg p-6 text-center text-slate-500 text-sm">
        Küre üzerindeki bir noktaya tıklayarak detayları görebilirsiniz.
      </div>
    );
  }

  const openSource = () => {
    window.open(event.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-slate-800/60 rounded-lg p-5 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-slate-500 hover:text-slate-300 text-xl leading-none"
        aria-label="Detayı kapat"
      >
        ×
      </button>

      <p className={`text-3xl font-bold ${magnitudeColor(event.magnitude)}`}>
        {event.magnitude.toFixed(1)}
      </p>
      <p className="text-slate-200 mt-1">{event.title}</p>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Zaman</dt>
          <dd>
            {formatTime(event.time)} ({timeAgo(event.time)})
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-slate-500">Koordinat</dt>
          <dd className="tabular-nums">
            {event.lat.toFixed(2)}, {event.lon.toFixed(2)}
          </dd>
        </div>

        {event.depth != null && (
          <div className="flex justify-between">
            <dt className="text-slate-500">Derinlik</dt>
            <dd>{event.depth.toFixed(1)} km</dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt className="text-slate-500">Açığa çıkan enerji</dt>
          <dd>{energyComparison(energyJoules(event.magnitude))}</dd>
        </div>
      </dl>

      {event.url && (
        <button
          onClick={openSource}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
        >
          USGS kaydını aç
        </button>
      )}
    </div>
  );
}