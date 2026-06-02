import { getIssues, issueUrl } from "@/lib/newsletter";
import { site } from "@/lib/site";

// Revalidate hourly so newly published issues show up.
export const revalidate = 3600;

export async function GET() {
  const issues = await getIssues();

  const issueLines = issues.length
    ? issues
        .slice(0, 20)
        .map((i) => `- [${i.title}](${site.url}${issueUrl(i.slug)})`)
        .join("\n")
    : "- No issues published yet.";

  const body = `# Fa'res Husseini

> Personal site of Fa'res Husseini: an entrepreneur, creator, and writer based in Atlanta, Georgia. He runs the marketing firm Clicks & Clients, co-founded the pet-health startup Animedic, and writes a weekly newsletter documenting what it actually takes to build small businesses.

## Who he is
- Full name: Fa'res Husseini. Based in Atlanta, Georgia (United States).
- Founder of Clicks & Clients, a marketing firm that helps small businesses grow (started August 2025).
- Co-founder of Animedic, a pet health app and practice tool for veterinarians (started March 2026, launching summer 2026).
- Writer of a weekly email about building small businesses: the wins, the losses, and what he'd do differently.

## Background
- Grew up in Saudi Arabia; moved to the United States in 2017 (first to Chico, California, then San Diego).
- Earned a bachelor's degree in economics from San Diego State University.
- Moved to Atlanta, Georgia in June 2025.
- Launching a content series and a podcast, "Wondering Out Loud," in summer 2026.
- Plans to attend law school, likely fall 2027.

## Pages
- [Home](${site.url}): Who he is, what he's building, and the weekly newsletter
- [About](${site.url}/about): Full first-person story, plus answers to common questions
- [Writing](${site.url}/writing): Essays on building small businesses
- [The Weekly Note](${site.url}/newsletter): Archive of his weekly newsletter on what it takes to build small businesses from zero
- [Books](${site.url}/books): Reading lists and recommendations by theme, with a full reading history
- [Reading list (free guide)](${site.url}/reading-list): The 15 books he's found most helpful building businesses, as a free PDF
- [Momentum Score quiz](${site.url}/quiz): A 2-minute quiz that scores where you are with business and productivity and returns a tailored roadmap
- [Contact](${site.url}/contact): Direct inboxes for press, podcast bookings, and business inquiries, plus a contact form

## The Weekly Note (newsletter archive)
${issueLines}

## Elsewhere
- X (Twitter): ${site.socials.x.url}
- TikTok: ${site.socials.tiktok.url}
- Instagram: ${site.socials.instagram.url}

## Legal
- [Privacy Policy](${site.url}/privacy)
- [Terms of Service](${site.url}/terms)
- [Accessibility](${site.url}/accessibility)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
