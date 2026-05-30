"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Milestone = {
  year: string;
  tag: string;
  title: string;
  body: string;
  upcoming?: boolean;
};

const milestones: Milestone[] = [
  {
    year: "Then",
    tag: "First taste",
    title: "YouTube & video games",
    body: "Made gaming videos as a kid. It went nowhere, but it planted the idea that you could build something of your own.",
  },
  {
    year: "Age 14",
    tag: "A new start",
    title: "Moved to the U.S.",
    body: "Left Saudi Arabia, started over in a new country, and finished high school here.",
  },
  {
    year: "College",
    tag: "Heads down",
    title: "Earned my degree",
    body: "Then decided it was time to stop talking about building and actually do it.",
  },
  {
    year: "Aug 2025",
    tag: "Marketing firm",
    title: "Started Clicks & Clients",
    body: "A marketing firm, mostly working with small law firms.",
  },
  {
    year: "Mar 2026",
    tag: "Pet health",
    title: "Co-founded Animedic",
    body: "A pet health app and practice tool for vets, building with my co-founder.",
  },
  {
    year: "2027",
    tag: "Planned",
    title: "Law school begins",
    body: "Still the plan. The goal is to build something that works before the first day of class.",
    upcoming: true,
  },
];

export function Timeline() {
  const railRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const thresholdsRef = useRef<number[]>([]);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 55%"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [filled, setFilled] = useState<boolean[]>(() =>
    milestones.map(() => false),
  );

  // Each dot fills when the scroll-fill line reaches its center. The threshold
  // is the dot's position along the rail (0–1); compared against scroll progress.
  useEffect(() => {
    function applyProgress(v: number) {
      const next = thresholdsRef.current.map((t) => v >= t - 0.0005);
      setFilled((prev) =>
        prev.length === next.length && prev.every((b, i) => b === next[i])
          ? prev
          : next,
      );
    }

    function measure() {
      const rail = railRef.current;
      if (!rail) return;
      const railTop = rail.getBoundingClientRect().top;
      const h = rail.offsetHeight || 1;
      thresholdsRef.current = dotRefs.current.map((d) => {
        if (!d) return 1;
        const r = d.getBoundingClientRect();
        const center = r.top + r.height / 2 - railTop;
        return Math.min(1, Math.max(0, center / h));
      });
      applyProgress(scrollYProgress.get());
    }

    measure();

    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    window.addEventListener("resize", measure);

    const unsub = scrollYProgress.on("change", applyProgress);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      unsub();
    };
  }, [scrollYProgress]);

  return (
    <section id="journey" className="bg-night py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <p className="eyebrow mb-4">The journey</p>
        <h2 className="font-display text-6xl sm:text-8xl">
          From the
          <br />
          beginning
        </h2>

        <div ref={railRef} className="relative mt-16">
          {/* Center rail (left on mobile): dark track + scroll-driven lime fill. */}
          <div className="absolute top-0 bottom-0 left-[8px] w-[2px] bg-line sm:left-1/2 sm:-translate-x-1/2">
            <motion.div
              style={{ height: reduce ? "100%" : fillHeight }}
              className="w-full bg-lime"
            />
          </div>

          <ol className="space-y-14 sm:space-y-0">
            {milestones.map((m, i) => {
              const onLeft = i % 2 === 0;
              const isFilled = reduce || filled[i];
              return (
                <li
                  key={m.title}
                  className="relative sm:grid sm:grid-cols-2 sm:gap-x-16 sm:py-10"
                >
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className={cn(
                      "absolute top-2 left-[8px] z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-lime transition-colors duration-200 sm:left-1/2",
                      isFilled ? "bg-lime" : "bg-night",
                    )}
                  />

                  <div
                    className={cn(
                      "pl-9 sm:pl-0",
                      onLeft
                        ? "sm:col-start-1 sm:pr-16 sm:text-right"
                        : "sm:col-start-2 sm:pl-16",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        onLeft && "sm:justify-end",
                      )}
                    >
                      <span className="font-display text-4xl text-lime sm:text-5xl">
                        {m.year}
                      </span>
                      {m.upcoming ? (
                        <span className="rounded-full border border-line-2 px-3 py-1 text-[0.6rem] font-medium tracking-widest text-ink-faint uppercase">
                          Planned
                        </span>
                      ) : null}
                    </div>
                    <p className="eyebrow mt-4">{m.tag}</p>
                    <h3 className="mt-2 font-display text-2xl normal-case sm:text-3xl">
                      {m.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 max-w-md text-lg text-ink-dim",
                        onLeft && "sm:ml-auto",
                      )}
                    >
                      {m.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
