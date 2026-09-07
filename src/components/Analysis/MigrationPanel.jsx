import { useState } from "react";
import { useAnalysis } from "../../hooks/useAnalysis";
import MigrationChart from "./MigrationChart";
import SignificanceBadge from "./SignificanceBadge";

export default function MigrationPanel({ onFocus }) {
  const { data, loading, error } = useAnalysis("migration");
  const [key, setKey] = useState(null);

  if (loading) {
    return <p className="p-4 text-xs text-slate-400">Analiz yükleniyor...</p>;
  }

  if (error || !data) {
    return (
      <p className="p-4 text-xs text-slate-400">
        Analiz dosyası yok. `python analysis/migration.py` çalıştırın.
      </p>
    );
  }

  const keys = Object.keys(data);
  const active = key && data[key] ? key : keys[0];
  const fault = data[active];
  if (!fault) return null;

  const { migration: m, recurrence: rec } = fault;

  return (
    <div className="p-3 text-slate-200">
      <select
        value={active}
        onChange={(e) => setKey(e.target.value)}
        className="w-full bg-slate-800 text-slate-200 rounded px-2 py-1.5 text-xs mb-3 border border-slate-700 focus:outline-none focus:border-orange-600"
      >
        {keys.map((k) => (
          <option key={k} value={k}>
            {data[k].label}
          </option>
        ))}
      </select>

      <MigrationChart fault={fault} onSelect={onFocus} />

      <div className="mt-3">
        <SignificanceBadge significance={fault.significance} />
      </div>

      <dl className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <dt className="text-slate-400">Göç hızı</dt>
          <dd className="text-orange-400 font-bold tabular-nums">
            {Math.abs(m.velocity_km_per_year).toFixed(1)} km/yıl {m.direction}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Doğrusal uyum (R²)</dt>
          <dd className="tabular-nums">{m.r2.toFixed(3)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Olay sayısı</dt>
          <dd className="tabular-nums">
            {fault.n} · M{fault.min_magnitude}+
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Fay uzunluğu</dt>
          <dd className="tabular-nums">{fault.length_km.toFixed(0)} km</dd>
        </div>

        <div className="border-t border-slate-800 pt-1.5 mt-1.5" />

        <div className="flex justify-between">
          <dt className="text-slate-400">Ortalama aralık</dt>
          <dd className="tabular-nums">
            {rec.mean_gap_years?.toFixed(1)} ± {rec.std_gap_years?.toFixed(1)} yıl
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">En uzun sessizlik</dt>
          <dd className="tabular-nums">{rec.max_gap_years?.toFixed(1)} yıl</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Son olaydan beri</dt>
          <dd className="tabular-nums">{rec.years_since_last?.toFixed(1)} yıl</dd>
        </div>
      </dl>

      <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
        Depremler fay eksenine izdüşürülüp zamana göre çizildi. Eğik bant göç
        anlamına gelir. Bu analiz gelecekteki depremleri tahmin etmez; yalnızca
        geçmiş veride desen olup olmadığını ölçer.
      </p>
    </div>
  );
}