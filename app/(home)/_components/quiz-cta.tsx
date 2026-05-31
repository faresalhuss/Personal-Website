import Link from "next/link";

import { SCORE_NAME } from "@/lib/quiz";

export function QuizCta() {
  return (
    <section className="bg-night py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-soft p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_16px)]"
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-4">2-minute quiz</p>
            <h2 className="font-display text-4xl text-ink sm:text-6xl">
              What&rsquo;s your{" "}
              <span className="text-lime">{SCORE_NAME}</span>?
            </h2>
            <p className="mt-5 max-w-xl text-lg text-ink-dim">
              Answer a few honest questions about where you are with business
              and productivity. Get a score out of 10 and a short, tailored
              roadmap for your situation.
            </p>
            <Link href="/quiz" className="btn-lime mt-8">
              Take the quiz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
