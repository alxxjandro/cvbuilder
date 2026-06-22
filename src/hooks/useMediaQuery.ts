import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query and reports whether it currently matches.
 * Used to swap an immersive, motion-heavy layout for a simpler stacked one on
 * small screens (where 3D transforms and sticky scrollytelling don't belong).
 *
 * @param query - A media query string, e.g. `"(max-width: 900px)"`.
 * @returns `true` while the query matches the viewport.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
