"use client";

import { useActionState } from "react";

import { type ReadingListState, requestReadingList } from "../actions";

const initialState: ReadingListState = { status: "idle" };

export function ReadingListForm() {
  const [state, formAction, pending] = useActionState(
    requestReadingList,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="animate-fade-up text-center">
        <p className="font-display text-3xl text-lime sm:text-4xl">
          Your list is ready.
        </p>
        <a
          href="/api/reading-list/download"
          className="btn-lime mt-6 inline-flex"
          download
        >
          Download the PDF &darr;
        </a>
        <p className="mx-auto mt-5 max-w-sm text-sm text-ink-dim">
          I also sent a confirmation to your inbox &mdash; confirm it to start
          getting my weekly note. Your download works either way.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {/* Honeypot — real people leave this empty. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="rl-email" className="sr-only">
          Email address
        </label>
        <input
          id="rl-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={state.status === "error"}
          aria-describedby={
            state.status === "error" ? "rl-email-error" : undefined
          }
          className="min-h-[3.25rem] flex-1 rounded-full border border-line-2 bg-night px-5 text-base text-ink placeholder:text-ink-faint focus:border-lime focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-lime min-h-[3.25rem] disabled:opacity-70"
        >
          {pending ? "…" : "Send me the list"}
        </button>
      </div>

      {state.status === "error" ? (
        <p
          id="rl-email-error"
          aria-live="polite"
          className="mt-3 text-sm font-medium text-[#ff7a7a]"
        >
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-faint">
          Instant PDF download + my weekly note. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
