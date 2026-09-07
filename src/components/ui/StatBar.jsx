export default function StatBar({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-white/5">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-950/30 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            {s.label}
          </p>
          <p className="text-lg font-bold text-slate-100 tabular-nums leading-tight">
            {s.value}
          </p>
          {s.hint && <p className="text-[10px] text-slate-600">{s.hint}</p>}
        </div>
      ))}
    </div>
  );
}