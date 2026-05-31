import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're in",
  description:
    "Your subscription to The Weekly Note is confirmed. Here's what to expect and where to go next.",
  // Post-confirmation page — keep it out of search results.
  robots: { index: false, follow: true },
  alternates: { canonical: "/welcome" },
};

const explore = [
  {
    label: "Read my story",
    href: "/about",
    blurb: "How I got here, and what I'm building.",
  },
  {
    label: "The free reading list",
    href: "/reading-list",
    blurb: "The 15 books that shaped how I build.",
  },
  {
    label: "Books I recommend",
    href: "/books",
    blurb: "Everything I've read, by theme.",
  },
];

export default function WelcomePage() {
  const socials = [site.socials.tiktok, site.socials.instagram, site.socials.x];

  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <div className="max-w-3xl">
        <p className="hero-rise eyebrow mb-5">Subscription confirmed</p>
        <h1
          className="hero-rise font-display text-6xl leading-[0.95] text-ink sm:text-8xl"
          style={{ animationDelay: "0.06s" }}
        >
          You&rsquo;re <span className="text-lime">in.</span>
        </h1>
        <p
          className="hero-rise mt-7 max-w-2xl text-lg text-ink-dim"
          style={{ animationDelay: "0.14s" }}
        >
          Thanks for confirming &mdash; you&rsquo;re on the list for{" "}
          <span className="text-ink">The Weekly Note</span>. Once a week
          I&rsquo;ll send one honest email about what it actually takes to build
          small businesses: the wins, the losses, and what I&rsquo;d do
          differently. Keep an eye on your inbox.
        </p>
      </div>

      {/* Explore */}
      <div
        className="hero-rise mt-14 grid gap-4 sm:grid-cols-3"
        style={{ animationDelay: "0.2s" }}
      >
        {explore.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-night-soft p-6 transition-colors hover:border-lime/60"
          >
            <span className="flex items-center justify-between font-display text-xl text-ink">
              {card.label}
              <span
                aria-hidden="true"
                className="text-lime transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
            <span className="mt-2 text-sm text-ink-dim">{card.blurb}</span>
          </Link>
        ))}
      </div>

      {/* Follow */}
      <div
        className="hero-rise mt-12 border-t border-line pt-8"
        style={{ animationDelay: "0.26s" }}
      >
        <p className="eyebrow mb-4">Follow along</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold tracking-widest uppercase">
          {socials.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-dim transition-colors hover:text-lime"
              >
                {s.label} {s.handle}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-xs text-ink-faint">
        Didn&rsquo;t get a confirmation email? Check your spam or promotions
        folder, and add the sender to your contacts so the weekly note lands in
        your inbox.
      </p>
    </Section>
  );
}
