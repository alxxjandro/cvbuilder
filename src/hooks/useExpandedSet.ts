import { useState } from "react";

/**
 * Tracks which entries are expanded, keyed by their stable id. Used by list
 * sections to collapse/expand individual entry cards.
 *
 * @returns A predicate to test expansion and a toggler.
 */
export function useExpandedSet() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const isExpanded = (id: string) => expanded.has(id);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return { isExpanded, toggle };
}
