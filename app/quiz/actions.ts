"use server";

import { z } from "zod";

import { SCORE_NAME, type TrackKey, tracks } from "@/lib/quiz";
import { subscribeEmail } from "@/lib/subscribe";

export type QuizState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const Schema = z.object({
  firstName: z.string().trim().min(1, "Please add your first name.").max(80),
  email: z.email("That doesn't look like a valid email."),
  // Optional. If provided, require at least 7 digits (lenient on formatting).
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || (v.match(/\d/g)?.length ?? 0) >= 7, {
      message: "Please enter a valid phone number, or leave it blank.",
    }),
  track: z.string(),
  score: z.coerce.number().min(0).max(10),
  tier: z.string().max(80).optional(),
});

export async function submitQuiz(
  _prev: QuizState,
  formData: FormData,
): Promise<QuizState> {
  // Honeypot — bots fill this hidden field.
  if (formData.get("company")) return { status: "success" };

  const parsed = Schema.safeParse({
    firstName: formData.get("firstName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    track: formData.get("track"),
    score: formData.get("score"),
    tier: formData.get("tier"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const { firstName, email, phone, track, score, tier } = parsed.data;
  const t = tracks[track as TrackKey] ?? tracks.explorer;

  const result = await subscribeEmail(email, {
    source: t.utmSource,
    customFields: {
      "First Name": firstName,
      "Phone Number": phone,
      [SCORE_NAME]: score,
      "Quiz Track": t.label,
      "Quiz Tier": tier ?? "",
    },
  });

  if (!result.ok) return { status: "error", message: result.error };
  return { status: "success" };
}
