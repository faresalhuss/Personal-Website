import type { ReactNode } from "react";

import { SCORE_NAME, type Tier, type Track } from "@/lib/quiz";

/**
 * Presentational quiz result. Shared by the live wizard (after sign-up) and the
 * standalone shareable page at /quiz/result. No hooks or client-only APIs, so
 * it renders fine in both a client and a server tree.
 *
 * - `showInboxNote` shows the "check your inbox" confirmation (live flow only).
 * - `outro` is a slot for the closing call to action: a share button in the
 *   wizard, a "take the quiz" link on the shared page.
 */
export function QuizResult({
  track,
  score,
  tier,
  goal,
  hurdle,
  showInboxNote = false,
  outro,
}: {
  track: Track;
  score: number;
  tier: Tier;
  goal?: string;
  hurdle?: string;
  showInboxNote?: boolean;
  outro?: ReactNode;
}) {
  const g = track.guide;
  const intro = goal ? (g.goalFraming[goal] ?? track.lede) : track.lede;
  const hurdleSection = hurdle ? g.hurdleSections[hurdle] : undefined;
  const nextAction =
    (hurdle ? g.nextActions[hurdle] : undefined) ?? g.defaultNextAction;

  return (
    <div className="animate-fade-up">
      <p className="eyebrow mb-4">Your {SCORE_NAME}</p>
      <div className="flex items-end gap-4">
        <span className="font-display text-7xl leading-none text-lime sm:text-9xl">
          {score.toFixed(1)}
        </span>
        <span className="mb-2 text-sm tracking-widest text-ink-faint uppercase">
          / 10
        </span>
      </div>
      <h2 className="mt-5 text-3xl font-medium text-ink normal-case sm:text-4xl">
        {tier.name}
      </h2>
      <p className="mt-3 max-w-2xl text-lg text-ink-dim">{intro}</p>
      <p className="mt-3 max-w-2xl text-base text-ink-dim">{tier.blurb}</p>

      {showInboxNote ? (
        <div className="mt-8 rounded-[var(--radius-card)] border border-lime/30 bg-lime/[0.04] px-5 py-4 text-sm text-ink-dim">
          Check your inbox to confirm your subscription. Your first issue is on
          its way.
        </div>
      ) : null}

      {/* Roadmap */}
      <h3 className="mt-12 font-display text-3xl text-ink sm:text-4xl">
        Your roadmap
      </h3>
      <ol className="mt-6 space-y-8">
        {g.moves.map((move, i) => (
          <li key={i} className="border-t border-line pt-6">
            <div className="flex gap-4">
              <span className="font-display text-2xl text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="text-xl font-semibold text-ink">{move.title}</h4>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-dim">
                  {move.body}
                </p>
                {move.aside ? (
                  <blockquote className="mt-4 max-w-2xl border-l-2 border-lime/50 pl-4 text-sm leading-relaxed whitespace-pre-line text-ink-faint italic">
                    {move.aside}
                  </blockquote>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Hurdle */}
      {hurdleSection ? (
        <div className="mt-12">
          <h3 className="font-display text-2xl text-ink">
            Your biggest hurdle right now
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-dim">
            {hurdleSection}
          </p>
        </div>
      ) : null}

      {/* Next move */}
      {nextAction ? (
        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-night-soft p-6">
          <p className="eyebrow mb-2">Your next move</p>
          <p className="text-lg text-ink">{nextAction}</p>
        </div>
      ) : null}

      {/* Pitfalls */}
      {g.pitfalls.length > 0 ? (
        <div className="mt-12">
          <h3 className="font-display text-2xl text-ink">Pitfalls to avoid</h3>
          <ul className="mt-4 max-w-2xl space-y-2">
            {g.pitfalls.map((p) => (
              <li key={p} className="flex gap-3 text-base text-ink-dim">
                <span aria-hidden="true" className="mt-1 text-lime">
                  &times;
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Resources — open in a new tab so the result stays put. */}
      <h3 className="mt-12 font-display text-2xl text-ink">Start here</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {track.recommendations.map((rec) => (
          <a
            key={rec.href}
            href={rec.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-night-soft p-6 transition-colors hover:border-lime/60"
          >
            <span className="flex items-center justify-between font-display text-xl text-ink">
              {rec.label}
              <span
                aria-hidden="true"
                className="text-lime transition-transform duration-300 group-hover:translate-x-1"
              >
                &nearr;
              </span>
            </span>
            <span className="mt-2 text-sm text-ink-dim">{rec.note}</span>
          </a>
        ))}
      </div>

      {outro ? <div className="mt-12">{outro}</div> : null}
    </div>
  );
}
