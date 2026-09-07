import { useEffect, useState } from "react";

export function useIsLandscape() {
  const [landscape, setLandscape] = useState(
    () => window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape)");
    const handler = (e) => setLandscape(e.matches);

    query.addEventListener("change", handler);
    setLandscape(query.matches);

    return () => query.removeEventListener("change", handler);
  }, []);

  return landscape;
}