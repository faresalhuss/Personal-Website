import { markdownToHtml } from "@/lib/markdown";
import { site } from "@/lib/site";
import { getPosts, postUrl } from "@/lib/writing";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const html = await markdownToHtml(post.content);
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${postUrl(post.slug)}</link>`,
        `<guid isPermaLink="true">${postUrl(post.slug)}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.description)}</description>`,
        `<content:encoded><![CDATA[${html}]]></content:encoded>`,
        "</item>",
      ].join("");
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — Writing</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-us</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
