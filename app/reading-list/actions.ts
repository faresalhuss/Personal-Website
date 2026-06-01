"use server";

import { cookies } from "next/headers";

import { GRANT_COOKIE, GRANT_TTL_SECONDS, issueGrant } from "@/lib/lead-magnet";
import { rateLimitByIp } from "@/lib/rate-limit";
import { subscribeEmail } from "@/lib/subscribe";

export type ReadingListState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function requestReadingList(
  _prev: ReadingListState,
  formData: FormData,
): Promise<ReadingListState> {
  // Honeypot: bots fill this hidden field. Pretend success but grant nothing,
  // so the gated download stays locked and no junk hits the list.
  if (formData.get("company")) {
    return { status: "success" };
  }

  if (!(await rateLimitByIp("reading-list"))) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a minute and try again.",
    };
  }

  const result = await subscribeEmail(formData.get("email"), {
    source: "reading-list",
  });

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  // Issue the short-lived signed download grant. With beehiiv double opt-in on,
  // a fake email never confirms (so never costs a slot) but still gets the PDF.
  const store = await cookies();
  store.set(GRANT_COOKIE, issueGrant(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GRANT_TTL_SECONDS,
  });

  return { status: "success" };
}
