import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-night">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:px-10">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold tracking-widest uppercase">
          <li>
            <a
              href={site.socials.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-dim transition-colors hover:text-lime"
            >
              TikTok
            </a>
          </li>
          <li>
            <a
              href={site.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-dim transition-colors hover:text-lime"
            >
              Instagram
            </a>
          </li>
        </ul>
        <p className="text-xs tracking-wide text-ink-faint">
          &copy; {year} {site.name}
        </p>
        <p className="text-[0.7rem] tracking-wide text-ink-faint/80">
          Website by{" "}
          <a
            href="https://clicksclients.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-lime hover:underline"
          >
            Clicks &amp; Clients
          </a>
        </p>
      </div>
    </footer>
  );
}
