"use client";

import { useActionState } from "react";

import { subscribeAction, type SubscribeState } from "./actions";

const initialState: SubscribeState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeAction,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div
        aria-live="polite"
        className="mx-auto max-w-md rounded-full bg-night px-6 py-4 text-base font-medium text-lime"
      >
        You&rsquo;re in. Watch your inbox for the next one.
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="mx-auto max-w-md">
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
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={state.status === "error"}
          aria-describedby={
            state.status === "error" ? "email-error" : undefined
          }
          className="min-h-[3.25rem] flex-1 rounded-full border border-night/20 bg-white px-5 text-base text-night placeholder:text-night/40 focus:border-night focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-[3.25rem] rounded-full bg-night px-7 text-sm font-semibold tracking-wide text-lime uppercase transition-colors hover:bg-night-2 disabled:opacity-70"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>

      {state.status === "error" ? (
        <p
          id="email-error"
          aria-live="polite"
          className="mt-3 text-sm font-medium text-[#9a1500]"
        >
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-sm text-night/60">
          One email a week. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
