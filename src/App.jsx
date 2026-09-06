import { useMemo } from "react";
import { FilterProvider, useFilters } from "./context/FilterContext";
import { useEarthquakes } from "./hooks/useEarthquakes";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { applyFilters, computeStats } from "./lib/filter";
import FilterPanel from "./components/Filters/FilterPanel";
import EventList from "./components/EventList";
import StatCard from "./components/ui/StatCard";
import { formatTime } from "./lib/format";

function Dashboard() {
  const { filters } = useFilters();
  const { events, loading, error, updatedAt, reload } = useEarthquakes(
    filters.range
  );

  useAutoRefresh(reload, 60000, filters.autoRefresh);

  const filtered = useMemo(
    () => applyFilters(events, filters).sort((a, b) => b.time - a.time),
    [events, filters]
  );

  const stats = useMemo(() => computeStats(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-emerald-400">
            Küresel Deprem Paneli
          </h1>
          {updatedAt && (
            <p className="text-xs text-slate-500 mt-1">
              Son güncelleme: {formatTime(updatedAt)}
              {filters.autoRefresh && " · otomatik yenileme açık"}
            </p>
          )}
        </header>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Olay sayısı" value={stats.count} />
          <StatCard label="En büyük" value={stats.max} hint="büyüklük" />
          <StatCard label="Ort. derinlik" value={stats.avgDepth} />
        </div>

        <FilterPanel />

        <EventList
          events={filtered}
          loading={loading}
          error={error}
          onRetry={reload}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  );
}