import { formatTime, timeAgo } from "../../lib/format";
import { energyJoules, energyComparison } from "../../lib/energy";
import { impactToColor, impactLabel } from "../../lib/impact";
import { typeInfo } from "../../lib/eventTypes";

export default function DetailPanel({ event, onClose }) {
  if (!event) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm">
        Küre üzerindeki bir noktaya tıklayarak detayları görebilirsiniz.
      </div>
    );
  }

  const info = typeInfo(event.type);

  const openSource = () => {
    if (event.url) window.open(event.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-5 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-slate-500 hover:text-slate-300 text-xl leading-none"
        aria-label="Detayı kapat"
      >
        ×
      </button>

      <div className="flex items-center gap-2">
        <span className="text-2xl" style={{ color: info.color }}>
          {info.icon}
        </span>
        <span className="text-sm text-slate-400">{info.label}</span>
      </div>

      <p
        className="text-3xl font-bold mt-2"
        style={{ color: impactToColor(event.impactScore) }}
      >
        {event.magnitude != null
          ? `M${event.magnitude.toFixed(1)}`
          : event.impactScore}
      </p>

      <p className="text-slate-200 mt-1 text-sm">{event.title}</p>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 shrink-0">Zaman</dt>
          <dd className="text-right">
            {formatTime(event.time)} ({timeAgo(event.time)})
          </dd>
        </div>

        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 shrink-0">Koordinat</dt>
          <dd className="tabular-nums">
            {event.lat.toFixed(2)}, {event.lon.toFixed(2)}
          </dd>
        </div>

        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 shrink-0">Etki skoru</dt>
          <dd>
            {event.impactScore} · {impactLabel(event.impactScore)}
          </dd>
        </div>

        {event.depth != null && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 shrink-0">Derinlik</dt>
            <dd>{event.depth.toFixed(1)} km</dd>
          </div>
        )}

        {event.alertLevel && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 shrink-0">Uyarı seviyesi</dt>
            <dd className="capitalize">{event.alertLevel}</dd>
          </div>
        )}

        {event.magnitude != null && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500 shrink-0">Enerji</dt>
            <dd>{energyComparison(energyJoules(event.magnitude))}</dd>
          </div>
        )}

        <div className="flex justify-between gap-3">
          <dt className="text-slate-500 shrink-0">Kaynak</dt>
          <dd className="uppercase">{event.source}</dd>
        </div>
      </dl>

      {event.links?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-1.5">İlgili kaynaklar</p>
          <ul className="space-y-1">
            {event.links.slice(0, 4).map((l, i) => (
              <li key={i}>
                <button
                  onClick={() =>
                    window.open(l.url, "_blank", "noopener,noreferrer")
                  }
                  className="text-xs text-emerald-400 hover:text-emerald-300 text-left"
                >
                  {l.title || l.source}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {event.url && (
        <button
          onClick={openSource}
          className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
        >
          Kaynak kaydını aç
        </button>
      )}
    </div>
  );
}