"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Grid that staggers its children in on scroll (CSS transitions toggled by one
 * IntersectionObserver). Honors prefers-reduced-motion (shows immediately;
 * the global reduced-motion rule collapses the transition).
 */
export function BookGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The observer fires immediately for already-visible grids. Under
    // prefers-reduced-motion the global CSS collapses the transition, so the
    // reveal is effectively instant without a special-case branch.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {Children.map(children, (child, i) => (
        <div
          className="reveal-item"
          data-shown={shown}
          style={{
            transitionDelay: shown ? `${Math.min(i, 18) * 35}ms` : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
