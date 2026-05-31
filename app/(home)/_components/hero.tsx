import { cn } from "@/lib/cn";

import { ScrollCue } from "./scroll-cue";

/**
 * Full-bleed black hero. Giant animated wordmark over a faint scrolling
 * name-marquee (no video/photography needed). CSS-only entrance so the LCP
 * heading paints immediately.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-night pt-24 pb-16">
      {/* Faint marquee backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-1 opacity-[0.045] select-none"
      >
        {[0, 1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className={cn(
              "marquee-track font-display text-[16vw] leading-none whitespace-nowrap text-ink uppercase",
              row % 2 === 1 && "marquee-track-rev",
            )}
          >
            <span className="pr-8">
              Fa&rsquo;res Husseini · Fa&rsquo;res Husseini ·{" "}
            </span>
            <span className="pr-8">
              Fa&rsquo;res Husseini · Fa&rsquo;res Husseini ·{" "}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10">
        <p className="hero-rise eyebrow mb-5">
          Entrepreneur &middot; Creator &middot; Writer
        </p>

        <h1
          className="hero-rise font-display text-[16vw] leading-[0.96] text-ink sm:text-[13vw] lg:text-[10.5rem]"
          style={{ animationDelay: "0.08s" }}
        >
          Fa&rsquo;res
          <br />
          Husseini
        </h1>

        <p
          className="hero-rise mt-8 max-w-xl text-lg text-ink-dim sm:text-2xl"
          style={{ animationDelay: "0.16s" }}
        >
          I build small businesses, and I&rsquo;m having fun along the way.
        </p>

        <div
          className="hero-rise mt-9 flex flex-wrap gap-3"
          style={{ animationDelay: "0.24s" }}
        >
          <a href="/about" className="btn-lime">
            My story
          </a>
          <a href="#work" className="btn-outline">
            What I&rsquo;m building
          </a>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
