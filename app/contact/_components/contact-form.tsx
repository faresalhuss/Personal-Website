"use client";

import { useActionState, useEffect } from "react";

import { trackConversion } from "@/lib/analytics";

import { type ContactState, submitContact } from "../actions";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "h-[3.25rem] w-full rounded-full border border-line-2 bg-night px-5 text-base text-ink placeholder:text-ink-faint focus:border-lime focus:outline-none";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      trackConversion("contact_submit");
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" className="animate-fade-up">
        <p className="font-display text-3xl text-lime sm:text-4xl">
          Message sent.
        </p>
        <p className="mt-4 max-w-sm text-base text-ink-dim">
          Thanks for reaching out. I read everything and reply to what I can. If
          it&rsquo;s time-sensitive, the direct inboxes above are your fastest
          route.
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

      <div className="space-y-3">
        <div>
          <label htmlFor="c-name" className="sr-only">
            Your name
          </label>
          <input
            id="c-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="c-email" className="sr-only">
            Email address
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="c-topic" className="sr-only">
            What&rsquo;s this about?
          </label>
          <select
            id="c-topic"
            name="topic"
            defaultValue="biz"
            required
            className={inputClass}
          >
            <option value="biz">Business inquiry</option>
            <option value="bookings">Podcast / booking inquiry</option>
            <option value="press">Press inquiry</option>
          </select>
        </div>

        <div>
          <label htmlFor="c-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="c-message"
            name="message"
            required
            rows={5}
            placeholder="What&rsquo;s on your mind?"
            className="w-full rounded-[var(--radius-card)] border border-line-2 bg-night px-5 py-4 text-base text-ink placeholder:text-ink-faint focus:border-lime focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-lime h-[3.25rem] w-full justify-center disabled:opacity-70"
        >
          {pending ? "…" : "Send message"}
        </button>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="mt-3 text-sm font-medium text-[#ff7a7a]">
          {state.message}
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-faint">
          I&rsquo;ll only use your details to reply. No list, no spam.
        </p>
      )}
    </form>
  );
}
