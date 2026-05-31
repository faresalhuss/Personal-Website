"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Lightweight, dependency-free cookie-consent store.
 *
 * The choice is persisted in BOTH localStorage (fast client reads) and a
 * first-party cookie (so a future server/middleware read is possible and so it
 * survives in the document even if storage is cleared by some browsers). Only
 * the "analytics" category is gated; "necessary" is always on. Functional
 * server cookies such as the reading-list download grant (`rl_grant`) are
 * unrelated to this and are never touched here.
 */

export const CONSENT_COOKIE = "fh_consent";
export const CONSENT_STORAGE_KEY = "fh-consent";
export const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

/** Fired on the window whenever consent changes or settings are requested. */
export const CONSENT_CHANGE_EVENT = "fh:consent-change";
export const CONSENT_OPEN_EVENT = "fh:consent-open";

export type ConsentValue = {
  version: number;
  necessary: true;
  analytics: boolean;
  /** epoch ms when the choice was recorded */
  decidedAt: number;
};

function isConsentValue(v: unknown): v is ConsentValue {
  if (typeof v !== "object" || v === null) return false;
  const c = v as Record<string, unknown>;
  return (
    typeof c.analytics === "boolean" &&
    typeof c.version === "number" &&
    typeof c.decidedAt === "number"
  );
}

/** Read the stored consent, or null if no decision has been made (or stale). */
export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentValue(parsed)) return null;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // storage may be unavailable (private mode); the cookie below is a fallback
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(
      JSON.stringify({ a: value.analytics ? 1 : 0, v: value.version }),
    )}` +
    `; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_CHANGE_EVENT, { detail: value }),
  );
}

/** Persist a decision for the analytics category. */
export function setConsent(analytics: boolean): ConsentValue {
  const value: ConsentValue = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    decidedAt: Date.now(),
  };
  writeConsent(value);
  return value;
}

/** Ask the banner UI to open its preferences panel (used by the footer link). */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

// --- external-store plumbing for useSyncExternalStore --------------------

let cachedRaw: string | null = null;
let cachedValue: ConsentValue | null = null;

/**
 * Snapshot read for the store. Memoised on the raw localStorage string so the
 * returned object identity is stable between renders (required by
 * useSyncExternalStore to avoid infinite loops).
 */
function getSnapshot(): ConsentValue | null {
  const value = readConsent();
  const raw = value ? JSON.stringify(value) : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = value;
  }
  return cachedValue;
}

function getServerSnapshot(): null {
  return null;
}

const noopSubscribe = () => () => {};

/**
 * `true` only after the component has mounted on the client. Lets UI defer
 * client-only decisions (like showing the banner) to after hydration without
 * a setState-in-effect, avoiding hydration mismatches.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/**
 * Subscribe to the current consent decision. Returns `null` if no decision
 * exists, or the stored {@link ConsentValue}. Uses useSyncExternalStore so the
 * server render (and first client render) consistently see `null`, avoiding
 * hydration mismatches.
 */
export function useConsent(): {
  consent: ConsentValue | null;
  accept: () => void;
  reject: () => void;
  save: (analytics: boolean) => void;
} {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const accept = useCallback(() => {
    setConsent(true);
  }, []);
  const reject = useCallback(() => {
    setConsent(false);
  }, []);
  const save = useCallback((analytics: boolean) => {
    setConsent(analytics);
  }, []);

  return { consent, accept, reject, save };
}
