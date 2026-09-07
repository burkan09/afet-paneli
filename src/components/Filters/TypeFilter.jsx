import { useFilters } from "../../context/FilterContext";
import { FILTERABLE_TYPES, typeInfo } from "../../lib/eventTypes";

export default function TypeFilter({ counts }) {
  const { filters, dispatch } = useFilters();
  const allOn = filters.types.length === FILTERABLE_TYPES.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-400">Afet türü</p>
        <button
          onClick={() => dispatch({ type: "SET_ALL_TYPES", value: !allOn })}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          {allOn ? "Hiçbiri" : "Tümü"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {FILTERABLE_TYPES.map((t) => {
          const info = typeInfo(t);
          const on = filters.types.includes(t);
          const n = counts?.[t] ?? 0;

          return (
            <button
              key={t}
              onClick={() => dispatch({ type: "TOGGLE_TYPE", value: t })}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                on
                  ? "bg-slate-700/80 text-slate-100"
                  : "bg-slate-800/40 text-slate-600"
              }`}
            >
              <span style={{ color: on ? info.color : undefined }}>
                {info.icon}
              </span>
              <span className="flex-1 text-left">{info.label}</span>
              <span className="tabular-nums text-slate-500">{n}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}