import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { Portrait } from "@/components/portrait";
import { Section } from "@/components/section";
import { site } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  profilePageSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "How I went from making gaming videos in Saudi Arabia to running a marketing firm and co-founding a pet-health startup in Atlanta, with law school next.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "About — Fa'res Husseini",
    description:
      "From gaming videos in Saudi Arabia to a marketing firm and a pet-health startup in Atlanta, with law school next.",
    images: [
      { url: "/api/og", width: 1200, height: 630, alt: "Fa'res Husseini" },
    ],
  },
};

/**
 * ── BIO COPY LIVES HERE ────────────────────────────────────────────────
 * First-person prose from Fa'res's interview. Edit the strings below.
 */
const bio: string[] = [
  "I grew up in Saudi Arabia and moved to the United States in 2017. My first stop was Chico, a small town in northern California. When the pandemic hit, I moved to San Diego, finished my senior year of high school there, and stayed for college, earning a bachelor's in economics at San Diego State. In June of 2025, I packed up again and moved to Atlanta.",
  "Building things was always in the background. My mom started all of her businesses before I was born, so I never watched her run them, but I grew up on the stories. My dad started building his own when I was around twelve, and seeing him do it up close is a big part of why I wanted the same.",
  "My own first attempt was a lot smaller. As a kid I made YouTube videos about video games. It went nowhere, but it planted the idea that you could make something that was yours.",
  "The marketing company started almost by accident. I'd helped family, friends, and other SDSU students market their businesses, and it kept working better than anyone expected. At some point I realized I had a knack for it, so in August of 2025 I started Clicks & Clients. In March of 2026, my co-founder and I started Animedic, a pet health app and practice tool for vets, which we expect to launch this summer.",
  "This summer I'm also going to start putting myself out there, with content, a video series, and a podcast called Wondering Out Loud. Part of the reason is that it makes me uncomfortable. I've never thought of myself as good on camera, and I'm not a fan of the sound of my own voice, but I do like talking through what I'm working on and sharing it with people, so I want to get comfortable being uncomfortable.",
  "The other reason is that I want to show the honest version of this. What it actually looks like to build your businesses while still having a life, with all the commitments and obligations that come with it, and while preparing for something as big as law school.",
  "Law school is still the plan, probably the fall of 2027. I have a real interest in the legal system and the frameworks behind it, and I'm not going to pretend the path is tidy. It means serious prep, a lot of time, and maybe moving again. Between now and then the goal is to build something that works and document the journey as I go, the wins, the losses, and what I'd do differently, from someone still figuring it out.",
];

/**
 * FAQ answers the questions people and AI answer-engines actually ask about
 * Fa'res. Keep answers factual and grounded in the bio above.
 */
const faqs = [
  {
    question: "Who is Fa'res Husseini?",
    answer:
      "Fa'res Husseini is an entrepreneur, creator, and writer based in Atlanta, Georgia. He runs the marketing firm Clicks & Clients, co-founded the pet-health startup Animedic, and writes a weekly email about what it takes to build small businesses.",
  },
  {
    question: "What does Fa'res Husseini do?",
    answer:
      "He founded Clicks & Clients, a marketing firm that helps small businesses grow, in August 2025. In March 2026 he co-founded Animedic, a pet health app and practice tool for veterinarians, launching in summer 2026. He also writes a weekly newsletter and is starting a podcast called Wondering Out Loud.",
  },
  {
    question: "Where is Fa'res Husseini based?",
    answer:
      "He lives in Atlanta, Georgia. He grew up in Saudi Arabia, moved to the United States in 2017, lived in Chico and San Diego, California, and moved to Atlanta in 2025.",
  },
  {
    question: "What did Fa'res Husseini study?",
    answer:
      "He earned a bachelor's degree in economics from San Diego State University.",
  },
];

export default function AboutPage() {
  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <JsonLd data={profilePageSchema()} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "About", url: `${site.url}/about` },
        ])}
      />
      <p className="eyebrow mb-4">About</p>
      <h1 className="font-display text-6xl text-ink sm:text-8xl">
        A bit
        <br />
        about me
      </h1>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="space-y-5 text-lg leading-relaxed text-ink-dim sm:text-xl">
          {bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Portrait className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none" />
      </div>

      <div className="mt-20 border-t border-line pt-12">
        <p className="eyebrow mb-4">FAQ</p>
        <h2 className="font-display text-4xl text-ink sm:text-5xl">
          Common questions
        </h2>
        <dl className="mt-10 divide-y divide-line border-t border-line">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-7">
              <dt className="font-display text-2xl text-ink sm:text-3xl">
                {faq.question}
              </dt>
              <dd className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-dim">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
