import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Book covers are self-hosted in /public/books, so no remote image hosts
  // are required. next/image optimizes them (AVIF/WebP) and the CDN caches them.
};

export default nextConfig;
