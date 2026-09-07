export default function HotspotPanel({ bins, onSelect }) {
  if (!bins || bins.length === 0) return null;

  return (
    <div className="bg-slate-800/60 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">
        En aktif bölgeler
      </h3>

      <ol className="space-y-1 text-sm">
        {bins.map((b, i) => (
          <li key={b.cell}>
            <button
              onClick={() => onSelect(b)}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-slate-700/60 text-left transition-colors"
            >
              <span className="text-slate-600 w-4 tabular-nums">{i + 1}</span>
              <span className="flex-1 text-slate-400 tabular-nums text-xs">
                {b.lat.toFixed(1)}, {b.lng.toFixed(1)}
              </span>
              <span className="text-emerald-400 tabular-nums font-medium">
                {b.count}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="text-xs text-slate-600 mt-3">
        Son 20 yılda M4.5+ deprem sayısı
      </p>
    </div>
  );
}