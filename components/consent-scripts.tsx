"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { useConsent } from "@/lib/consent";

/**
 * Gates Vercel Web Analytics and Speed Insights behind the user's analytics
 * consent. Both packages only inject their scripts when mounted, so we simply
 * don't render them until consent is granted — nothing is sent before then.
 */
export function ConsentScripts() {
  const { consent } = useConsent();

  if (!consent?.analytics) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
