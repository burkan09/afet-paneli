import EventCard from "./EventCard";

export default function EventList({ events, loading, error, onRetry, onSelect }) {
  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="h-14 bg-slate-800/40 rounded-lg animate-pulse" />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-900/60 rounded-lg p-6 text-center">
        <p className="text-red-300 mb-4 text-sm">Veri alınamadı: {error}</p>
        <button
          onClick={onRetry}
          className="bg-red-900 hover:bg-red-800 text-red-100 px-4 py-2 rounded text-sm transition-colors"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-8 text-center text-slate-500 text-sm">
        Bu kriterlere uyan olay bulunamadı. Filtreyi gevşetmeyi deneyin.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <EventCard key={e.id} event={e} onSelect={onSelect} />
      ))}
    </ul>
  );
}