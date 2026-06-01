import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { site } from "@/lib/site";

export type ContactTopic = "press" | "bookings" | "biz";

export type ContactPayload = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "Something went wrong. Try that again in a moment.";

/** Human label per topic, used in the email subject + stub log. */
const TOPIC_LABEL: Record<ContactTopic, string> = {
  press: "Press inquiry",
  bookings: "Podcast / booking inquiry",
  biz: "Business inquiry",
};

/** Which inbox each topic routes to. */
function inboxFor(topic: ContactTopic): string {
  return site.contact[topic];
}

/**
 * Sends a contact message. Uses Resend when RESEND_API_KEY is set; otherwise
 * captures the message locally so the form is fully functional in dev / before
 * the domain is verified. The swap happens automatically once the key is set.
 */
export async function sendContactMessage(
  payload: ContactPayload,
): Promise<ContactResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = inboxFor(payload.topic);

  if (apiKey) {
    return sendViaResend(payload, apiKey, to);
  }

  await stubPersist(payload, to);
  return { ok: true };
}

async function sendViaResend(
  payload: ContactPayload,
  apiKey: string,
  to: string,
): Promise<ContactResult> {
  const label = TOPIC_LABEL[payload.topic];
  // From must be an address on a domain verified in Resend. We send from the
  // dedicated contact.fareshusseini.com subdomain to keep the root domain's
  // deliverability clean. Override with CONTACT_FROM_EMAIL if it ever changes.
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Fa'res Husseini <noreply@contact.fareshusseini.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `[${label}] from ${payload.name}`,
        text: contactText(payload, label),
      }),
    });

    if (!res.ok) {
      console.error("[resend] send failed", res.status, await res.text());
      return { ok: false, error: GENERIC_ERROR };
    }

    return { ok: true };
  } catch (err) {
    console.error("[resend] request error", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

function contactText(payload: ContactPayload, label: string): string {
  return [
    `Topic: ${label}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");
}

async function stubPersist(
  payload: ContactPayload,
  to: string,
): Promise<void> {
  try {
    const dir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(process.cwd(), "data");
    const file = path.join(dir, "contact-messages.json");

    await fs.mkdir(dir, { recursive: true });

    let list: unknown[] = [];
    try {
      list = JSON.parse(await fs.readFile(file, "utf8")) as unknown[];
    } catch {
      // first write — file doesn't exist yet
    }

    list.push({ ...payload, to, at: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(list, null, 2));

    console.info(`[contact stub] captured message for ${to}`);
  } catch (err) {
    console.warn("[contact stub] could not persist", err);
  }
}
