import { useMemo } from "react";
import { useFilters } from "../../context/FilterContext";
import {
  byTimeBucket,
  byMagnitudeBand,
  depthVsMagnitude,
} from "../../lib/aggregate";
import TimelineChart from "./TimelineChart";
import MagnitudeChart from "./MagnitudeChart";
import DepthScatter from "./DepthScatter";

export default function ChartGrid({ events }) {
  const { filters } = useFilters();

  const timeline = useMemo(
    () => byTimeBucket(events, filters.range),
    [events, filters.range]
  );
  const magnitudes = useMemo(() => byMagnitudeBand(events), [events]);
  const scatter = useMemo(() => depthVsMagnitude(events), [events]);

  if (events.length === 0) return null;

  return (
    <div className="mt-8 space-y-3">
      <TimelineChart data={timeline} />

      <div className="grid md:grid-cols-2 gap-4">
        <MagnitudeChart data={magnitudes} />
        <DepthScatter data={scatter} />
      </div>
    </div>
  );
}