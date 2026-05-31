import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { z } from "zod";

const EmailSchema = z.email();

export type SubscribeResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "Something went wrong. Try that again in a moment.";

export async function subscribeEmail(
  raw: unknown,
  opts: { source?: string } = {},
): Promise<SubscribeResult> {
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : raw;
  const parsed = EmailSchema.safeParse(email);

  if (!parsed.success) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (apiKey && pubId) {
    return subscribeViaBeehiiv(parsed.data, apiKey, pubId, opts.source);
  }

  // No Beehiiv credentials yet — capture locally so the form is fully
  // functional. Swap happens automatically once the env vars are set.
  await stubPersist(parsed.data);
  return { ok: true };
}

async function subscribeViaBeehiiv(
  email: string,
  apiKey: string,
  pubId: string,
  source: string = "fareshusseini.com",
): Promise<SubscribeResult> {
  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          // Tags the signup's origin (e.g. the reading-list lead magnet) so
          // sources are distinguishable in beehiiv without extra config.
          utm_source: source,
          referring_site: "fareshusseini.com",
        }),
      },
    );

    if (!res.ok) {
      console.error("[beehiiv] subscribe failed", res.status, await res.text());
      return { ok: false, error: GENERIC_ERROR };
    }

    return { ok: true };
  } catch (err) {
    console.error("[beehiiv] request error", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

type StubRecord = { email: string; at: string };

async function stubPersist(email: string): Promise<void> {
  try {
    const dir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(process.cwd(), "data");
    const file = path.join(dir, "subscribers.json");

    await fs.mkdir(dir, { recursive: true });

    let list: StubRecord[] = [];
    try {
      list = JSON.parse(await fs.readFile(file, "utf8")) as StubRecord[];
    } catch {
      // first write — file doesn't exist yet
    }

    if (!list.some((r) => r.email === email)) {
      list.push({ email, at: new Date().toISOString() });
      await fs.writeFile(file, JSON.stringify(list, null, 2));
    }

    console.info(`[subscribe stub] captured ${email}`);
  } catch (err) {
    // Never fail the user because of stub persistence.
    console.warn("[subscribe stub] could not persist", err);
  }
}
