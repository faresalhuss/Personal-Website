"use client";

import { useEffect, useRef } from "react";

/**
 * Thin reading-progress bar pinned to the very top of the viewport. Fills in the
 * lime accent as you scroll down a post and recedes as you scroll back up.
 *
 * Performance: it writes the scale directly to the DOM inside a
 * requestAnimationFrame, so there's no React re-render per scroll frame. It's a
 * decorative indicator, hence `aria-hidden` + `pointer-events-none`.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={ref}
        className="h-full w-full origin-left bg-lime"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
