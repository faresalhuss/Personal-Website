import Link from "next/link";

import { getIssues, issueUrl } from "@/lib/newsletter";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Homepage teaser for the newsletter archive. Same card layout as before, now
 * fed by the beehiiv-synced issues (lib/newsletter). Renders an empty/subscribe
 * state until the first issue is published.
 */
export async function LatestIssues() {
  const issues = await getIssues();

  return (
    <section
      id="writing"
      className="border-y border-line bg-night-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-4">The Weekly Note</p>
            <h2 className="font-display text-6xl sm:text-8xl">Recent issues</h2>
          </div>
          <Link
            href="/newsletter"
            className="hidden text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-lime sm:block"
          >
            Read all issues &rarr;
          </Link>
        </div>

        {issues.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-night p-10 text-center sm:p-16">
            <p className="mx-auto max-w-md text-lg text-ink-dim">
              The first issue is on its way. Subscribe and you won&rsquo;t miss
              it.
            </p>
            <a href="#newsletter" className="btn-lime mt-7">
              Get the newsletter
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issues.slice(0, 6).map((issue) => (
              <Link
                key={issue.slug}
                href={issueUrl(issue.slug)}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-night transition-colors hover:border-lime/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail is either a remote beehiiv image or our own /api/og PNG; next/image isn't worth the remotePatterns config */}
                <img
                  src={issue.thumbnail}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/9] w-full border-b border-line object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs tracking-widest text-ink-faint uppercase">
                    {formatDate(issue.date)} &middot; {issue.readingTimeMinutes}{" "}
                    min
                  </p>
                  <h3 className="mt-3 text-balance font-display text-2xl normal-case transition-colors group-hover:text-lime">
                    {issue.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-dim">
                    {issue.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
