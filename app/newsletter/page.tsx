import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { getIssues, issueUrl } from "@/lib/newsletter";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

// Revalidate hourly so newly sent issues appear without a redeploy.
export const revalidate = 3600;

const TITLE = "The Weekly Note";
const DESCRIPTION =
  "Every issue of The Weekly Note: a short weekly email on what it actually takes to build small businesses from zero. Read the archive or subscribe.";

export async function generateMetadata(): Promise<Metadata> {
  const issues = await getIssues();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/newsletter" },
    // Keep the archive out of search until there's at least one issue.
    robots: issues.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: "/newsletter",
      title: `${TITLE} — Fa'res Husseini`,
      description: DESCRIPTION,
      images: [
        {
          url: "/api/og?eyebrow=The%20Weekly%20Note",
          width: 1200,
          height: 630,
          alt: TITLE,
        },
      ],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsletterIndex() {
  const issues = await getIssues();

  return (
    <Section className="pt-32 pb-20 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "The Weekly Note", url: `${site.url}/newsletter` },
        ])}
      />

      <p className="eyebrow mb-4">The newsletter</p>
      <h1 className="font-display text-6xl text-ink sm:text-8xl">
        The Weekly
        <br />
        <span className="text-lime">Note</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-dim">
        A short email every week on what I&rsquo;m learning building. Read past
        issues below, or{" "}
        <Link
          href="/#newsletter"
          className="text-lime underline underline-offset-4"
        >
          subscribe
        </Link>{" "}
        to get the next one.
      </p>

      {issues.length === 0 ? (
        <div className="mt-12 max-w-prose text-lg text-ink-dim">
          <p>
            The first issue is on its way. Until then,{" "}
            <Link
              href="/#newsletter"
              className="text-lime underline underline-offset-4"
            >
              subscribe
            </Link>{" "}
            and you won&rsquo;t miss it.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-t border-line">
          {issues.map((issue) => (
            <li key={issue.slug}>
              <Link
                href={issueUrl(issue.slug)}
                className="group block py-7"
              >
                <p className="text-xs tracking-widest text-ink-faint uppercase">
                  {formatDate(issue.date)} &middot; {issue.readingTimeMinutes}{" "}
                  min read
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink normal-case transition-colors group-hover:text-lime">
                  {issue.title}
                </h2>
                <p className="mt-2 text-lg text-ink-dim">{issue.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
