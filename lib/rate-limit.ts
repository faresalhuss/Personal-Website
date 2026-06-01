import "server-only";

import { headers } from "next/headers";

/**
 * Lightweight in-memory rate limiter for the public form endpoints. It's a
 * best-effort baseline (module state is per serverless instance, so it catches
 * bursts on a warm instance, not a distributed flood). Combined with the
 * honeypots it stops casual abuse for free. For distributed limiting, swap the
 * store for Upstash Redis later.
 */
type Bucket = { count: number; reset: number };
const store = new Map<string, Bucket>();

/** Best-effort client IP from the proxy headers Vercel sets. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if the action is allowed. `key` should scope by action + ip,
 * e.g. `subscribe:1.2.3.4`. Default: 6 requests per 60s.
 */
export function rateLimit(key: string, limit = 6, windowMs = 60_000): boolean {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded on a long-lived
  // instance.
  if (store.size > 5000) {
    for (const [k, b] of store) if (now > b.reset) store.delete(k);
  }

  const bucket = store.get(key);
  if (!bucket || now > bucket.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

/** Convenience: rate-limit the current request by action name + client IP. */
export async function rateLimitByIp(
  action: string,
  limit?: number,
): Promise<boolean> {
  const ip = await clientIp();
  return rateLimit(`${action}:${ip}`, limit);
}
