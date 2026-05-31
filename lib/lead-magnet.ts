import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless, signed grant for the gated lead-magnet download. On a successful
 * signup we set an httpOnly cookie holding `${exp}.${hmac(exp)}`; the download
 * route verifies it. No database needed — the secret is the only server state.
 *
 * The PDF lives outside /public, so it cannot be fetched without this grant.
 */

const SECRET =
  process.env.DOWNLOAD_SIGNING_SECRET ??
  // Dev-only fallback so local runs work without config. In production the env
  // var must be set (see .env.example) — otherwise grants are trivially forgeable.
  "dev-insecure-secret-do-not-use-in-production";

export const GRANT_COOKIE = "rl_grant";
export const GRANT_TTL_SECONDS = 60 * 60; // 1 hour — plenty to click download

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

/** Issue a signed grant token valid for GRANT_TTL_SECONDS. */
export function issueGrant(now: number = Date.now()): string {
  const exp = String(now + GRANT_TTL_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}

/** Verify a grant token: valid signature and not expired. */
export function verifyGrant(
  token: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;

  const expected = sign(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  return Number(exp) > now;
}
