import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ReadingProgress } from "@/components/reading-progress";
import { Section } from "@/components/section";
import { getIssue, getIssues, issueUrl } from "@/lib/newsletter";
import { site } from "@/lib/site";
import {
  articleSchema,
  breadcrumbSchema,
  personSchema,
  websiteSchema,
} from "@/lib/structured-data";

type Params = Promise<{ slug: string }>;

// Prerender the issues known at build; allow newly synced ones on demand.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const issues = await getIssues();
  return issues.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) return {};

  const url = `${site.url}${issueUrl(issue.slug)}`;
  const ogImage = issue.image
    ? issue.image
    : `${site.url}/api/og?eyebrow=${encodeURIComponent(
        "The Weekly Note",
      )}&title=${encodeURIComponent(issue.title)}`;

  return {
    title: issue.title,
    description: issue.excerpt,
    // Self-canonical: this is Fa'res's primary home for the content.
    alternates: { canonical: issueUrl(issue.slug) },
    openGraph: {
      type: "article",
      title: issue.title,
      description: issue.excerpt,
      url,
      publishedTime: issue.date,
      images: [{ url: ogImage, width: 1200, height: 630, alt: issue.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: issue.title,
      description: issue.excerpt,
      images: [ogImage],
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

export default async function IssuePage({ params }: { params: Params }) {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) notFound();

  const url = `${site.url}${issueUrl(issue.slug)}`;
  const ogImage = issue.image
    ? issue.image
    : `${site.url}/api/og?eyebrow=${encodeURIComponent(
        "The Weekly Note",
      )}&title=${encodeURIComponent(issue.title)}`;

  return (
    <article className="pt-24 pb-16 sm:pt-28">
      <ReadingProgress />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={personSchema()} />
      <JsonLd
        data={articleSchema({
          title: issue.title,
          description: issue.excerpt,
          url,
          datePublished: issue.date,
          ogImage,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "The Weekly Note", url: `${site.url}/newsletter` },
          { name: issue.title, url },
        ])}
      />

      <Section>
        <header>
          <Link
            href="/newsletter"
            className="hero-rise group inline-flex items-center gap-1.5 text-xs tracking-widest text-ink-faint uppercase underline-offset-4 transition-colors hover:text-lime"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
            >
              &larr;
            </span>
            <span className="group-hover:underline">The Weekly Note</span>
          </Link>
          <p
            className="hero-rise mt-6 text-xs tracking-widest text-ink-faint uppercase"
            style={{ animationDelay: "0.06s" }}
          >
            {formatDate(issue.date)} &middot; {issue.readingTimeMinutes} min
            read
          </p>
          <h1
            className="hero-rise mt-4 text-balance font-display text-5xl leading-[1.02] text-ink normal-case sm:text-7xl"
            style={{ animationDelay: "0.12s" }}
          >
            {issue.title}
          </h1>
        </header>

        <div
          className="essay-prose animate-fade-up mt-12"
          style={{ animationDelay: "0.2s" }}
          dangerouslySetInnerHTML={{ __html: issue.html }}
        />

        {/* Footer: subscribe CTA + canonical source link */}
        <div className="animate-fade-up mt-16 rounded-[var(--radius-card)] border border-line bg-night-soft p-7 sm:p-9">
          <p className="eyebrow mb-2">Get the next one</p>
          <p className="text-lg text-ink">
            The Weekly Note lands in your inbox every week.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link href="/#newsletter" className="btn-lime">
              Subscribe
            </Link>
            {issue.externalUrl ? (
              <a
                href={issue.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold tracking-wide text-ink-faint underline-offset-4 transition-colors hover:text-lime hover:underline"
              >
                Read this issue on beehiiv &nearr;
              </a>
            ) : null}
          </div>
        </div>
      </Section>
    </article>
  );
}
