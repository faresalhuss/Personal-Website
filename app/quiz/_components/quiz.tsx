"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import {
  computeScore,
  gatingQuestions,
  type ProfileQuestion,
  type Question,
  type QuizCtx,
  type QuizOption,
  routeTrack,
  SCORE_NAME,
  type Tier,
  tierForScore,
  type Track,
  type TrackKey,
  tracks,
} from "@/lib/quiz";

import { type QuizState, submitQuiz } from "../actions";

type Phase = "intro" | "questions" | "contact" | "result";
type ProfileAnswers = { goal?: string; hurdle?: string; tried?: string[] };
type Item =
  | { id: string; kind: "maturity"; q: Question }
  | {
      id: string;
      kind: "single" | "multi";
      field: "goal" | "hurdle" | "tried";
      q: ProfileQuestion;
    };

const initialState: QuizState = { status: "idle" };

export function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [businessKey, setBusinessKey] = useState<string | null>(null);
  const [productivityKey, setProductivityKey] = useState<string | null>(null);
  const [gatingStep, setGatingStep] = useState(0); // 0,1 = gating; 2 = track flow
  const [cursor, setCursor] = useState(0); // index into trackItems (raw)
  const [matAnswers, setMatAnswers] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<ProfileAnswers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  const trackKey: TrackKey | null = useMemo(() => {
    if (businessKey === null || productivityKey === null) return null;
    return routeTrack(businessKey !== "none", productivityKey !== "dialed");
  }, [businessKey, productivityKey]);
  const track = trackKey ? tracks[trackKey] : null;

  const ctx: QuizCtx = {
    business: businessKey ?? "",
    productivity: productivityKey ?? "",
    mat: matAnswers,
  };

  const trackItems: Item[] = useMemo(() => {
    if (!track) return [];
    const maturity: Item[] = track.questions.map((q) => ({
      id: q.id,
      kind: "maturity",
      q,
    }));
    const profileItems: Item[] = track.profile.map((pq, i) => ({
      id: `${pq.field}-${i}`,
      kind: pq.kind === "multi" ? "multi" : "single",
      field: pq.field,
      q: pq,
    }));
    return [...maturity, ...profileItems];
  }, [track]);

  // A question shows unless its showIf predicate says otherwise.
  const applicable = (item: Item, c: QuizCtx) =>
    !item.q.showIf || item.q.showIf(c);

  const applicableCount = trackItems.filter((it) => applicable(it, ctx)).length;
  const totalQuestions = 2 + (track ? applicableCount : 8);

  useEffect(() => {
    if (phase === "questions") headingRef.current?.focus();
  }, [gatingStep, cursor, phase]);

  function advanceTrack(from: number, c: QuizCtx) {
    for (let i = from + 1; i < trackItems.length; i++) {
      if (applicable(trackItems[i], c)) {
        setCursor(i);
        return;
      }
    }
    setPhase("contact");
  }

  function selectGating(which: "business" | "productivity", key: string) {
    if (which === "business") {
      setBusinessKey(key);
      setGatingStep(1);
    } else {
      setProductivityKey(key);
      setGatingStep(2);
      setCursor(0); // first maturity question (offer) is always applicable
    }
  }

  function selectMaturity(item: Item, option: QuizOption) {
    const next = { ...matAnswers, [item.id]: option.points };
    setMatAnswers(next);
    advanceTrack(cursor, { ...ctx, mat: next });
  }

  function selectProfileSingle(field: "goal" | "hurdle", key: string) {
    setProfile((prev) => ({ ...prev, [field]: key }));
    advanceTrack(cursor, ctx);
  }

  function toggleTried(key: string) {
    setProfile((prev) => {
      const cur = prev.tried ?? [];
      return {
        ...prev,
        tried: cur.includes(key)
          ? cur.filter((k) => k !== key)
          : [...cur, key],
      };
    });
  }

  function back() {
    if (gatingStep < 2) {
      if (gatingStep === 0) setPhase("intro");
      else setGatingStep(0);
      return;
    }
    for (let i = cursor - 1; i >= 0; i--) {
      if (applicable(trackItems[i], ctx)) {
        setCursor(i);
        return;
      }
    }
    setGatingStep(1); // back out of the track flow to the last gating question
  }

  // Score from the maturity questions that are currently applicable + answered.
  const applicableMaturity = track
    ? track.questions.filter((q) => !q.showIf || q.showIf(ctx))
    : [];
  const points = applicableMaturity
    .map((q) => matAnswers[q.id])
    .filter((p): p is number => typeof p === "number");
  const score = computeScore(points);
  const tier: Tier | null = track ? tierForScore(track, score) : null;

  // ── Intro ───────────────────────────────────────────────────────────────
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
          {" "}out of 10 and a tailored roadmap for your situation. No fluff, no
          guru act.
        </p>
        <button
          type="button"
          onClick={() => {
            setGatingStep(0);
            setPhase("questions");
          }}
          className="btn-lime mt-9"
        >
          Start the quiz
        </button>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────────────────────
  if (phase === "result" && track && tier) {
    return (
      <Result
        track={track}
        score={score}
        tier={tier}
        goal={profile.goal}
        hurdle={profile.hurdle}
      />
    );
  }

  // ── Contact gate ────────────────────────────────────────────────────────
  if (phase === "contact" && track) {
    return (
      <ContactGate
        track={track}
        score={score}
        tierName={tier?.name ?? ""}
        profile={profile}
        onSuccess={() => setPhase("result")}
        onBack={() => {
          setGatingStep(2);
          for (let i = trackItems.length - 1; i >= 0; i--) {
            if (applicable(trackItems[i], ctx)) {
              setCursor(i);
              break;
            }
          }
        }}
      />
    );
  }

  // ── Questions ─────────────────────────────────────────────────────────
  const inGating = gatingStep < 2;
  const item = !inGating ? trackItems[cursor] : null;
  const gating = gatingQuestions[gatingStep];

  const answeredBefore = inGating
    ? gatingStep
    : 2 +
      trackItems.slice(0, cursor).filter((it) => applicable(it, ctx)).length;
  const progress = Math.min(
    100,
    Math.round((answeredBefore / totalQuestions) * 100),
  );

  const prompt = inGating ? gating.prompt : item?.q.prompt;
  const triedSelected = profile.tried ?? [];

  return (
    <div>
      <div
        className="mb-8 h-1 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-valuenow={answeredBefore}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-lime transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(6, progress)}%` }}
        />
      </div>

      <div key={`${gatingStep}-${cursor}`} className="animate-fade-up">
        <p className="eyebrow mb-4">
          Question {answeredBefore + 1} of {totalQuestions}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="max-w-2xl text-3xl leading-tight font-medium text-ink normal-case outline-none sm:text-4xl"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {prompt}
        </h2>

        {/* Single-select: gating, maturity, profile single */}
        {(inGating ||
          item?.kind === "maturity" ||
          item?.kind === "single") && (
          <div className="mt-8 flex max-w-2xl flex-col gap-3">
            {inGating &&
              gating.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  label={opt.label}
                  onClick={() => selectGating(gating.id, opt.key)}
                />
              ))}
            {!inGating &&
              item?.kind === "maturity" &&
              item.q.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  label={opt.label}
                  selected={matAnswers[item.id] === opt.points}
                  onClick={() => selectMaturity(item, opt)}
                />
              ))}
            {!inGating &&
              item?.kind === "single" &&
              item.q.options.map((opt) => (
                <OptionButton
                  key={opt.key}
                  label={opt.label}
                  selected={
                    profile[item.field as "goal" | "hurdle"] === opt.key
                  }
                  onClick={() =>
                    selectProfileSingle(
                      item.field as "goal" | "hurdle",
                      opt.key,
                    )
                  }
                />
              ))}
          </div>
        )}

        {/* Multi-select: "tried" */}
        {!inGating && item?.kind === "multi" && (
          <>
            <p className="mt-2 text-sm text-ink-faint">Pick any that apply.</p>
            <div className="mt-6 flex max-w-2xl flex-col gap-3">
              {item.q.options.map((opt) => (
                <OptionButton
                  key={opt.key}
                  label={opt.label}
                  selected={triedSelected.includes(opt.key)}
                  multi
                  onClick={() => toggleTried(opt.key)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => advanceTrack(cursor, ctx)}
              className="btn-lime mt-6"
            >
              Continue
            </button>
          </>
        )}

        <button
          type="button"
          onClick={back}
          className="mt-8 block text-sm font-semibold tracking-wide text-ink-faint underline-offset-4 transition-colors hover:text-lime hover:underline focus-visible:text-lime focus-visible:underline"
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
  multi,
  onClick,
}: {
  label: string;
  selected?: boolean;
  multi?: boolean;
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
        className={cn(
          "shrink-0 text-lime transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        {multi ? (selected ? "✓" : "+") : "→"}
      </span>
    </button>
  );
}

function ContactGate({
  track,
  score,
  tierName,
  profile,
  onSuccess,
  onBack,
}: {
  track: Track;
  score: number;
  tierName: string;
  profile: ProfileAnswers;
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
        Your {SCORE_NAME} and roadmap are ready.
      </h2>
      <p className="mt-4 text-base text-ink-dim">
        Tell me where to send it and I&rsquo;ll unlock your result. You&rsquo;ll
        also get my weekly note, and you can unsubscribe anytime.
      </p>

      <form action={formAction} noValidate className="mt-8">
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <input type="hidden" name="track" value={track.key} />
        <input type="hidden" name="score" value={score} />
        <input type="hidden" name="tier" value={tierName} />
        <input type="hidden" name="goal" value={profile.goal ?? ""} />
        <input type="hidden" name="hurdle" value={profile.hurdle ?? ""} />
        <input
          type="hidden"
          name="tried"
          value={(profile.tried ?? []).join(", ")}
        />

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
            label="Phone (optional)"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Phone number (optional)"
            required={false}
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
  tier,
  goal,
  hurdle,
}: {
  track: Track;
  score: number;
  tier: Tier;
  goal?: string;
  hurdle?: string;
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

      <div className="mt-8 rounded-[var(--radius-card)] border border-lime/30 bg-lime/[0.04] px-5 py-4 text-sm text-ink-dim">
        Check your inbox to confirm your subscription. Your first issue is on
        its way.
      </div>

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
    </div>
  );
}
