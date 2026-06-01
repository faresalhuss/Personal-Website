"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  InstagramIcon,
  TikTokIcon,
  XIcon,
} from "@/components/social-icons";
import { site } from "@/lib/site";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "What I'm building", href: "/#work" },
  { label: "The journey", href: "/#journey" },
  { label: "Writing", href: "/#writing" },
  { label: "Books", href: "/books" },
  { label: "Newsletter", href: "/#newsletter" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { label: site.socials.tiktok.label, url: site.socials.tiktok.url, Icon: TikTokIcon },
  {
    label: site.socials.instagram.label,
    url: site.socials.instagram.url,
    Icon: InstagramIcon,
  },
  { label: site.socials.x.label, url: site.socials.x.url, Icon: XIcon },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu and return focus to the toggle so keyboard users aren't
  // stranded on the body when the menu (and its links) become `inert`.
  function closeMenu() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape and restore focus to the toggle.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top scrim so the wordmark stays legible over scrolling content */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night via-night/70 to-transparent transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl tracking-wide text-ink uppercase transition-colors hover:text-lime sm:text-2xl"
        >
          Fa&rsquo;res Husseini
        </Link>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-ink transition-colors hover:border-lime hover:text-lime"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`h-[2px] w-5 bg-current transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Slide-out overlay menu. `inert` removes its links from the tab order
          and the accessibility tree while it's visually hidden, so keyboard
          users never land on offscreen controls. */}
      <div
        id="primary-menu"
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 overflow-y-auto bg-night transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-24 sm:px-10"
        >
          <ul className="space-y-2">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => closeMenu()}
                  style={{ transitionDelay: open ? `${i * 40 + 80}ms` : "0ms" }}
                  className={`block font-display text-4xl leading-[1.06] uppercase transition-all duration-500 hover:text-lime sm:text-6xl ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            aria-label="Social media"
            role="group"
            className="mt-12 flex items-center gap-4"
          >
            {socials.map(({ label, url, Icon }, i) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  transitionDelay: open
                    ? `${navLinks.length * 40 + 120 + i * 40}ms`
                    : "0ms",
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-ink-dim transition-all duration-500 hover:border-lime hover:text-lime focus-visible:border-lime focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
