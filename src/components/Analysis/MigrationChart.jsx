import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ZAxis,
} from "recharts";

export default function MigrationChart({ fault, onSelect }) {
  const { events, migration } = fault;

  const data = events.map((e) => ({
    year: e.year,
    along: e.along,
    mag: e.mag,
    size: Math.pow(e.mag - 4, 2) * 12,
    lat: e.lat,
    lon: e.lon,
  }));

  const years = data.map((d) => d.year);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);

  const fitLine = [
    { year: minY, fitted: migration.intercept + migration.velocity_km_per_year * minY },
    { year: maxY, fitted: migration.intercept + migration.velocity_km_per_year * maxY },
  ];

  const merged = [...data, ...fitLine].sort((a, b) => a.year - b.year);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart
        data={merged}
        margin={{ top: 8, right: 8, bottom: 18, left: 0 }}
        onClick={(s) => {
          const p = s?.activePayload?.[0]?.payload;
          if (p?.lat != null) onSelect?.({ lat: p.lat, lon: p.lon });
        }}
      >
        <CartesianGrid stroke="#1e293b" />
        <XAxis
          dataKey="year"
          type="number"
          domain={["dataMin", "dataMax"]}
          stroke="#64748b"
          fontSize={10}
          tickLine={false}
          tickFormatter={(v) => Math.round(v)}
          label={{
            value: "Yıl",
            position: "insideBottom",
            offset: -8,
            fill: "#64748b",
            fontSize: 10,
          }}
        />
        <YAxis
          stroke="#64748b"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          label={{
            value: "Fay boyunca km",
            angle: -90,
            position: "insideLeft",
            fill: "#64748b",
            fontSize: 10,
          }}
        />
        <ZAxis dataKey="size" range={[20, 220]} />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 8,
            fontSize: 11,
            color: "#e2e8f0",
          }}
          formatter={(v, n) =>
            n === "along" ? [`${v} km`, "konum"] : [v, n]
          }
          labelFormatter={(y) => `${Math.round(y)}`}
        />
        <Scatter dataKey="along" fill="#f97316" fillOpacity={0.85} />
        <Line
          dataKey="fitted"
          stroke="#38bdf8"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 4"
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}