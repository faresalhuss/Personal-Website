import Link from "next/link";

import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { site } from "@/lib/site";

const exploreLinks = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Reading list", href: "/reading-list" },
  { label: "Momentum Score quiz", href: "/quiz" },
  ...(site.showWritingNav ? [{ label: "Writing", href: "/writing" }] : []),
];

const socialLinks = [
  { label: site.socials.tiktok.label, href: site.socials.tiktok.url },
  { label: site.socials.instagram.label, href: site.socials.instagram.url },
  { label: site.socials.x.label, href: site.socials.x.url },
];

const siteLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

const linkClass =
  "text-sm text-ink-dim transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime";
const headingClass =
  "text-xs font-semibold tracking-widest text-ink-faint uppercase";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-night">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-ink transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
            >
              FA&rsquo;RES HUSSEINI
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-dim">
              I build small businesses, and I write a weekly note on what it
              actually takes.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h2 className={headingClass}>Explore</h2>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <nav aria-label="Social media">
            <h2 className={headingClass}>Connect</h2>
            <ul className="mt-4 space-y-3">
              {socialLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Site & legal */}
          <nav aria-label="Legal and site">
            <h2 className={headingClass}>Site</h2>
            <ul className="mt-4 space-y-3">
              {siteLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-wide text-ink-faint">
            &copy; {year} {site.name}
          </p>
          <p className="text-[0.7rem] tracking-wide text-ink-faint">
            Website by{" "}
            <a
              href="https://clicksclients.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-lime hover:underline focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
            >
              Clicks &amp; Clients
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
