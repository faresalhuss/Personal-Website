import { NextResponse } from "next/server";

import { rateLimitByIp } from "@/lib/rate-limit";
import { subscribeEmail } from "@/lib/subscribe";

export async function POST(req: Request) {
  if (!(await rateLimitByIp("subscribe-api"))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let email: unknown;

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    email = (body as { email?: unknown }).email;
  } else {
    const form = await req.formData();
    email = form.get("email");
  }

  const result = await subscribeEmail(email);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
}
