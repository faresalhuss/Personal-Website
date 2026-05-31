import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { SCORE_NAME } from "@/lib/quiz";
import { site } from "@/lib/site";
import { breadcrumbSchema, websiteSchema } from "@/lib/structured-data";

import { Quiz } from "./_components/quiz";

const TITLE = `What's your ${SCORE_NAME}?`;

export const metadata: Metadata = {
  title: TITLE,
  description:
    "A 2-minute quiz that scores where you are with business and productivity, then points you to what'll actually help. Get your Momentum Score.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    type: "website",
    url: "/quiz",
    title: `${TITLE} — Fa'res Husseini`,
    description:
      "Score where you are with business and productivity, and get pointed to what'll actually help.",
    images: [
      { url: "/api/og?eyebrow=Quiz", width: 1200, height: 630, alt: TITLE },
    ],
  },
};

export default function QuizPage() {
  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Quiz", url: `${site.url}/quiz` },
        ])}
      />

      {/* Server-rendered h1 for SEO; the visible intro lives in the wizard so
          it can swap to the questions for a focused, one-at-a-time flow. */}
      <h1 className="sr-only">{TITLE}</h1>
      <div className="max-w-3xl">
        <Quiz />
      </div>
    </Section>
  );
}
