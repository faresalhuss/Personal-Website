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

      <p className="hero-rise eyebrow mb-5">Contact</p>
      <h1
        className="hero-rise font-display text-5xl leading-[0.95] text-ink sm:text-7xl"
        style={{ animationDelay: "0.06s" }}
      >
        Let&rsquo;s
        <br />
        <span className="text-lime">talk</span>
      </h1>
      <p
        className="hero-rise mt-7 max-w-xl text-lg text-ink-dim"
        style={{ animationDelay: "0.14s" }}
      >
        The fastest way to reach me is the right inbox below. For anything else,
        the form goes straight to me.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
        {/* Direct inboxes */}
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-ink-faint uppercase">
            Direct inboxes
          </h2>
          <ul className="mt-6 space-y-4">
            {channels.map((c) => (
              <li
                key={c.email}
                className="rounded-[var(--radius-card)] border border-line bg-night-soft p-6"
              >
                <p className="font-display text-xl text-ink">{c.label}</p>
                <p className="mt-1 text-sm text-ink-dim">{c.blurb}</p>
                <a
                  href={`mailto:${c.email}`}
                  className="mt-3 inline-block text-base font-medium text-lime underline-offset-4 hover:underline"
                >
                  {c.email}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div
          className="rounded-[var(--radius-card)] border border-line bg-night-soft p-7 sm:p-9"
        >
          <p className="font-display text-2xl text-ink sm:text-3xl">
            Send a message
          </p>
          <p className="mt-2 text-sm text-ink-dim">
            Not sure which inbox? Use this and I&rsquo;ll route it.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
