import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { magnitudeToColor } from "../../lib/globeStyle";

export default function MagnitudeChart({ data }) {
  return (
    <div className="bg-slate-800/40 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        Büyüklük dağılımı
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid stroke="#1e293b" vertical={false} />
          <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#475569"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "#1e293b66" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v) => [v, "deprem"]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={magnitudeToColor(Number(d.label[0]) + 0.5)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}