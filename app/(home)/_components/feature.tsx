import { cn } from "@/lib/cn";

const topics = [
  "Wins",
  "Losses",
  "Hiring",
  "Sales",
  "Pricing",
  "Clients",
  "Cash flow",
  "Founders",
  "Marketing",
  "Mistakes",
];

function Row({ reverse }: { reverse?: boolean }) {
  const tiles = [...topics, ...topics];
  return (
    <div className={cn("marquee-track gap-3", reverse && "marquee-track-rev")}>
      {tiles.map((t, i) => (
        <div
          key={`${t}-${i}`}
          className="relative flex aspect-square w-40 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-soft"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_14px)]"
          />
          <span className="relative font-display text-2xl text-ink-faint uppercase">
            {t}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Feature() {
  return (
    <section className="relative overflow-hidden bg-night py-28 sm:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 opacity-40"
      >
        <Row />
        <Row reverse />
        <Row />
      </div>

      {/* Vignette so the centered copy stays readable over the wall */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,#000_72%)]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow mb-5">The weekly note</p>
        <h2 className="font-display text-5xl sm:text-7xl">
          Notes from the
          <br />
          actual work
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-dim">
          Every week, an honest look at building small businesses in real time.
          The wins, the losses, and what I&rsquo;d do differently, while
          it&rsquo;s still fresh.
        </p>
        <a href="#newsletter" className="btn-lime mt-9">
          Subscribe
        </a>
      </div>
    </section>
  );
}
