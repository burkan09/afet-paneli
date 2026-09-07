import { FILTERABLE_TYPES, typeInfo } from "../../lib/eventTypes";
import { impactToColor, impactLabel } from "../../lib/impact";

const IMPACT_STOPS = [80, 60, 45, 20];

export default function Legend() {
  return (
    <div className="p-3 text-slate-200 space-y-3">
      <div>
        <p className="text-[11px] font-semibold text-slate-300 mb-1.5">
          Etki skoru
        </p>
        <div className="space-y-1">
          {IMPACT_STOPS.map((s) => (
            <div key={s} className="flex items-center gap-2 text-[11px]">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: impactToColor(s) }}
              />
              <span className="text-slate-400">{impactLabel(s)}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5">
          Nokta boyutu ve halka yarıçapı da bu skoru kullanır.
        </p>
      </div>

      <div className="border-t border-slate-800 pt-2.5">
        <p className="text-[11px] font-semibold text-slate-300 mb-1.5">
          Afet türü
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {FILTERABLE_TYPES.map((t) => {
            const info = typeInfo(t);
            return (
              <div key={t} className="flex items-center gap-1.5 text-[11px]">
                <span style={{ color: info.color }}>{info.icon}</span>
                <span className="text-slate-400">{info.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-2.5">
        <p className="text-[11px] font-semibold text-slate-300 mb-1.5">
          Küre katmanları
        </p>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 shrink-0 bg-yellow-400" />
            <span className="text-slate-400">Levha sınırı</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-0.5 shrink-0"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#fb923c 0 4px,transparent 4px 6px)",
              }}
            />
            <span className="text-slate-400">Dalma-batma zonu</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 shrink-0 bg-red-500" />
            <span className="text-slate-400">Seçili sınır</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-0.5 shrink-0"
              style={{
                background:
                  "repeating-linear-gradient(90deg,#22d3ee 0 3px,transparent 3px 5px)",
              }}
            />
            <span className="text-slate-400">Seçili fay (akış = göç yönü)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 shrink-0 bg-rose-600/60 rounded-sm" />
            <span className="text-slate-400">Geçmiş sismiklik</span>
          </div>
        </div>
      </div>
    </div>
  );
}