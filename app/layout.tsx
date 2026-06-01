import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";

import { ConsentScripts } from "@/components/consent-scripts";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Anton = heavy condensed display, standing in for Zuume until it's licensed.
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Entrepreneur, Creator & Writer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Fa'res Husseini",
    "Fares Husseini",
    "Clicks & Clients",
    "Animedic",
    "entrepreneur",
    "marketing",
    "small business",
    "newsletter",
    "Atlanta",
  ],
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  publisher: site.author.name,
  category: "Business",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: `${site.name} — Writing` },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Entrepreneur, Creator & Writer`,
    description: site.description,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.socials.x.handle,
    creator: site.socials.x.handle,
    title: `${site.name} — Entrepreneur, Creator & Writer`,
    description: site.description,
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${anton.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-night text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-night"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieConsent />
        <ConsentScripts />
      </body>
    </html>
  );
}
