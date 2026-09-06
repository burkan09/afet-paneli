import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import {
  magnitudeToColor,
  magnitudeToAltitude,
  magnitudeToRadius,
  magnitudeToRingRadius,
  magnitudeToRingSpeed,
  GLOBE_TEXTURES,
} from "../../lib/globeStyle";

export default function EventGlobe({ events, selected, onSelect }) {
  const globeRef = useRef(null);
  const wrapperRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

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
    globe.controls().autoRotateSpeed = 0.35;
    globe.controls().enableDamping = true;
  }, []);

  useEffect(() => {
    if (!selected || !globeRef.current) return;

    globeRef.current.pointOfView(
      { lat: selected.lat, lng: selected.lon, altitude: 1.6 },
      900
    );
  }, [selected]);

  const ringData = useMemo(
    () => [...events].sort((a, b) => b.magnitude - a.magnitude).slice(0, 25),
    [events]
  );

  return (
    <div
      ref={wrapperRef}
      className="w-full h-[420px] sm:h-[560px] rounded-lg overflow-hidden bg-slate-950"
    >
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl={GLOBE_TEXTURES.night}
        bumpImageUrl={GLOBE_TEXTURES.topology}
        backgroundColor="rgba(2,6,23,1)"
        showAtmosphere
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.18}
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