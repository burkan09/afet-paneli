export default function StatCard({ label, value, hint }) {
  return (
    <div className="bg-slate-800/60 rounded-lg px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-100 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}