import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
