import { useCallback, useMemo, useState } from "react";
import { FilterProvider, useFilters } from "./context/FilterContext";
import { useDisasters } from "./hooks/useDisasters";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { usePanels } from "./hooks/usePanels";
import { useIsMobile } from "./hooks/useIsMobile";
import { useIsLandscape } from "./hooks/useOrientation";
import { applyFilters, computeStats, countByType } from "./lib/filter";
import { totalEnergy, energyComparison } from "./lib/energy";
import FilterPanel from "./components/Filters/FilterPanel";
import EventList from "./components/EventList";
import EventGlobe from "./components/Globe/EventGlobe";
import HotspotPanel from "./components/Globe/HotspotPanel";
import MajorEventsPanel from "./components/Globe/MajorEventsPanel";
import DetailPanel from "./components/DetailPanel/DetailPanel";
import ChartGrid from "./components/Charts/ChartGrid";
import GutenbergChart from "./components/Charts/GutenbergChart";
import FloatingPanel from "./components/ui/FloatingPanel";
import ToolbarMenu from "./components/ui/ToolbarMenu";
import StatBar from "./components/ui/StatBar";
import { formatTime } from "./lib/format";

function Dashboard() {
  const { filters } = useFilters();
  const { events, loading, error, updatedAt, stale, sourceErrors, reload } =
    useDisasters(filters.range);

  const { panels, toggle, reset, atMinimum, minOpen } = usePanels();
  const isMobile = useIsMobile();
  const isLandscape = useIsLandscape();

  const [detail, setDetail] = useState(null);
  const [focus, setFocus] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  useAutoRefresh(reload, 60000, filters.autoRefresh);

  const handleSelect = useCallback((d) => {
    setDetail(d);
    setFocus(d ? { lat: d.lat, lon: d.lon } : null);
  }, []);

  const handleFocus = useCallback((p) => setFocus(p), []);
  const handleHotspotClick = useCallback(
    (b) => setFocus({ lat: b.lat, lon: b.lng }),
    []
  );
  const handleHotspots = useCallback((next) => setHotspots(next), []);

  const filtered = useMemo(
    () => applyFilters(events, filters).sort((a, b) => b.time - a.time),
    [events, filters]
  );

  const counts = useMemo(() => countByType(events), [events]);
  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const energy = useMemo(
    () =>
      energyComparison(totalEnergy(filtered.filter((e) => e.magnitude != null))),
    [filtered]
  );

  const right = Math.max(20, window.innerWidth - 350);
  const s = isMobile;

  const show = (key) => (s ? true : panels[key].open);
  const common = { stacked: s, defaultOpen: !s };

  const globe = (
    <EventGlobe
      events={filtered}
      selected={focus}
      onSelect={handleSelect}
      showHistory={filters.showHistory}
      onHotspots={handleHotspots}
      theme={filters.theme}
    />
  );

  const panelNodes = (
    <>
      {show("stats") && (
        <FloatingPanel
          {...common}
          title="Küresel Afet Paneli"
          initial={{ x: 20, y: 20 }}
          width={300}
          maxHeight={240}
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
              {stale ? "Çevrimdışı veri: " : "Son güncelleme: "}
              {formatTime(updatedAt)}
              {sourceErrors.length > 0 && (
                <span className="text-amber-500">
                  {" "}
                  · {sourceErrors.join(", ")} yanıt vermedi
                </span>
              )}
            </p>
          )}
        </FloatingPanel>
      )}

      {show("hotspots") && (
        <FloatingPanel
          {...common}
          title="En aktif bölgeler"
          initial={{ x: 20, y: 280 }}
          width={280}
          maxHeight={360}
        >
          <HotspotPanel bins={hotspots} onSelect={handleHotspotClick} />
        </FloatingPanel>
      )}

      {show("major") && (
        <FloatingPanel
          {...common}
          title="Büyük depremler"
          initial={{ x: 20, y: 570 }}
          width={300}
          maxHeight={340}
        >
          <MajorEventsPanel onFocus={handleFocus} />
        </FloatingPanel>
      )}

      {show("filters") && (
        <FloatingPanel
          {...common}
          title="Filtreler"
          initial={{ x: right, y: 20 }}
          width={330}
          maxHeight={560}
        >
          <FilterPanel counts={counts} />
        </FloatingPanel>
      )}

      {show("events") && (
        <FloatingPanel
          {...common}
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
      )}

      {show("detail") && (
        <FloatingPanel
          {...common}
          title="Seçili olay"
          initial={{ x: 760, y: 20 }}
          width={330}
          maxHeight={420}
        >
          <DetailPanel event={detail} onClose={() => setDetail(null)} />
        </FloatingPanel>
      )}

      {show("charts") && (
        <FloatingPanel
          {...common}
          title="Grafikler"
          initial={{ x: 340, y: 400 }}
          width={420}
          maxHeight={380}
        >
          <div className="p-3">
            <ChartGrid events={filtered} />
          </div>
        </FloatingPanel>
      )}

      {show("gutenberg") && (
        <FloatingPanel
          {...common}
          title="Gutenberg-Richter"
          initial={{ x: 760, y: 460 }}
          width={340}
          maxHeight={430}
        >
          <GutenbergChart />
        </FloatingPanel>
      )}
    </>
  );

  if (isMobile && isLandscape) {
    return (
      <div className="flex h-screen bg-slate-950 text-slate-200">
        <div className="relative w-1/2 shrink-0">{globe}</div>
        <div className="w-1/2 overflow-y-auto p-2 space-y-2 border-l border-white/10">
          {panelNodes}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
        <div className="relative h-[45vh] min-h-[240px] shrink-0">{globe}</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">{panelNodes}</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-200">
      {globe}
      <ToolbarMenu
        panels={panels}
        onToggle={toggle}
        onReset={reset}
        atMinimum={atMinimum}
        minOpen={minOpen}
      />
      {panelNodes}
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