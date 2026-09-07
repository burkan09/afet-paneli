import { useCallback, useMemo, useState } from "react";
import { FilterProvider, useFilters } from "./context/FilterContext";
import { useEarthquakes } from "./hooks/useEarthquakes";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { applyFilters, computeStats } from "./lib/filter";
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
  const { events, loading, error, updatedAt, reload } = useEarthquakes(
    filters.range
  );

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

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const energy = useMemo(
    () => energyComparison(totalEnergy(filtered)),
    [filtered]
  );

  const right = Math.max(20, window.innerWidth - 340);
  const bottom = Math.max(300, window.innerHeight - 340);
  
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
        title="Küresel Deprem Paneli"
        initial={{ x: 20, y: 20 }}
        width={300}
        maxHeight={200}
      >
        <StatBar
          stats={[
            { label: "Olay sayısı", value: stats.count },
            { label: "En büyük", value: stats.max, hint: "büyüklük" },
            { label: "Ort. derinlik", value: stats.avgDepth },
            { label: "Toplam enerji", value: energy, hint: "TNT eşdeğeri" },
          ]}
        />
        {updatedAt && (
          <p className="text-[10px] text-slate-500 px-3 py-2">
            Son güncelleme: {formatTime(updatedAt)}
            {filters.autoRefresh && " · otomatik"}
          </p>
        )}
      </FloatingPanel>

      {filters.showHistory && (
        <FloatingPanel
          title="En aktif bölgeler"
          initial={{ x: 20, y: 250 }}
          width={280}
        >
          <HotspotPanel bins={hotspots} onSelect={handleHotspotClick} />
        </FloatingPanel>
      )}

      <FloatingPanel
        title="Filtreler"
        initial={{ x: right, y: 20 }}
        width={320}
        maxHeight={520}
      >
        <FilterPanel />
      </FloatingPanel>

      <FloatingPanel
        title="Seçili olay"
        initial={{ x: right, y: 470 }}
        width={320}
      >
        <DetailPanel event={detail} onClose={() => setDetail(null)} />
      </FloatingPanel>

      <FloatingPanel
        title="Olay listesi"
        initial={{ x: 20, y: bottom }}
        width={420}
        maxHeight={260}
      >
        <div className="p-3">
          <EventList
            events={filtered}
            loading={loading}
            error={error}
            onRetry={reload}
          />
        </div>
      </FloatingPanel>

      <FloatingPanel
        title="Grafikler"
        initial={{ x: 460, y: bottom }}
        width={520}
        maxHeight={300}
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