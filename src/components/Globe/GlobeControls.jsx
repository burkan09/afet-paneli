export default function GlobeControls({ rotating, onToggle, onReset }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-md text-sm text-slate-200 hover:bg-slate-900/70 transition-colors shadow-lg"
        aria-label={rotating ? "Dönmeyi durdur" : "Döndürmeyi başlat"}
      >
        <span className="text-xs">{rotating ? "❚❚" : "▶"}</span>
        {rotating ? "Durdur" : "Döndür"}
      </button>

      <button
        onClick={onReset}
        className="px-4 py-2 rounded-full border border-white/10 bg-slate-950/60 backdrop-blur-md text-sm text-slate-300 hover:bg-slate-900/70 transition-colors shadow-lg"
      >
        Görünümü sıfırla
      </button>
    </div>
  );
}