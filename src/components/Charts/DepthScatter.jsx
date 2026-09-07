import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DepthScatter({ data }) {
  if (data.length === 0) return null;

  return (
    <div className="bg-slate-800/40 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        Derinlik ve büyüklük ilişkisi
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 8, right: 8, bottom: 16, left: 0 }}>
          <CartesianGrid stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="depth"
            name="Derinlik"
            unit=" km"
            stroke="#475569"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="magnitude"
            name="Büyüklük"
            stroke="#475569"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "#475569" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Scatter data={data} fill="#38bdf8" fillOpacity={0.55} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}