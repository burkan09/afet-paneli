import { useMemo, useState } from "react";
import { useSeismicity } from "../../hooks/useSeismicity";
import { majorFromSeismicity, usgsSearchUrl } from "../../lib/majorEvents";
import { impactToColor } from "../../lib/impact";
import { magnitudeToImpact } from "../../lib/impact";

export default function MajorEventsPanel({ onFocus }) {
  const { points } = useSeismicity();
  const [minMag, setMinMag] = useState(6);
  const [activeId, setActiveId] = useState(null);

  const list = useMemo(
    () => majorFromSeismicity(points, minMag, 150),
    [points, minMag]
  );

  const handleClick = (item) => {
    if (activeId === item.index) {
      window.open(usgsSearchUrl(item), "_blank", "noopener,noreferrer");
      return;
    }
    setActiveId(item.index);
    onFocus?.({ lat: item.lat, lon: item.lon });
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500">Minimum</span>
        <input
          type="range"
          min="5"
          max="8"
          step="0.5"
          value={minMag}
          onChange={(e) => setMinMag(Number(e.target.value))}
          className="flex-1 accent-orange-500"
        />
        <span className="text-xs text-slate-300 tabular-nums w-8">
          M{minMag.toFixed(1)}
        </span>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">
          Bu eşikte kayıt yok.
        </p>
      ) : (
        <ol className="space-y-1">
          {list.map((item) => {
            const active = activeId === item.index;
            return (
              <li key={item.index}>
                <button
                  onClick={() => handleClick(item)}
                  className={`w-full flex items-center gap-3 px-2 py-1.5 rounded text-left text-xs transition-colors ${
                    active
                      ? "bg-emerald-900/40 text-emerald-200"
                      : "hover:bg-white/5 text-slate-400"
                  }`}
                >
                  <span
                    className="font-bold tabular-nums w-8"
                    style={{
                      color: impactToColor(magnitudeToImpact(item.magnitude)),
                    }}
                  >
                    {item.magnitude.toFixed(1)}
                  </span>
                  <span className="flex-1 tabular-nums">
                    {item.lat.toFixed(1)}, {item.lon.toFixed(1)}
                  </span>
                  {active && (
                    <span className="text-[10px] text-emerald-400">
                      tekrar tıkla → USGS
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <p className="text-[10px] text-slate-600 mt-3">
        Son 20 yılın en büyük depremleri. Tıkla: kürede göster. Tekrar tıkla:
        USGS kaydı.
      </p>
    </div>
  );
}