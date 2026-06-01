import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { site } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

const LAST_UPDATED = "June 1, 2026";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How fareshusseini.com works toward WCAG 2.1 AA, the measures already in place, known limitations, and how to report an accessibility issue.",
  alternates: { canonical: "/accessibility" },
  openGraph: {
    type: "website",
    url: "/accessibility",
    title: "Accessibility — Fa'res Husseini",
    description:
      "My commitment to keeping fareshusseini.com usable for everyone, and how to flag anything that gets in your way.",
    images: [
      {
        url: "/api/og?eyebrow=Accessibility",
        width: 1200,
        height: 630,
        alt: "Accessibility",
      },
    ],
  },
};

export default function AccessibilityPage() {
  return (
    <Section className="pt-32 pb-24 sm:pt-40">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Accessibility", url: `${site.url}/accessibility` },
        ])}
      />

      <div className="hero-rise">
        <p className="eyebrow mb-4">Commitment</p>
        <h1 className="font-display text-6xl text-ink sm:text-8xl">
          Accessibility
        </h1>
        <p className="mt-6 text-sm tracking-widest text-ink-faint uppercase">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="essay-prose mt-14">
        <p>
          I want everyone to be able to read, navigate, and use this site,
          whatever device or assistive technology they rely on. This page
          explains what I aim for, what is already in place, where I know there
          is still work to do, and how to tell me when something gets in your
          way.
        </p>

        <h2>The standard I aim for</h2>
        <p>
          I build this site to meet the{" "}
          <a
            href="https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aaa"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Content Accessibility Guidelines (WCAG) 2.1
          </a>{" "}
          at Level AA. Those guidelines are the widely accepted benchmark for
          making web content usable by people with a broad range of needs,
          including vision, hearing, motor, and cognitive differences.
        </p>

        <h2>What is already in place</h2>
        <ul>
          <li>
            A &ldquo;skip to content&rdquo; link so keyboard and screen-reader
            users can jump straight past the navigation.
          </li>
          <li>
            Full keyboard navigation, with a visible focus outline on every
            interactive element.
          </li>
          <li>
            Semantic HTML and labelled landmarks (header, main, and footer) so
            assistive technology can map the page.
          </li>
          <li>
            Form fields with proper labels, and status and error messages that
            are announced to screen readers.
          </li>
          <li>
            Color choices checked for sufficient contrast against the dark
            background, including the muted secondary text.
          </li>
          <li>
            Text that reflows and stays readable when zoomed or viewed on small
            screens, without breaking the layout.
          </li>
          <li>
            Respect for the &ldquo;reduce motion&rdquo; system setting, so the
            scroll and entrance animations ease off for anyone who prefers
            less movement.
          </li>
          <li>
            Meaningful alternative text on images, and decorative graphics
            hidden from assistive technology.
          </li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          Accessibility is something I keep working on rather than a box I tick
          once. A few areas I am still improving:
        </p>
        <ul>
          <li>
            Some third-party embeds and links take you to sites I do not
            control, and I cannot guarantee their accessibility.
          </li>
          <li>
            As I add new content and features, a fix in one place can surface
            an issue in another. I test as I go, but I may not catch everything
            right away.
          </li>
        </ul>
        <p>
          If you hit one of these, or anything else, I would genuinely like to
          know so I can fix it.
        </p>

        <h2>Tell me about a problem</h2>
        <p>
          If something on this site is hard to use or blocks you completely,
          please reach out through the{" "}
          <Link href="/contact">contact page</Link>. Let me know the page, what
          you were trying to do, and the browser or assistive technology you
          were using, and I will do my best to put it right and to offer the
          information you needed another way in the meantime.
        </p>

        <h2>Updates to this statement</h2>
        <p>
          I will revise this page as the site changes and as I make further
          improvements. The &ldquo;Last updated&rdquo; date above reflects the
          most recent review.
        </p>
      </div>
    </Section>
  );
}
