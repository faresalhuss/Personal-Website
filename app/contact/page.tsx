import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

import { ContactForm } from "./_components/contact-form";

const TITLE = "Contact";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Get in touch with Fa'res Husseini. Direct inboxes for press, podcast bookings, and business inquiries, plus a form for anything else.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: `${TITLE} — Fa'res Husseini`,
    description:
      "Press, podcast bookings, and business inquiries — plus a form for everything else.",
    images: [
      {
        url: "/api/og?eyebrow=Contact",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
};

const channels = [
  {
    label: "Press",
    blurb: "Interviews, quotes, and media requests.",
    email: site.contact.press,
  },
  {
    label: "Podcasts & bookings",
    blurb: "Guest spots, panels, and speaking.",
    email: site.contact.bookings,
  },
  {
    label: "Business",
    blurb: "Partnerships, consulting, and everything commercial.",
    email: site.contact.biz,
  },
];

export default function ContactPage() {
  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Contact", url: `${site.url}/contact` },
        ])}
      />

      {/* Hero */}
      <div className="max-w-2xl">
        <p className="hero-rise eyebrow mb-5">Contact</p>
        <h1
          className="hero-rise font-display text-6xl leading-[0.95] text-ink sm:text-8xl"
          style={{ animationDelay: "0.06s" }}
        >
          Let&rsquo;s <span className="text-lime">talk</span>
        </h1>
        <p
          className="hero-rise mt-6 text-lg text-ink-dim"
          style={{ animationDelay: "0.14s" }}
        >
          Pick the inbox that fits and you&rsquo;ll reach me directly. Not sure
          which one? The form sorts it for you.
        </p>
      </div>

      {/* Two peer cards: inboxes + form */}
      <div
        className="hero-rise mt-14 grid gap-5 lg:grid-cols-2 lg:gap-6 lg:items-stretch"
        style={{ animationDelay: "0.22s" }}
      >
        {/* Direct inboxes */}
        <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-night-soft p-7 sm:p-9">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Direct inboxes
          </h2>
          <p className="mt-2 text-sm text-ink-dim">
            The fastest route to the right place.
          </p>

          <ul className="mt-7 divide-y divide-line">
            {channels.map((c) => (
              <li
                key={c.email}
                className="flex flex-col gap-1 py-5 first:pt-0 last:pb-1"
              >
                <p className="text-base font-semibold text-ink">{c.label}</p>
                <p className="text-sm text-ink-dim">{c.blurb}</p>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-1 inline-block w-fit text-base font-medium text-lime underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  {c.email}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-auto border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
            I read everything and reply to what I can, usually within a few
            days.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-night-soft p-7 sm:p-9">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Send a message
          </h2>
          <p className="mt-2 text-sm text-ink-dim">
            For anything that doesn&rsquo;t fit a box above.
          </p>
          <div className="mt-7 flex-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
