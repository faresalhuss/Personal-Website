import Link from "next/link";

import { cn } from "@/lib/cn";

type Venture = {
  title: string;
  blurb: string;
  href?: string;
  external?: boolean;
  tag: string;
};

const ventures: Venture[] = [
  {
    title: "Clicks &\nClients",
    blurb: "A marketing firm I run, mostly working with small law firms.",
    href: "https://clicksclients.com",
    external: true,
    tag: "Marketing firm",
  },
  {
    title: "Animedic",
    blurb:
      "A pet health app and practice tool for vets, building with my co-founder. Launching summer 2026.",
    tag: "Co-founder",
  },
  {
    title: "The Weekly\nNote",
    blurb:
      "A short email every week on what I'm learning building. No fluff, no guru act.",
    href: "/#newsletter",
    tag: "Newsletter",
  },
  {
    title: "Writing",
    blurb: "Essays on the wins, the losses, and what I'd do differently.",
    href: "/writing",
    tag: "Essays",
  },
];

function CardInner({ v }: { v: Venture }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_16px)]"
      />
      <div className="relative flex items-center justify-between">
        <span className="eyebrow">{v.tag}</span>
      </div>
      <h3 className="relative mt-auto font-display text-5xl whitespace-pre-line sm:text-6xl">
        {v.title}
      </h3>
      <div className="relative mt-5 flex items-end justify-between gap-4">
        <p className="max-w-[18rem] text-sm text-ink-dim">{v.blurb}</p>
        <span
          aria-hidden="true"
          className="text-2xl text-lime transition-transform duration-300 group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </div>
    </>
  );
}

export function Ventures() {
  const cardClass =
    "group relative flex h-[26rem] w-[80vw] max-w-[32rem] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-soft p-7 transition-colors hover:border-lime/60";

  return (
    <section id="work" className="bg-night py-24 sm:py-32">
      <div className="mx-auto mb-10 flex max-w-6xl items-end justify-between gap-4 px-6 sm:px-10">
        <div>
          <p className="eyebrow mb-4">What I&rsquo;m building</p>
          <h2 className="font-display text-6xl sm:text-8xl">The Work</h2>
        </div>
        <p className="hidden text-xs tracking-widest text-ink-faint uppercase sm:block">
          Scroll &rarr;
        </p>
      </div>

      <div className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:px-10">
        {ventures.map((v) =>
          v.href ? (
            v.external ? (
              <a
                key={v.title}
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                <CardInner v={v} />
              </a>
            ) : (
              <Link key={v.title} href={v.href} className={cardClass}>
                <CardInner v={v} />
              </Link>
            )
          ) : (
            <div key={v.title} className={cn(cardClass, "cursor-default")}>
              <CardInner v={v} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
