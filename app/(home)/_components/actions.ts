"use server";

import { subscribeEmail } from "@/lib/subscribe";

export type SubscribeState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: real people leave this hidden field empty.
  if (formData.get("company")) {
    return { status: "success" };
  }

  const result = await subscribeEmail(formData.get("email"));

  if (result.ok) {
    return { status: "success" };
  }
  return { status: "error", message: result.error };
}
