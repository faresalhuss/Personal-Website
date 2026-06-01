import type { NextConfig } from "next";

// Security headers applied to every route. Kept conservative so nothing breaks:
// the CSP only restricts base-uri/object-src/frame-ancestors (it does NOT lock
// down script/style/img sources, which would risk breaking Vercel Analytics,
// next/og, fonts, and hydration). HSTS is added by Vercel automatically.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Book covers are self-hosted in /public/books, so no remote image hosts
  // are required. next/image optimizes them (AVIF/WebP) and the CDN caches them.

  // The lead-magnet PDF lives outside /public (so it can't be fetched without a
  // signed grant). Bundle it into the download route's serverless function so
  // fs.readFile resolves it on Vercel.
  outputFileTracingIncludes: {
    "/api/reading-list/download": ["./assets/lead-magnets/*.pdf"],
  },
};

export default nextConfig;
