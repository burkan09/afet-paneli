export default function SignificanceBadge({ significance }) {
  if (!significance) return null;

  const { r, p, n_permutations } = significance;
  const strong = p < 0.01;
  const ok = p < 0.05;

  const color = strong
    ? "text-emerald-400 border-emerald-800 bg-emerald-950/40"
    : ok
    ? "text-amber-400 border-amber-800 bg-amber-950/40"
    : "text-slate-400 border-slate-700 bg-slate-900/40";

  const verdict = strong
    ? "Güçlü desen"
    : ok
    ? "Zayıf desen"
    : "Tesadüften ayırt edilemiyor";

  return (
    <div className={`rounded-lg border px-3 py-2 ${color}`}>
      <p className="text-xs font-semibold">{verdict}</p>
      <p className="text-[10px] mt-1 opacity-80 leading-relaxed">
        Korelasyon r = {r.toFixed(3)} · p = {p.toFixed(4)}
        <br />
        {n_permutations.toLocaleString("tr-TR")} rastgele karıştırmanın
        {" "}
        {(p * 100).toFixed(2)}%'i bu kadar güçlü çıktı.
      </p>
    </div>
  );
}