import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useSeismicity } from "../../hooks/useSeismicity";
import {
  SECTION_PRESETS,
  projectSection,
  sectionStats,
} from "../../lib/depthSection";

export default function DepthSection() {
  const { points, loading } = useSeismicity();
  const [key, setKey] = useState("japonya");

  const preset = SECTION_PRESETS[key];

  const rows = useMemo(
    () => (points.length ? projectSection(points, preset) : []),
    [points, preset]
  );

  const stats = useMemo(() => sectionStats(rows), [rows]);

  if (loading) {
    return <p className="p-4 text-xs text-slate-400">Katalog yükleniyor...</p>;
  }

  return (
    <div className="p-3 text-slate-200">
      <select
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full bg-slate-800 text-slate-200 rounded px-2 py-1.5 text-xs mb-3 border border-slate-700 focus:outline-none focus:border-cyan-500"
      >
        {Object.entries(SECTION_PRESETS).map(([k, p]) => (
          <option key={k} value={k}>
            {p.label}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 8, right: 12, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="distance"
            name="Mesafe"
            unit=" km"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            label={{
              value: "Hendekten uzaklık (km)",
              position: "insideBottom",
              offset: -10,
              fill: "#64748b",
              fontSize: 9,
            }}
          />
          <YAxis
            type="number"
            dataKey="depth"
            name="Derinlik"
            unit=" km"
            reversed
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            label={{
              value: "Derinlik (km)",
              angle: -90,
              position: "insideLeft",
              fill: "#64748b",
              fontSize: 9,
            }}
          />
          <ZAxis dataKey="size" range={[6, 120]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "#475569" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              fontSize: 11,
              color: "#e2e8f0",
            }}
          />
          <Scatter data={rows} fill="#f97316" fillOpacity={0.5} />
        </ScatterChart>
      </ResponsiveContainer>

      {stats && (
        <dl className="mt-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <dt className="text-slate-400">Kesitteki deprem</dt>
            <dd className="tabular-nums">{stats.total.toLocaleString("tr-TR")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Sığ (0-70 km)</dt>
            <dd className="tabular-nums">{stats.shallow}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Orta (70-300 km)</dt>
            <dd className="tabular-nums">{stats.mid}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Derin (300+ km)</dt>
            <dd className="tabular-nums">{stats.deep}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">En derin</dt>
            <dd className="tabular-nums">{stats.maxDepth} km</dd>
          </div>
        </dl>
      )}

      <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
        Depremler kesit ekseni üzerine izdüşürüldü. Dalma-batma zonlarında
        noktalar eğimli bir düzlem boyunca dizilir — bu, okyanus levhasının
        daldığı yüzeydir (Wadati-Benioff zonu). Kıtasal faylarda ise derinlik
        30 km civarında kalır.
      </p>
    </div>
  );
}