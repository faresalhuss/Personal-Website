import { NextResponse } from "next/server";

import { subscribeEmail } from "@/lib/subscribe";

export async function POST(req: Request) {
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
