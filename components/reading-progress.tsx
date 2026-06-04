"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useHasMounted } from "@/lib/consent";

/**
 * Thin reading-progress bar pinned to the very top of the viewport. Fills in the
 * lime accent as you scroll down a post and recedes as you scroll back up.
 *
 * It's rendered through a portal to <body> on purpose: an ancestor with a
 * `transform` (the site's `animate-page-in` page wrapper) would otherwise become
 * the containing block for a `position: fixed` element and trap the bar. The
 * portal guarantees it's positioned against the viewport everywhere.
 *
 * Performance: the scale is written straight to the DOM inside a
 * requestAnimationFrame, so there's no React re-render per scroll frame. It's a
 * decorative indicator, hence `aria-hidden` + `pointer-events-none`.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  // useSyncExternalStore-based mount flag (avoids setState-in-effect) so the
  // portal only renders client-side and there's no hydration mismatch.
  const mounted = useHasMounted();

  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
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
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
    >
      <div
        ref={ref}
        className="h-full w-full origin-left bg-lime"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>,
    document.body,
  );
}
