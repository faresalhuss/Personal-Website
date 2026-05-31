"use client";

import { openConsentSettings } from "@/lib/consent";

/**
 * Footer trigger that reopens the cookie consent preferences. Dispatches a
 * window event the {@link CookieConsent} banner listens for, so no shared
 * provider is needed.
 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => openConsentSettings()}
      className="transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
    >
      Cookie settings
    </button>
  );
}
