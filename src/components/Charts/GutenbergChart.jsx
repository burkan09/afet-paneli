import { useState } from "react";
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

const LABELS = {
  global: "Dünya",
  turkiye: "Türkiye",
  yunanistan: "Yunanistan",
  italya: "İtalya",
  izlanda: "İzlanda",
  iran: "İran",
  afganistan: "Afganistan",
  himalaya: "Himalaya",
  japonya: "Japonya",
  tayvan: "Tayvan",
  filipinler: "Filipinler",
  endonezya: "Endonezya",
  papua: "Papua",
  kamcatka: "Kamçatka",
  yeni_zelanda: "Yeni Zelanda",
  alaska: "Alaska",
  kaliforniya: "Kaliforniya",
  meksika: "Meksika",
  karayipler: "Karayipler",
  peru: "Peru",
  sili: "Şili",
  dogu_afrika: "Doğu Afrika Rifti",
};

const PINNED = ["global", "turkiye"];

export default function GutenbergChart() {
  const { data, loading, error } = useAnalysis("gutenberg");
  const [region, setRegion] = useState("global");

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

  const fit = data[region];
  if (!fit) return null;

  const others = Object.keys(data).filter((k) => !PINNED.includes(k));

  return (
    <div className="p-3 text-slate-200">
      <div className="flex items-center gap-1.5 mb-3">
        {PINNED.filter((k) => data[k]).map((key) => (
          <button
            key={key}
            onClick={() => setRegion(key)}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
              region === key
                ? "bg-orange-600 text-white"
                : "bg-slate-700/60 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {LABELS[key] ?? key}
          </button>
        ))}

        <select
          value={PINNED.includes(region) ? "" : region}
          onChange={(e) => e.target.value && setRegion(e.target.value)}
          className={`flex-1 min-w-0 rounded px-2 py-1 text-[11px] border-0 focus:outline-none ${
            PINNED.includes(region)
              ? "bg-slate-700/60 text-slate-300"
              : "bg-orange-600 text-white"
          }`}
        >
          <option value="">Bölge seç...</option>
          {others.map((key) => (
            <option key={key} value={key} className="bg-slate-800 text-slate-200">
              {LABELS[key] ?? key}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={170}>
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
          <YAxis
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
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

      <dl className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <dt className="text-slate-400">b değeri</dt>
          <dd className="text-orange-400 font-bold tabular-nums">
            {fit.b.toFixed(3)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Uyum (R²)</dt>
          <dd className="text-slate-200 tabular-nums">{fit.r2.toFixed(4)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Olay sayısı</dt>
          <dd className="text-slate-200 tabular-nums">
            {fit.n.toLocaleString("tr-TR")}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">M7 tekrarlanma</dt>
          <dd className="text-slate-200 tabular-nums">
            {fit.recurrence["M7.0"]?.toFixed(1)} yıl
          </dd>
        </div>
      </dl>

      {fit.n < 500 && (
        <p className="text-[10px] text-amber-500/80 mt-2">
          Küçük örneklem — b değeri belirsizliği yüksek.
        </p>
      )}

      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
        log₁₀(N) = a − b·M. Düşük b, küçük depremlere oranla daha çok büyük
        deprem demektir: kilitli faylar, yüksek gerilme birikimi.
      </p>
    </div>
  );
}