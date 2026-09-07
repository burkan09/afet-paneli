import { useCallback, useMemo, useState } from "react";
import { FilterProvider, useFilters } from "./context/FilterContext";
import { useDisasters } from "./hooks/useDisasters";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { applyFilters, computeStats, countByType } from "./lib/filter";
import { totalEnergy, energyComparison } from "./lib/energy";
import FilterPanel from "./components/Filters/FilterPanel";
import EventList from "./components/EventList";
import EventGlobe from "./components/Globe/EventGlobe";
import HotspotPanel from "./components/Globe/HotspotPanel";
import DetailPanel from "./components/DetailPanel/DetailPanel";
import ChartGrid from "./components/Charts/ChartGrid";
import FloatingPanel from "./components/ui/FloatingPanel";
import StatBar from "./components/ui/StatBar";
import { formatTime } from "./lib/format";

function Dashboard() {
  const { filters } = useFilters();
  const { events, loading, error, updatedAt, sourceErrors, reload } =
    useDisasters(filters.range);

  const [detail, setDetail] = useState(null);
  const [focus, setFocus] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  useAutoRefresh(reload, 60000, filters.autoRefresh);

  const handleSelect = useCallback((d) => {
    setDetail(d);
    setFocus(d ? { lat: d.lat, lon: d.lon } : null);
  }, []);

  const handleHotspotClick = useCallback((b) => {
    setFocus({ lat: b.lat, lon: b.lng });
  }, []);

  const handleHotspots = useCallback((next) => setHotspots(next), []);

  const filtered = useMemo(
    () => applyFilters(events, filters).sort((a, b) => b.time - a.time),
    [events, filters]
  );

  const counts = useMemo(() => countByType(events), [events]);
  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const energy = useMemo(
    () =>
      energyComparison(
        totalEnergy(filtered.filter((e) => e.magnitude != null))
      ),
    [filtered]
  );

  const right = Math.max(20, window.innerWidth - 350);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <EventGlobe
        events={filtered}
        selected={focus}
        onSelect={handleSelect}
        showHistory={filters.showHistory}
        onHotspots={handleHotspots}
        theme={filters.theme}
      />

      <FloatingPanel
        title="Küresel Afet Paneli"
        initial={{ x: 20, y: 20 }}
        width={300}
        maxHeight={220}
      >
        <StatBar
          stats={[
            { label: "Toplam olay", value: stats.count },
            { label: "Deprem", value: stats.quakes },
            { label: "En büyük", value: stats.max, hint: "büyüklük" },
            { label: "Enerji", value: energy, hint: "TNT eşdeğeri" },
          ]}
        />
        {updatedAt && (
          <p className="text-[10px] text-slate-500 px-3 py-2">
            Son güncelleme: {formatTime(updatedAt)}
            {sourceErrors.length > 0 && (
              <span className="text-amber-500">
                {" "}
                · {sourceErrors.join(", ")} yanıt vermedi
              </span>
            )}
          </p>
        )}
      </FloatingPanel>

      {filters.showHistory && (
        <FloatingPanel
          title="En aktif bölgeler"
          initial={{ x: 20, y: 270 }}
          width={280}
        >
          <HotspotPanel bins={hotspots} onSelect={handleHotspotClick} />
        </FloatingPanel>
      )}

      <FloatingPanel
        title="Filtreler"
        initial={{ x: right, y: 20 }}
        width={330}
        maxHeight={560}
      >
        <FilterPanel counts={counts} />
      </FloatingPanel>

      <FloatingPanel
        title="Olay listesi"
        initial={{ x: 340, y: 20 }}
        width={400}
        maxHeight={340}
      >
        <div className="p-3">
          <EventList
            events={filtered}
            loading={loading}
            error={error}
            onRetry={reload}
            onSelect={handleSelect}
          />
        </div>
      </FloatingPanel>

      <FloatingPanel
        title="Seçili olay"
        initial={{ x: 760, y: 20 }}
        width={330}
      >
        <DetailPanel event={detail} onClose={() => setDetail(null)} />
      </FloatingPanel>

      <FloatingPanel
        title="Grafikler"
        initial={{ x: 340, y: 400 }}
        width={420}
        maxHeight={380}
      >
        <div className="p-3">
          <ChartGrid events={filtered} />
        </div>
      </FloatingPanel>
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