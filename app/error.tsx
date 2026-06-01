"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Section } from "@/components/section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <p className="eyebrow mb-4">Something broke</p>
      <h1 className="font-display text-6xl text-ink sm:text-8xl">
        That wasn&rsquo;t
        <br />
        <span className="text-lime">supposed to happen</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-dim">
        A small gremlin got into the works. Try again, or head back home.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-lime">
          Try again
        </button>
        <Link href="/" className="btn-outline">
          Back home
        </Link>
      </div>
    </Section>
  );
}
