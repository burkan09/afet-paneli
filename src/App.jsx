import { useMemo, useState } from "react";
import { FilterProvider, useFilters } from "./context/FilterContext";
import { useEarthquakes } from "./hooks/useEarthquakes";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { applyFilters, computeStats } from "./lib/filter";
import { totalEnergy, energyComparison } from "./lib/energy";
import FilterPanel from "./components/Filters/FilterPanel";
import EventList from "./components/EventList";
import EventGlobe from "./components/Globe/EventGlobe";
import DetailPanel from "./components/DetailPanel/DetailPanel";
import StatCard from "./components/ui/StatCard";
import { formatTime } from "./lib/format";

function Dashboard() {
  const { filters } = useFilters();
  const { events, loading, error, updatedAt, reload } = useEarthquakes(
    filters.range
  );
  const [selected, setSelected] = useState(null);

  useAutoRefresh(reload, 60000, filters.autoRefresh);

  const filtered = useMemo(
    () => applyFilters(events, filters).sort((a, b) => b.time - a.time),
    [events, filters]
  );

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const energy = useMemo(
    () => energyComparison(totalEnergy(filtered)),
    [filtered]
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <header className="mb-6">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Olay sayısı" value={stats.count} />
          <StatCard label="En büyük" value={stats.max} hint="büyüklük" />
          <StatCard label="Ort. derinlik" value={stats.avgDepth} />
          <StatCard label="Toplam enerji" value={energy} hint="TNT eşdeğeri" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EventGlobe
              events={filtered}
              selected={selected}
              onSelect={setSelected}
            />
          </div>

          <div className="space-y-6">
            <DetailPanel event={selected} onClose={() => setSelected(null)} />
            <FilterPanel />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Olay listesi</h2>
          <EventList
            events={filtered}
            loading={loading}
            error={error}
            onRetry={reload}
          />
        </div>
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