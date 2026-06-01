"use client";

import { useEffect, useState } from "react";

import { SCORE_NAME } from "@/lib/quiz";

/** Build the shareable result path from the answers. */
export function resultPath({
  track,
  score,
  goal,
  hurdle,
}: {
  track: string;
  score: number;
  goal?: string;
  hurdle?: string;
}): string {
  const params = new URLSearchParams({
    track,
    score: score.toFixed(1),
  });
  if (goal) params.set("goal", goal);
  if (hurdle) params.set("hurdle", hurdle);
  return `/quiz/result?${params.toString()}`;
}

/**
 * "Share your result" control shown under the live result. Uses the native
 * share sheet where available (mobile), otherwise copies the link to the
 * clipboard with inline confirmation.
 */
export function ShareResult(props: {
  track: string;
  score: number;
  goal?: string;
  hurdle?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  async function onShare() {
    const url =
      typeof window !== "undefined"
        ? new URL(resultPath(props), window.location.origin).toString()
        : resultPath(props);
    const shareData = {
      title: `My ${SCORE_NAME}`,
      text: `I scored ${props.score.toFixed(1)}/10 on the ${SCORE_NAME} quiz.`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed the sheet, or it's unavailable — fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked — nothing else we can safely do.
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-night-soft p-6">
      <p className="eyebrow mb-2">Share your result</p>
      <p className="text-base text-ink-dim">
        Send your {SCORE_NAME} and roadmap to a friend who&rsquo;s building too.
      </p>
      <button
        type="button"
        onClick={onShare}
        className="btn-lime mt-5"
        aria-live="polite"
      >
        {copied ? "Link copied" : "Share my result"}
      </button>
    </div>
  );
}
