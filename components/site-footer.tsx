import Link from "next/link";

import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { site } from "@/lib/site";

const socialLinks = [
  { label: site.socials.tiktok.label, href: site.socials.tiktok.url },
  { label: site.socials.instagram.label, href: site.socials.instagram.url },
  { label: site.socials.x.label, href: site.socials.x.url },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-night">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <nav aria-label="Social media">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold tracking-widest uppercase">
              {socialLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-dim transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal and site">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium tracking-wide text-ink-faint sm:justify-end">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                  >
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

        <div className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
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
