import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { useSeismicity } from "../../hooks/useSeismicity";
import {
  resolutionForAltitude,
  binPoints,
  topBins,
  sample,
  throttle,
} from "../../lib/cluster";
import {
  magnitudeToColor,
  magnitudeToAltitude,
  magnitudeToRadius,
  magnitudeToRingRadius,
  magnitudeToRingSpeed,
  GLOBE_THEMES,
} from "../../lib/globeStyle";

const MAX_HISTORY_POINTS = 45000;

export default function EventGlobe({
  events,
  selected,
  onSelect,
  showHistory,
  onHotspots,
  theme = "day",
}) {
  const globeRef = useRef(null);
  const wrapperRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [resolution, setResolution] = useState(2);

  const { points } = useSeismicity();
  const style = GLOBE_THEMES[theme] ?? GLOBE_THEMES.day;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
    globe.controls().enableDamping = true;
  }, []);

  useEffect(() => {
    if (!selected || !globeRef.current) return;
    globeRef.current.pointOfView(
      { lat: selected.lat, lng: selected.lon ?? selected.lng, altitude: 1.6 },
      900
    );
  }, [selected]);

  useEffect(() => {
    if (points.length === 0) return;
    const bins = binPoints(points, 2);
    onHotspots?.(topBins(bins, 10));
  }, [points, onHotspots]);

  const handleZoom = useMemo(
    () =>
      throttle((pov) => setResolution(resolutionForAltitude(pov.altitude)), 400),
    []
  );

  const historyPoints = useMemo(() => {
    if (!showHistory || points.length === 0) return [];
    return sample(points, MAX_HISTORY_POINTS).map(([lat, lng]) => ({
      lat,
      lng,
    }));
  }, [points, showHistory]);

  const ringData = useMemo(
    () => [...events].sort((a, b) => b.magnitude - a.magnitude).slice(0, 20),
    [events]
  );

  return (
    <div ref={wrapperRef} className="absolute inset-0 bg-slate-950">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl={style.image}
        bumpImageUrl={style.bump ?? undefined}
        backgroundColor={style.background}
        showAtmosphere
        atmosphereColor={style.atmosphere}
        atmosphereAltitude={0.16}
        onZoom={handleZoom}
        hexBinPointsData={historyPoints}
        hexBinPointLat="lat"
        hexBinPointLng="lng"
        hexBinResolution={resolution}
        hexBinMerge
        hexAltitude={0.012}
        hexTopColor={() => style.hexTop}
        hexSideColor={() => style.hexSide}
        hexTransitionDuration={0}
        pointsData={events}
        pointLat="lat"
        pointLng="lon"
        pointColor={(d) => magnitudeToColor(d.magnitude)}
        pointAltitude={(d) => magnitudeToAltitude(d.magnitude)}
        pointRadius={(d) => magnitudeToRadius(d.magnitude)}
        pointLabel={(d) => `${d.magnitude.toFixed(1)} — ${d.title}`}
        onPointClick={(d) => onSelect(d)}
        ringsData={ringData}
        ringLat="lat"
        ringLng="lon"
        ringColor={(d) => () => magnitudeToColor(d.magnitude)}
        ringMaxRadius={(d) => magnitudeToRingRadius(d.magnitude)}
        ringPropagationSpeed={(d) => magnitudeToRingSpeed(d.magnitude)}
        ringRepeatPeriod={1400}
      />
    </div>
  );
}