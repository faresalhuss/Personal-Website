/**
 * Central site configuration. Edit copy + links here.
 * The long-form About prose lives in app/(home)/_components/about.tsx.
 */
export const site = {
  name: "Fa'res Husseini",
  url: "https://www.fareshusseini.com",
  // ~150 chars for SEO. No em dashes (house style).
  description:
    "I build small businesses, a marketing firm and a pet-health startup, and send a weekly email about what I learn building them.",
  locale: "en_US",
  author: {
    name: "Fa'res Husseini",
    firstName: "Fa'res",
    location: "Atlanta, Georgia",
  },
  newsletter: {
    // Used in microcopy. Keep honest; change if the cadence/day changes.
    cadence: "every week",
  },
  socials: {
    tiktok: {
      label: "TikTok",
      handle: "@fareshusseini",
      url: "https://www.tiktok.com/@fareshusseini",
    },
    instagram: {
      label: "Instagram",
      handle: "@fareshusseini",
      url: "https://www.instagram.com/fareshusseini",
    },
    x: {
      label: "X",
      handle: "@fareshusseini",
      url: "https://x.com/fareshusseini",
    },
  },
  // sameAs links for Person JSON-LD
  get sameAs() {
    return [
      this.socials.tiktok.url,
      this.socials.instagram.url,
      this.socials.x.url,
    ];
  },
  /**
   * Flip to true to expose /writing in the header nav once the first
   * essay is published. This is the single toggle the brief calls for.
   */
  showWritingNav: false,
} as const;

export type Site = typeof site;
