import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAnalysis } from "../../hooks/useAnalysis";

export default function GutenbergChart() {
  const { data, loading, error } = useAnalysis("gutenberg");
  const [region, setRegion] = useState("global");
  const [query, setQuery] = useState("");

  const names = useMemo(() => {
    if (!data) return [];
    return Object.keys(data)
      .filter((k) => k !== "global")
      .sort((a, b) => a.localeCompare(b, "tr"));
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? names.filter((n) => n.toLowerCase().includes(q)) : names;
  }, [names, query]);

  if (loading) {
    return <p className="p-4 text-xs text-slate-400">Analiz yükleniyor...</p>;
  }

  if (error || !data) {
    return (
      <p className="p-4 text-xs text-slate-400">
        Analiz dosyası yok. `python analysis/gutenberg.py` çalıştırın.
      </p>
    );
  }

  const fit = data[region] ?? data.global;
  if (!fit) return null;

  return (
    <div className="p-3 text-slate-200">
      <div className="flex gap-1.5 mb-2">
        <button
          onClick={() => setRegion("global")}
          className={`px-2.5 py-1 rounded text-[11px] shrink-0 transition-colors ${
            region === "global"
              ? "bg-orange-600 text-white"
              : "bg-slate-700/60 text-slate-300 hover:bg-slate-600"
          }`}
        >
          Dünya
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ülke ara..."
          className="flex-1 min-w-0 bg-slate-900/70 border border-slate-700 rounded px-2 py-1 text-[11px] placeholder:text-slate-600 focus:outline-none focus:border-orange-600"
        />
      </div>

      <select
        value={region === "global" ? "" : region}
        onChange={(e) => e.target.value && setRegion(e.target.value)}
        size={query ? 5 : 1}
        className="w-full bg-slate-800 text-slate-200 rounded px-2 py-1 text-[11px] mb-3 border border-slate-700 focus:outline-none focus:border-orange-600"
      >
        <option value="">Ülke seç ({names.length})</option>
        {filtered.map((k) => (
          <option key={k} value={k}>
            {k} · b={data[k].b.toFixed(2)}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={165}>
        <ComposedChart data={fit.curve}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis
            dataKey="mag"
            type="number"
            domain={["dataMin", "dataMax"]}
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
          />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              fontSize: 11,
              color: "#e2e8f0",
            }}
            labelFormatter={(m) => `M ${m}`}
          />
          <Scatter dataKey="logN" fill="#38bdf8" />
          <Line
            dataKey="fitted"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 3"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-300 mt-2 font-medium">
        {region === "global" ? "Dünya" : region}
      </p>

      <dl className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between">
          <dt className="text-slate-400">b değeri</dt>
          <dd className="text-orange-400 font-bold tabular-nums">
            {fit.b.toFixed(3)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Uyum (R²)</dt>
          <dd className="tabular-nums">{fit.r2.toFixed(4)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Olay sayısı</dt>
          <dd className="tabular-nums">{fit.n.toLocaleString("tr-TR")}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">M7 tekrarlanma</dt>
          <dd className="tabular-nums">
            {fit.recurrence["M7.0"]?.toFixed(1)} yıl
          </dd>
        </div>
      </dl>

      {fit.n < 800 && (
        <p className="text-[10px] text-amber-500/80 mt-2">
          {fit.n} olay — belirsizlik yüksek, dikkatli yorumlayın.
        </p>
      )}
    </div>
  );
}