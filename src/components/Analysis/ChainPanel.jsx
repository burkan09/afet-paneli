import { useMemo, useState } from "react";
import { useSeismicity } from "../../hooks/useSeismicity";
import { findNearbyEvents, baselineRate, assessCluster } from "../../lib/correlate";
import { typeInfo } from "../../lib/eventTypes";
import { impactToColor } from "../../lib/impact";
import { timeAgo } from "../../lib/format";

const CATALOG_YEARS = 20;

export default function ChainPanel({ event, events, onSelect }) {
  const { points } = useSeismicity();
  const [radius, setRadius] = useState(500);
  const [hours, setHours] = useState(72);

  const nearby = useMemo(
    () => (event ? findNearbyEvents(event, events, { km: radius, hours }) : []),
    [event, events, radius, hours]
  );

  const assessment = useMemo(() => {
    if (!event || points.length === 0) return null;
    const base = baselineRate(points, event.lat, event.lon, radius, CATALOG_YEARS);
    return { base, ...assessCluster(nearby.length, base, hours) };
  }, [event, points, nearby.length, radius, hours]);

  if (!event) {
    return (
      <p className="p-4 text-xs text-slate-400 text-center">
        Bir olay seçin. Yakınında ve sonrasında gerçekleşen olaylar,
        beklenen temel oranla karşılaştırılarak listelenecek.
      </p>
    );
  }

  const color =
    assessment?.ratio == null
      ? "text-slate-400"
      : assessment.ratio >= 5
      ? "text-red-400"
      : assessment.ratio >= 2
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="p-3 text-slate-200">
      <p className="text-xs text-slate-400 mb-3 truncate">{event.title}</p>

      <div className="space-y-2 mb-3">
        <div>
          <label className="text-[11px] text-slate-500 block">
            Yarıçap: {radius} km
          </label>
          <input
            type="range"
            min="100"
            max="1500"
            step="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-500 block">
            Zaman penceresi: {hours} saat
          </label>
          <input
            type="range"
            min="6"
            max="336"
            step="6"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>

      {assessment && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 mb-3">
          <p className={`text-sm font-semibold ${color}`}>
            {assessment.verdict}
          </p>
          <dl className="mt-2 space-y-0.5 text-[11px]">
            <div className="flex justify-between">
              <dt className="text-slate-500">Gözlenen</dt>
              <dd className="tabular-nums">{assessment.observed} olay</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Beklenen</dt>
              <dd className="tabular-nums">{assessment.expected} olay</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Oran</dt>
              <dd className={`tabular-nums font-bold ${color}`}>
                {assessment.ratio != null ? `${assessment.ratio}×` : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Temel oran</dt>
              <dd className="tabular-nums">
                {assessment.base.perYear.toFixed(1)} olay/yıl
              </dd>
            </div>
          </dl>
        </div>
      )}

      {nearby.length === 0 ? (
        <p className="text-xs text-slate-500 py-3 text-center">
          Bu pencerede başka olay yok.
        </p>
      ) : (
        <ul className="space-y-1">
          {nearby.slice(0, 12).map((e) => {
            const info = typeInfo(e.type);
            return (
              <li key={e.id}>
                <button
                  onClick={() => onSelect?.(e)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-left text-[11px]"
                >
                  <span style={{ color: info.color }}>{info.icon}</span>
                  <span
                    className="font-bold tabular-nums w-8"
                    style={{ color: impactToColor(e.impactScore) }}
                  >
                    {e.magnitude != null ? e.magnitude.toFixed(1) : e.impactScore}
                  </span>
                  <span className="flex-1 truncate text-slate-400">
                    {e.title}
                  </span>
                  <span className="text-slate-600 tabular-nums whitespace-nowrap">
                    {e.distanceKm} km · +{e.hoursAfter.toFixed(0)}sa
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
        Temel oran, son 20 yılın M4.5+ kataloğundan bu yarıçap için
        hesaplanır. Yakınlık nedensellik anlamına gelmez — oran 1'e yakınsa
        gözlenen olaylar zaten beklenen sayıdadır.
      </p>
    </div>
  );
}