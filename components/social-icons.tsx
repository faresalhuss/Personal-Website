import type { SVGProps } from "react";

/**
 * Monochrome brand glyphs that inherit `currentColor`, so they recolor on
 * hover/focus like any text link. Marked aria-hidden — the surrounding link
 * carries the accessible label.
 */
type IconProps = SVGProps<SVGSVGElement>;

export function TikTokIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M16.5 0h-3.2v16.2a2.9 2.9 0 1 1-2.9-2.9c.2 0 .4 0 .6.1V10.1a6 6 0 0 0-.6 0 6 6 0 1 0 6 6V7.7a7.5 7.5 0 0 0 4.4 1.4V5.9a4.4 4.4 0 0 1-4.3-4.4V0z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}
