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
 * Homepage teaser for the newsletter archive. A clean editorial list (no
 * thumbnails — the title is the hero), matching the archive and the site's
 * dark + lime style. Renders an empty/subscribe state until the first issue.
 */
export async function LatestIssues() {
  const issues = await getIssues();

  return (
    <section
      id="writing"
      className="border-y border-line bg-night-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-4">The Weekly Note</p>
            <h2 className="font-display text-6xl sm:text-8xl">Recent issues</h2>
          </div>
          {issues.length > 0 ? (
            <Link
              href="/newsletter"
              className="group hidden items-center gap-2 text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-lime sm:flex"
            >
              Read all issues
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          ) : null}
        </div>

        {issues.length === 0 ? (
          <div className="mt-12 rounded-[var(--radius-card)] border border-line bg-night p-10 text-center sm:p-16">
            <p className="mx-auto max-w-md text-lg text-ink-dim">
              The first issue is on its way. Subscribe and you won&rsquo;t miss
              it.
            </p>
            <a href="#newsletter" className="btn-lime mt-7">
              Get the newsletter
            </a>
          </div>
        ) : (
          <>
            <ul className="mt-12 border-t border-line">
              {issues.slice(0, 4).map((issue) => (
                <li key={issue.slug}>
                  <Link
                    href={issueUrl(issue.slug)}
                    className="group flex items-start justify-between gap-6 border-b border-line py-8 sm:py-10"
                  >
                    <div className="max-w-2xl">
                      <p className="text-xs tracking-widest text-ink-faint uppercase">
                        {formatDate(issue.date)} &middot;{" "}
                        {issue.readingTimeMinutes} min read
                      </p>
                      <h3 className="mt-3 text-balance font-display text-3xl text-ink normal-case transition-colors group-hover:text-lime sm:text-4xl">
                        {issue.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-ink-dim">
                        {issue.excerpt}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-2xl text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-lime"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/newsletter"
              className="mt-8 inline-block text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-lime sm:hidden"
            >
              Read all issues &rarr;
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
