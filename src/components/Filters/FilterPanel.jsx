import { useFilters } from "../../context/FilterContext";
import { GLOBE_THEMES } from "../../lib/globeStyle";
import TypeFilter from "./TypeFilter";

const RANGES = [
  { key: "hour", label: "1 saat" },
  { key: "day", label: "24 saat" },
  { key: "week", label: "7 gün" },
];

export default function FilterPanel({ counts }) {
  const { filters, dispatch } = useFilters();

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => dispatch({ type: "SET_RANGE", value: r.key })}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              filters.range === r.key
                ? "bg-emerald-600 text-white"
                : "bg-slate-700/70 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={filters.search}
        onChange={(e) => dispatch({ type: "SET_SEARCH", value: e.target.value })}
        placeholder="Konum ara"
        className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-600"
      />

      <TypeFilter counts={counts} />

      <div>
        <label className="text-sm text-slate-400 block mb-2">
          Minimum büyüklük (deprem): {filters.minMag.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="7"
          step="0.5"
          value={filters.minMag}
          onChange={(e) =>
            dispatch({ type: "SET_MIN_MAG", value: Number(e.target.value) })
          }
          className="w-full accent-emerald-500"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 block mb-2">
          Minimum etki skoru: {filters.minImpact}
        </label>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={filters.minImpact}
          onChange={(e) =>
            dispatch({ type: "SET_MIN_IMPACT", value: Number(e.target.value) })
          }
          className="w-full accent-orange-500"
        />
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-2">Küre görünümü</p>
        <div className="flex gap-2">
          {Object.entries(GLOBE_THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => dispatch({ type: "SET_THEME", value: key })}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                filters.theme === key
                  ? "bg-sky-600 text-white"
                  : "bg-slate-700/70 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.autoRefresh}
            onChange={() => dispatch({ type: "TOGGLE_AUTO_REFRESH" })}
            className="accent-emerald-500"
          />
          Otomatik yenile (60 sn)
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showHistory}
            onChange={() => dispatch({ type: "TOGGLE_HISTORY" })}
            className="accent-rose-500"
          />
          Geçmiş sismiklik
        </label>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}