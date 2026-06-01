import Link from "next/link";

import { SCORE_NAME } from "@/lib/quiz";

/**
 * Homepage quiz section. Full-width "now it's about you" beat after the
 * timeline: a pitch on the left and a sample-result card on the right that
 * mirrors the real /quiz result, so it reads as part of the page (not a
 * dropped-in box) and previews the payoff. The card is decorative.
 */
export function QuizCta() {
  return (
    <section className="border-t border-line bg-night py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        {/* Left: the pitch */}
        <div>
          <p className="eyebrow mb-4">Now, where do you stand?</p>
          <h2 className="font-display text-5xl text-ink sm:text-7xl">
            What&rsquo;s your <span className="text-lime">{SCORE_NAME}</span>?
          </h2>
          <p className="mt-6 max-w-xl text-lg text-ink-dim">
            A few quick questions on where you are with business and
            productivity. You&rsquo;ll get a score out of 10 and a roadmap
            tailored to your situation.
          </p>
          <Link href="/quiz" className="btn-lime mt-8">
            Take the quiz
          </Link>
        </div>

        {/* Right: sample result, mirrors the real /quiz output */}
        <div
          aria-hidden="true"
          className="rounded-[var(--radius-card)] border border-line-2 bg-night-soft p-7 shadow-2xl shadow-black/40 sm:p-8"
        >
          <p className="eyebrow mb-3">Your {SCORE_NAME}</p>
          <div className="flex items-end gap-3">
            <span className="font-display text-7xl leading-none text-lime sm:text-8xl">
              7.4
            </span>
            <span className="mb-2 text-xs tracking-widest text-ink-faint uppercase">
              / 10
            </span>
          </div>
          <p className="mt-4 text-2xl font-medium text-ink">Gaining Momentum</p>
          <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-ink-dim">
            Plus a roadmap tailored to you: your biggest hurdle, the three moves
            that matter most, and one next step to take this week.
          </p>
        </div>
      </div>
    </section>
  );
}
