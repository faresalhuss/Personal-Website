"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import {
  computeScore,
  gatingQuestions,
  type QuizOption,
  routeTrack,
  SCORE_NAME,
  tierForScore,
  type TrackKey,
  tracks,
} from "@/lib/quiz";

import { type QuizState, submitQuiz } from "../actions";

type Phase = "intro" | "questions" | "contact" | "result";
const initialState: QuizState = { status: "idle" };

export function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  // step 0,1 = gating; 2.. = track questions
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState<boolean | null>(null);
  const [productivity, setProductivity] = useState<boolean | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const trackKey: TrackKey | null = useMemo(
    () =>
      business === null || productivity === null
        ? null
        : routeTrack(business, productivity),
    [business, productivity],
  );
  const track = trackKey ? tracks[trackKey] : null;
  const totalQuestions = 2 + (track ? track.questions.length : 5); // 5 = est.

  // Move focus to the new question for keyboard/SR users (not setState).
  useEffect(() => {
    if (phase === "questions") headingRef.current?.focus();
  }, [step, phase]);

  function selectGating(which: "business" | "productivity", yes: boolean) {
    if (which === "business") setBusiness(yes);
    else setProductivity(yes);
    setStep((s) => s + 1);
  }

  function selectTrack(qIndex: number, option: QuizOption) {
    setPoints((prev) => {
      const next = [...prev];
      next[qIndex] = option.points;
      return next;
    });
    if (track && qIndex + 1 >= track.questions.length) {
      setPhase("contact");
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  // ── Result values (client-computed; also sent to the action) ────────────
  const score = track ? computeScore(track, points) : 0;
  const tier = track ? tierForScore(track, score) : null;

  if (phase === "intro") {
    return (
      <div className="animate-fade-up">
        <p className="eyebrow mb-5">2-minute quiz</p>
        <h2 className="font-display text-5xl leading-[0.95] text-ink sm:text-7xl">
          What&rsquo;s your
          <br />
          <span className="text-lime">{SCORE_NAME}?</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-ink-dim">
          Answer a few honest questions about where you are with business and
          productivity. You&rsquo;ll get a {SCORE_NAME}
          {" "}out of 100 and a short, tailored set of next steps. No fluff, no
          guru act.
        </p>
        <button
          type="button"
          onClick={() => {
            setPhase("questions");
            setStep(0);
          }}
          className="btn-lime mt-9"
        >
          Start &mdash; takes 2 minutes
        </button>
        <p className="mt-4 text-sm text-ink-faint">
          {totalQuestions} quick questions, then your {SCORE_NAME}.
        </p>
      </div>
    );
  }

  if (phase === "result" && track && tier) {
    return <Result track={track} score={score} tierName={tier.name} tierBlurb={tier.blurb} />;
  }

  if (phase === "contact" && track) {
    return (
      <ContactGate
        trackKey={track.key}
        score={score}
        tierName={tier?.name ?? ""}
        onSuccess={() => setPhase("result")}
        onBack={() => {
          setPhase("questions");
          setStep(2 + track.questions.length - 1);
        }}
      />
    );
  }

  // ── Questions phase ───────────────────────────────────────────────────
  const isGating = step < 2;
  const gating = gatingQuestions[step];
  const tIndex = step - 2;
  const tQuestion = track?.questions[tIndex];
  const progress = Math.min(100, Math.round((step / totalQuestions) * 100));

  return (
    <div>
      {/* Progress */}
      <div
        className="mb-8 h-1 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-valuenow={step}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-lime transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(6, progress)}%` }}
        />
      </div>

      <div key={step} className="animate-fade-up">
        <p className="eyebrow mb-4">
          Question {step + 1} of {totalQuestions}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="max-w-2xl text-3xl leading-tight font-medium text-ink normal-case outline-none sm:text-4xl"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {isGating ? gating.prompt : tQuestion?.prompt}
        </h2>

        <div className="mt-8 flex max-w-2xl flex-col gap-3">
          {isGating
            ? gating.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  label={opt.label}
                  onClick={() => selectGating(gating.id, opt.yes)}
                />
              ))
            : tQuestion?.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  label={opt.label}
                  selected={points[tIndex] === opt.points}
                  onClick={() => selectTrack(tIndex, opt)}
                />
              ))}
        </div>

        <button
          type="button"
          onClick={back}
          className="mt-8 text-sm font-semibold tracking-wide text-ink-faint underline-offset-4 transition-colors hover:text-lime hover:underline focus-visible:text-lime focus-visible:underline"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border px-5 py-4 text-left text-base transition-all duration-200",
        "hover:border-lime hover:bg-lime/[0.04]",
        selected
          ? "border-lime bg-lime/[0.06] text-ink"
          : "border-line-2 text-ink-dim hover:text-ink",
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="text-lime opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        &rarr;
      </span>
    </button>
  );
}

function ContactGate({
  trackKey,
  score,
  tierName,
  onSuccess,
  onBack,
}: {
  trackKey: TrackKey;
  score: number;
  tierName: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitQuiz, initialState);

  useEffect(() => {
    if (state.status === "success") onSuccess();
  }, [state.status, onSuccess]);

  return (
    <div className="animate-fade-up max-w-xl">
      <p className="eyebrow mb-4">Last step</p>
      <h2 className="text-3xl leading-tight font-medium text-ink normal-case sm:text-4xl">
        Your {SCORE_NAME} is ready.
      </h2>
      <p className="mt-4 text-base text-ink-dim">
        Tell me where to send it and I&rsquo;ll unlock your result plus a few
        things worth your time. You&rsquo;ll also get my weekly note &mdash;
        unsubscribe anytime.
      </p>

      <form action={formAction} noValidate className="mt-8">
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <input type="hidden" name="track" value={trackKey} />
        <input type="hidden" name="score" value={score} />
        <input type="hidden" name="tier" value={tierName} />

        <div className="flex flex-col gap-3">
          <Field
            id="q-firstName"
            name="firstName"
            label="First name"
            autoComplete="given-name"
            placeholder="First name"
          />
          <Field
            id="q-email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
          />
          <Field
            id="q-phone"
            name="phone"
            type="tel"
            label="Phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Phone number"
          />
        </div>

        {state.status === "error" ? (
          <p role="alert" className="mt-3 text-sm font-medium text-[#ff7a7a]">
            {state.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="btn-lime disabled:opacity-70"
          >
            {pending ? "…" : `Reveal my ${SCORE_NAME}`}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold tracking-wide text-ink-faint underline-offset-4 transition-colors hover:text-lime hover:underline"
          >
            &larr; Back
          </button>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-ink-faint">
          I&rsquo;ll use your details to send your result and the newsletter,
          and to get in touch. No spam, no selling your data. See the{" "}
          <Link
            href="/privacy"
            className="text-ink-dim underline underline-offset-4 hover:text-lime"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        className="h-[3.25rem] w-full rounded-full border border-line-2 bg-night px-5 text-base text-ink placeholder:text-ink-faint focus:border-lime focus:outline-none"
        {...rest}
      />
    </div>
  );
}

function Result({
  track,
  score,
  tierName,
  tierBlurb,
}: {
  track: (typeof tracks)[TrackKey];
  score: number;
  tierName: string;
  tierBlurb: string;
}) {
  return (
    <div className="animate-fade-up">
      <p className="eyebrow mb-4">Your {SCORE_NAME}</p>
      <div className="flex items-end gap-4">
        <span className="font-display text-7xl leading-none text-lime sm:text-9xl">
          {score}
        </span>
        <span className="mb-2 text-sm tracking-widest text-ink-faint uppercase">
          / 100
        </span>
      </div>
      <h2 className="mt-5 text-3xl font-medium text-ink normal-case sm:text-4xl">
        {tierName}
      </h2>
      <p className="mt-3 max-w-2xl text-lg text-ink-dim">{track.lede}</p>
      <p className="mt-3 max-w-2xl text-base text-ink-dim">{tierBlurb}</p>

      <div className="mt-10 rounded-[var(--radius-card)] border border-lime/30 bg-lime/[0.04] px-5 py-4 text-sm text-ink-dim">
        Check your inbox to confirm your subscription. Your first issue and the
        details below are on their way.
      </div>

      <h3 className="mt-12 font-display text-2xl text-ink">Start here</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {track.recommendations.map((rec) => (
          <Link
            key={rec.href}
            href={rec.href}
            className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-night-soft p-6 transition-colors hover:border-lime/60"
          >
            <span className="flex items-center justify-between font-display text-xl text-ink">
              {rec.label}
              <span
                aria-hidden="true"
                className="text-lime transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
            <span className="mt-2 text-sm text-ink-dim">{rec.note}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
