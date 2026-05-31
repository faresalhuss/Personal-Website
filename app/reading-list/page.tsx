import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { site } from "@/lib/site";
import { breadcrumbSchema, websiteSchema } from "@/lib/structured-data";

import { ReadingListForm } from "./_components/reading-list-form";

const TITLE = "The 15 Books That Shaped How I Build";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "A free guide: the 15 books Fa'res Husseini has found most helpful building businesses from zero, with a short note on why each one matters.",
  alternates: { canonical: "/reading-list" },
  openGraph: {
    type: "website",
    url: "/reading-list",
    title: `${TITLE} — Fa'res Husseini`,
    description:
      "The 15 books I've found most helpful building businesses from zero. Free PDF.",
    images: [
      {
        url: "/api/og?eyebrow=Free%20Guide",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
};

const inside = [
  "15 books across business, sales, money, mindset, and productivity",
  "A one-line take on why each one earned its place",
  "An honest note on how I read (physical vs. digital)",
  "A direct link to every book",
];

export default function ReadingListPage() {
  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Reading list", url: `${site.url}/reading-list` },
        ])}
      />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
        {/* Left — the pitch */}
        <div>
          <p className="hero-rise eyebrow mb-5">Free guide</p>
          <h1
            className="hero-rise font-display text-5xl leading-[0.95] text-ink sm:text-6xl"
            style={{ animationDelay: "0.06s" }}
          >
            The 15 books
            <br />
            that shaped
            <br />
            <span className="text-lime">how I build</span>
          </h1>
          <p
            className="hero-rise mt-7 max-w-xl text-lg text-ink-dim"
            style={{ animationDelay: "0.14s" }}
          >
            The ones I&rsquo;ve found most helpful building businesses from zero
            &mdash; with a quick take on why each earned a place on the list.
            Enter your email and I&rsquo;ll send the PDF straight to you.
          </p>

          <ul
            className="hero-rise mt-8 space-y-3"
            style={{ animationDelay: "0.2s" }}
          >
            {inside.map((item) => (
              <li key={item} className="flex gap-3 text-base text-ink-dim">
                <span aria-hidden="true" className="mt-1 text-lime">
                  &#10003;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — the offer card */}
        <div
          className="hero-rise rounded-[var(--radius-card)] border border-line bg-night-soft p-7 sm:p-9"
          style={{ animationDelay: "0.24s" }}
        >
          <p className="font-display text-2xl text-ink sm:text-3xl">
            Get the free PDF
          </p>
          <p className="mt-2 text-sm text-ink-dim">
            Where should I send it?
          </p>
          <div className="mt-6">
            <ReadingListForm />
          </div>
          <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
            The guide contains Amazon affiliate links. If you buy through them I
            may earn a small commission, at no extra cost to you. I only include
            books I&rsquo;ve actually read and found genuinely useful.
          </p>
        </div>
      </div>
    </Section>
  );
}
