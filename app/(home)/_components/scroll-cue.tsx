"use client";

import { useEffect, useState } from "react";

/**
 * The hero's "Scroll ↓" cue. Visible only while the page is at the very top;
 * it fades and lifts away as soon as the visitor starts scrolling, and fades
 * back in when they return to the top. Tiny client island so the hero itself
 * stays a server component.
 *
 * A passive, rAF-throttled scroll listener flips a single boolean; React bails
 * out of renders when the value is unchanged, so it stays cheap. The transition
 * collapses to instant under the global prefers-reduced-motion rule.
 */
export function ScrollCue() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // Small dead zone so it doesn't flicker right around the top.
      setAtTop(window.scrollY <= 16);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update(); // sync initial state (e.g. if loaded already scrolled)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.7rem] tracking-[0.3em] text-ink-faint uppercase transition-all duration-500 ease-out ${
        atTop ? "opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      Scroll &darr;
    </div>
  );
}
