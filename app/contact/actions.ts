"use server";

import { z } from "zod";

import { type ContactTopic, sendContactMessage } from "@/lib/contact";
import { rateLimitByIp } from "@/lib/rate-limit";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const Schema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(120),
  email: z.email("That doesn't look like a valid email."),
  topic: z.enum(["press", "bookings", "biz"]),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail.")
    .max(4000),
});

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots fill this hidden field.
  if (formData.get("company")) return { status: "success" };

  if (!(await rateLimitByIp("contact"))) {
    return {
      status: "error",
      message: "Too many messages. Please wait a minute and try again.",
    };
  }

  const parsed = Schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const result = await sendContactMessage({
    ...parsed.data,
    topic: parsed.data.topic as ContactTopic,
  });

  if (!result.ok) return { status: "error", message: result.error };
  return { status: "success" };
}
