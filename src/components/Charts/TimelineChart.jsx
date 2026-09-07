import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatTime } from "../../lib/format";

export default function TimelineChart({ data }) {
  if (data.length === 0) return null;

  return (
    <div className="bg-slate-800/40 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        Zaman içinde deprem sayısı
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="time"
            tickFormatter={(t) =>
              new Date(t).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            stroke="#475569"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="#475569"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(t) => formatTime(t)}
            formatter={(v) => [v, "deprem"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#34d399"
            fill="#34d399"
            fillOpacity={0.18}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}