import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { useSeismicity } from "../../hooks/useSeismicity";
import { usePlates } from "../../hooks/usePlates";
import {
  resolutionForAltitude,
  binPoints,
  topBins,
  sample,
  throttle,
} from "../../lib/cluster";
import { GLOBE_THEMES } from "../../lib/globeStyle";
import { impactToColor } from "../../lib/impact";
import { typeInfo } from "../../lib/eventTypes";

const MAX_HISTORY_POINTS = 45000;

export default function EventGlobe({
  events,
  selected,
  onSelect,
  showHistory,
  showPlates,
  faultLine,
  faultVelocity = 0,
  selectedPlate,
  onPlateClick,
  onHotspots,
  theme = "day",
}) {
  const globeRef = useRef(null);
  const wrapperRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [resolution, setResolution] = useState(2);

  const { points } = useSeismicity();
  const plates = usePlates();
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

  const paths = useMemo(() => {
    const out = showPlates ? [...plates] : [];

    if (faultLine?.length) {
      const coords =
        faultVelocity < 0 ? [...faultLine].reverse() : [...faultLine];
      out.push({ id: "__fault", name: "fay", kind: "fault", coords });
    }

    return out;
  }, [plates, showPlates, faultLine, faultVelocity]);

  const dashTime = useMemo(() => {
    const v = Math.abs(faultVelocity);
    if (!v) return 0;
    return Math.min(20000, Math.max(1500, 24000 / v));
  }, [faultVelocity]);

  const ringData = useMemo(
    () =>
      [...events].sort((a, b) => b.impactScore - a.impactScore).slice(0, 20),
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
        pathsData={paths}
        pathPoints={(d) => d.coords}
        pathPointLat={(p) => p[0]}
        pathPointLng={(p) => p[1]}
        pathPointAlt={(d) => (d.kind === "fault" ? 0.012 : 0.005)}
        pathColor={(d) => {
          if (d.kind === "fault") return "#22d3ee";
          if (d.pairKey === selectedPlate) return "#ef4444";
          return d.subduction ? "#fb923c" : "#facc15";
        }}
        pathStroke={(d) => {
          if (d.kind === "fault") return 2.2;
          if (d.pairKey === selectedPlate) return 1.8;
          return d.subduction ? 1.0 : 0.7;
        }}        pathDashLength={(d) =>
          d.kind === "fault" ? 0.04 : d.subduction ? 0.6 : 1
        }
        pathDashGap={(d) =>
          d.kind === "fault" ? 0.03 : d.subduction ? 0.15 : 0
        }
        pathDashAnimateTime={(d) => (d.kind === "fault" ? dashTime : 0)}
        pathLabel={(d) => (d.kind === "fault" ? "" : d.name)}
        onPathClick={(d) => d.kind === "plate" && onPlateClick?.(d.pairKey)}
        pathTransitionDuration={0}
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
        pointColor={(d) => impactToColor(d.impactScore)}
        pointAltitude={(d) => Math.max(0.004, (d.impactScore / 100) * 0.06)}
        pointRadius={(d) => Math.max(0.12, (d.impactScore / 100) * 0.35)}
        pointLabel={(d) =>
          `${typeInfo(d.type).label}${
            d.magnitude != null ? ` M${d.magnitude.toFixed(1)}` : ""
          } — ${d.title}`
        }
        onPointClick={(d) => onSelect(d)}
        ringsData={ringData}
        ringLat="lat"
        ringLng="lon"
        ringColor={(d) => () => impactToColor(d.impactScore)}
        ringMaxRadius={(d) => Math.max(1, (d.impactScore / 100) * 6)}
        ringPropagationSpeed={(d) => 0.6 + (d.impactScore / 100) * 1.4}
        ringRepeatPeriod={1400}
      />
    </div>
  );
}