import EventCard from "./EventCard";

export default function EventList({ events, loading, error, onRetry }) {
  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="h-16 bg-slate-800/40 rounded-lg animate-pulse" />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-900/60 rounded-lg p-6 text-center">
        <p className="text-red-300 mb-4">Veri alınamadı: {error}</p>
        <button
          onClick={onRetry}
          className="bg-red-900 hover:bg-red-800 text-red-100 px-4 py-2 rounded transition-colors"
        >
          Tekrar dene
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-800/40 rounded-lg p-8 text-center text-slate-500">
        Bu kriterlere uyan deprem bulunamadı. Filtreyi gevşetmeyi deneyin.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </ul>
  );
}