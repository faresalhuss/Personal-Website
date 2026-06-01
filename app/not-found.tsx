import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-6xl text-ink sm:text-8xl">
        This page
        <br />
        <span className="text-lime">wandered off</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-dim">
        The link is broken or the page moved. Here&rsquo;s the way back.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="btn-lime">
          Back home
        </Link>
        <Link href="/books" className="btn-outline">
          Books
        </Link>
        <Link href="/quiz" className="btn-outline">
          Take the quiz
        </Link>
      </div>
    </Section>
  );
}
