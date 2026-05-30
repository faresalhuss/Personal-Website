import { site } from "@/lib/site";
import { getPosts, postUrl } from "@/lib/writing";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();

  const essayLines = posts.length
    ? posts
        .map((p) => `- [${p.title}](${postUrl(p.slug)}): ${p.description}`)
        .join("\n")
    : "- No essays published yet.";

  const body = `# Fa'res Husseini

> Personal site of Fa'res Husseini: entrepreneur, creator, and writer. He runs the marketing firm Clicks & Clients, co-founded the pet-health startup Animedic, and writes a weekly newsletter documenting what it actually takes to build small businesses.

## About
- Grew up in Saudi Arabia; moved to the United States in 2017 (first to Chico, California, then San Diego).
- Earned a bachelor's in economics from San Diego State University.
- Founded Clicks & Clients (marketing firm) in August 2025.
- Co-founded Animedic (a pet health app and vet practice tool) in March 2026, launching summer 2026.
- Launching a content series and a podcast, "Wondering Out Loud," in summer 2026.
- Plans to attend law school, likely fall 2027.

## Pages
- [Home](${site.url}): Who he is, what he's building, the weekly newsletter
- [About](${site.url}/about): Full first-person story
- [Writing](${site.url}/writing): Essays
- [Books](${site.url}/books): Reading lists and recommendations by theme

## Writing
${essayLines}

## Elsewhere
- TikTok: ${site.socials.tiktok.url}
- Instagram: ${site.socials.instagram.url}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
