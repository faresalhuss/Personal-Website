import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { SCORE_NAME, tierForScore, type TrackKey, tracks } from "@/lib/quiz";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

import { QuizResult } from "../_components/result";

type SearchParams = Promise<{
  track?: string;
  score?: string;
  goal?: string;
  hurdle?: string;
}>;

/** Resolve and clamp the result from the URL params, with safe fallbacks. */
function resolve(params: Awaited<SearchParams>) {
  const key = (params.track ?? "") as TrackKey;
  const track = tracks[key] ?? tracks.explorer;
  const raw = Number(params.score);
  const score = Number.isFinite(raw) ? Math.min(10, Math.max(0, raw)) : 0;
  const tier = tierForScore(track, score);
  return { track, score, tier, goal: params.goal, hurdle: params.hurdle };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { score, tier } = resolve(await searchParams);
  const ogTitle = `${score.toFixed(1)} / 10 · ${tier.name}`;
  const ogImage = `/api/og?eyebrow=${encodeURIComponent(
    SCORE_NAME,
  )}&title=${encodeURIComponent(ogTitle)}`;

  return {
    title: `My ${SCORE_NAME}`,
    description: `${score.toFixed(
      1,
    )} out of 10 on the ${SCORE_NAME} quiz: where you stand with business and productivity, plus a roadmap. Take it yourself.`,
    // Parameterized, personal result — keep it out of search but let links flow.
    robots: { index: false, follow: true },
    alternates: { canonical: "/quiz" },
    openGraph: {
      type: "website",
      url: "/quiz/result",
      title: `${ogTitle} — ${SCORE_NAME}`,
      description: `My ${SCORE_NAME} and roadmap. Take the quiz to get yours.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
  };
}

export default async function QuizResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { track, score, tier, goal, hurdle } = resolve(await searchParams);

  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Momentum Score quiz", url: `${site.url}/quiz` },
          { name: "Result", url: `${site.url}/quiz/result` },
        ])}
      />

      <p className="text-sm tracking-widest text-ink-faint uppercase">
        A shared {SCORE_NAME} result
      </p>

      <div className="mt-8">
        <QuizResult
          track={track}
          score={score}
          tier={tier}
          goal={goal}
          hurdle={hurdle}
          outro={
            <div className="rounded-[var(--radius-card)] border border-line bg-night-soft p-6">
              <p className="eyebrow mb-2">Where do you stand?</p>
              <p className="text-base text-ink-dim">
                This is someone else&rsquo;s result. Take the two-minute quiz to
                get your own {SCORE_NAME} and a roadmap built for your situation.
              </p>
              <Link href="/quiz" className="btn-lime mt-5">
                Take the quiz
              </Link>
            </div>
          }
        />
      </div>
    </Section>
  );
}
