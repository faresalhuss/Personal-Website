"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  CONSENT_OPEN_EVENT,
  useConsent,
  useHasMounted,
} from "@/lib/consent";

/**
 * First-visit cookie consent banner. Slides up from the bottom with a short,
 * plain-language note and three clear actions. A "Preferences" view exposes
 * per-category toggles (Necessary is always on; Analytics is optional).
 *
 * It is a polite region, not a modal: it never traps focus or blocks the page.
 * The footer "Cookie settings" link reopens it via a window event.
 */
export function CookieConsent() {
  const { consent, accept, reject, save } = useConsent();
  const hasMounted = useHasMounted();
  // null until the user takes an action that dismisses the banner. Once set to
  // true the banner stays closed for the rest of the session even if reopened
  // state is recomputed. `manuallyOpened` re-shows it from the footer trigger.
  const [dismissed, setDismissed] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const descId = useId();

  // Visible on first visit (no stored decision) or when reopened from the
  // footer. Derived — no setState-in-effect, and SSR-safe via hasMounted.
  const open =
    hasMounted && !dismissed && (manuallyOpened || consent === null);

  // Let the footer (or anywhere) reopen the preferences view.
  useEffect(() => {
    function onOpen() {
      setAnalyticsOn(Boolean(consent?.analytics));
      setShowPrefs(true);
      setDismissed(false);
      setManuallyOpened(true);
      // Move focus into the panel for keyboard users.
      requestAnimationFrame(() => panelRef.current?.focus());
    }
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, [consent?.analytics]);

  const close = useCallback(() => {
    setDismissed(true);
    setManuallyOpened(false);
    setShowPrefs(false);
  }, []);

  // ESC dismisses without changing a previous choice; if no choice exists yet
  // it is treated as "reject non-essential" (the privacy-preserving default).
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (consent) {
        close();
      } else {
        reject();
        close();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, consent, reject, close]);

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="animate-consent-in fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        aria-labelledby={headingId}
        aria-describedby={descId}
        className="mx-auto max-w-3xl rounded-[var(--radius-card)] border border-line-2 bg-night-soft/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-md outline-none sm:p-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2
              id={headingId}
              className="font-display text-2xl tracking-wide text-ink"
            >
              A quick note on cookies
            </h2>
            <p id={descId} className="text-sm leading-relaxed text-ink-dim">
              I use essential cookies to make this site work, and optional
              analytics to see which pages people find useful. No ads, no
              selling your data. You can change your mind anytime.{" "}
              <Link
                href="/privacy"
                className="text-lime underline underline-offset-4 transition-colors hover:text-lime-dim focus-visible:text-lime-dim"
              >
                Read the privacy policy
              </Link>
              .
            </p>
          </div>

          {showPrefs && (
            <fieldset className="animate-fade-up flex flex-col gap-3 rounded-lg border border-line bg-night/60 p-4">
              <legend className="sr-only">Cookie preferences</legend>

              <label className="flex items-start justify-between gap-4 opacity-70">
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-ink">
                    Necessary
                  </span>
                  <span className="text-xs text-ink-faint">
                    Required for the site to function. Always on.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Necessary cookies (always on)"
                  className="mt-1 h-5 w-5 shrink-0 cursor-not-allowed accent-lime"
                />
              </label>

              <div className="h-px bg-line" />

              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-ink">
                    Analytics
                  </span>
                  <span className="text-xs text-ink-faint">
                    Privacy-friendly page-view stats (Vercel). Helps me improve
                    the site.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={analyticsOn}
                  onChange={(e) => setAnalyticsOn(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-lime"
                />
              </label>
            </fieldset>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {showPrefs ? (
              <button
                type="button"
                onClick={() => {
                  save(analyticsOn);
                  close();
                }}
                className="btn-lime justify-center"
              >
                Save preferences
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  accept();
                  close();
                }}
                className="btn-lime justify-center"
              >
                Accept all
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                reject();
                close();
              }}
              className="btn-outline justify-center"
            >
              Reject non-essential
            </button>

            {!showPrefs && (
              <button
                type="button"
                onClick={() => {
                  setAnalyticsOn(Boolean(consent?.analytics));
                  setShowPrefs(true);
                }}
                className="text-sm font-semibold tracking-wide text-ink-dim underline-offset-4 transition-colors hover:text-lime hover:underline focus-visible:text-lime focus-visible:underline sm:ml-auto"
              >
                Preferences
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
