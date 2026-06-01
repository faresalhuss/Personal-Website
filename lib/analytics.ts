"use client";

import { track } from "@vercel/analytics";

import { readConsent } from "@/lib/consent";

/**
 * Conversion events we track. Keeping the names in one place avoids typos and
 * documents exactly what's measured. These are all post-consent, aggregate
 * counts — no personal data is ever passed as a property.
 */
export type ConversionEvent =
  | "newsletter_subscribe"
  | "reading_list_request"
  | "quiz_complete"
  | "contact_submit";

/**
 * Fire a custom Vercel Analytics event, but only if the visitor granted
 * analytics consent. The Analytics script itself is also gated (see
 * ConsentScripts), so this is belt-and-suspenders: nothing is sent or queued
 * for a visitor who declined.
 */
export function trackConversion(
  event: ConversionEvent,
  properties?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  if (!readConsent()?.analytics) return;
  track(event, properties);
}
