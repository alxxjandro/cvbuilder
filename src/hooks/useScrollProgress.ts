import { useEffect, useState } from "react";
import type { RefObject } from "react";

/**
 * Tracks how far the user has scrolled "through" an element, as a 0→1 value.
 *
 * Progress is 0 when the element's top reaches the top of the viewport and 1
 * when its bottom reaches the bottom of the viewport — the natural range over
 * which a `position: sticky` child stays pinned. Used to drive scroll-linked
 * storytelling (the How it works CV that builds itself as you scroll).
 *
 * @param ref - The tall scroll container to measure against.
 * @returns The clamped scroll progress through the element, from 0 to 1.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const passed = -rect.top;
      const next = span > 0 ? passed / span : 0;
      setProgress(Math.min(1, Math.max(0, next)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progress;
}

/** Where a manually-pinned stage sits relative to its scroll runway. */
export type PinMode = "top" | "fixed" | "bottom";

/**
 * Like {@link useScrollProgress}, but also reports how a full-viewport stage
 * should be positioned to emulate `position: sticky` — pinned (`fixed`) while
 * the runway spans the viewport, and parked at the `top` / `bottom` of the
 * runway otherwise.
 *
 * We pin manually instead of using CSS `position: sticky` because a global
 * `overflow-x: hidden` on `html`/`body` makes the document the scroll container
 * and breaks sticky for descendants. This approach is immune to that.
 *
 * @param ref - The tall scroll runway to pin within.
 * @returns The scroll progress (0–1) and the current {@link PinMode}.
 */
export function usePinnedProgress(ref: RefObject<HTMLElement | null>): {
  progress: number;
  mode: PinMode;
} {
  const [state, setState] = useState<{ progress: number; mode: PinMode }>({
    progress: 0,
    mode: "top",
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = rect.height - vh;
      if (rect.top >= 0) {
        setState({ progress: 0, mode: "top" });
      } else if (rect.bottom <= vh) {
        setState({ progress: 1, mode: "bottom" });
      } else {
        const next = span > 0 ? -rect.top / span : 0;
        setState({ progress: Math.min(1, Math.max(0, next)), mode: "fixed" });
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return state;
}
