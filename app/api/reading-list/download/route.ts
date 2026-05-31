import { readFile } from "node:fs/promises";
import path from "node:path";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { GRANT_COOKIE, verifyGrant } from "@/lib/lead-magnet";

// The PDF lives outside /public; next.config's outputFileTracingIncludes bundles
// it into this route's function so readFile works on Vercel.
const PDF_PATH = path.join(
  process.cwd(),
  "assets",
  "lead-magnets",
  "reading-list.pdf",
);

export async function GET(req: Request) {
  const store = await cookies();
  const token = store.get(GRANT_COOKIE)?.value;

  if (!verifyGrant(token)) {
    // No valid grant — send them back to the landing page to sign up.
    return NextResponse.redirect(new URL("/reading-list", req.url));
  }

  try {
    const data = await readFile(PDF_PATH);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="fares-husseini-reading-list.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[reading-list] could not read PDF", err);
    return NextResponse.redirect(new URL("/reading-list", req.url));
  }
}
