import "server-only";

import { XMLParser } from "fast-xml-parser";
import readingTime from "reading-time";
import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

/**
 * Newsletter archive, sourced from the beehiiv RSS feed (free Launch plan).
 * beehiiv stays the source of truth for sending; this just mirrors published
 * issues onto the site. The feed's <content:encoded> carries the full post
 * HTML, which we sanitize (strip scripts/styles/classes/tracking + email
 * chrome) and re-style through the site's `.essay-prose` typography.
 *
 * Set BEEHIIV_RSS_URL to the feed from beehiiv → Settings → RSS. With no URL
 * the archive simply renders empty (and is noindex), so nothing breaks.
 */
export type Issue = {
  title: string;
  slug: string;
  /** Canonical beehiiv post URL (used for "read on beehiiv" + dedupe). */
  externalUrl: string;
  date: string;
  excerpt: string;
  image?: string;
  readingTimeMinutes: number;
  /** Sanitized, restyle-ready HTML body. */
  html: string;
};

/** Pull CDATA / #text / nested text out of a fast-xml-parser node. */
function pickText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(pickText).join("");
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return pickText(o.__cdata ?? o["#text"] ?? "");
  }
  return "";
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugFromLink(link: string, fallback: string): string {
  try {
    const parts = new URL(link).pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[a-z0-9-]+$/i.test(last)) return last.toLowerCase();
  } catch {
    // not a URL; fall through
  }
  return fallback
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function firstImage(html: string): string | undefined {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1];
}

// Allow images + safe link attributes on top of rehype-sanitize's defaults
// (which already drop scripts, styles, class names, and unknown tags).
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "figure", "figcaption"],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      "src",
      "alt",
      "title",
      "loading",
    ],
  },
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

/** Text content of a hast subtree, for chrome detection. */
function nodeText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

const CHROME_LINK =
  /unsubscribe|\/manage|email[-\s]?preferences|update your|beehiiv\.com\/?$|\?utm_source=.*beehiiv/i;
const CHROME_TEXT =
  /unsubscribe|update your email preferences|read online|view in browser|powered by beehiiv|©\s|all rights reserved/i;
// Subtrees to delete entirely. sanitize() "unwraps" disallowed elements
// (keeping their text children), so a <style>/<script> block would otherwise
// leak its raw CSS/JS as visible text — remove the whole subtree here first.
const DROP_TAGS = new Set([
  "style",
  "script",
  "head",
  "title",
  "noscript",
  "link",
  "meta",
  "template",
]);

/**
 * Light, conservative trim of beehiiv email chrome + hardening of links:
 * removes <style>/<script>/comment subtrees, drops blocks that are clearly
 * unsubscribe/preferences/"read online" footer cruft, and forces external
 * links to open safely in a new tab.
 */
function cleanTree() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node.children) return;
      node.children = node.children.filter((child) => {
        // Strip HTML comments (email templates are full of conditional ones).
        if (child.type === "comment") return false;
        if (child.type !== "element") return true;
        // Delete script/style/etc. subtrees outright (text and all).
        if (child.tagName && DROP_TAGS.has(child.tagName)) return false;
        const href =
          typeof child.properties?.href === "string"
            ? child.properties.href
            : "";
        const text = nodeText(child);
        // Drop anchors / small blocks that are clearly email chrome.
        if (CHROME_LINK.test(href)) return false;
        if (
          text.length < 120 &&
          CHROME_TEXT.test(text) &&
          (child.tagName === "p" ||
            child.tagName === "a" ||
            child.tagName === "div" ||
            child.tagName === "span")
        ) {
          return false;
        }
        return true;
      });
      for (const child of node.children) {
        if (child.type === "element") {
          if (
            child.tagName === "a" &&
            typeof child.properties?.href === "string" &&
            /^https?:/i.test(child.properties.href)
          ) {
            child.properties.target = "_blank";
            child.properties.rel = "noopener noreferrer";
          }
          walk(child);
        }
      }
    };
    walk(tree);
  };
}

async function sanitizeHtml(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(cleanTree)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(html);
  return String(file);
}

let parser: XMLParser | null = null;
function getParser(): XMLParser {
  parser ??= new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "__cdata",
    trimValues: true,
  });
  return parser;
}

async function fetchIssues(): Promise<Issue[]> {
  const url = process.env.BEEHIIV_RSS_URL;
  if (!url) return [];

  let xml: string;
  try {
    const res = await fetch(url, {
      // Mirror beehiiv hourly; ISR keeps pages fast and resilient if the feed
      // is briefly unreachable.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("[newsletter] feed fetch failed", res.status);
      return [];
    }
    xml = await res.text();
  } catch (err) {
    console.error("[newsletter] feed request error", err);
    return [];
  }

  let items: Record<string, unknown>[] = [];
  try {
    const parsed = getParser().parse(xml) as {
      rss?: { channel?: { item?: unknown } };
    };
    const raw = parsed.rss?.channel?.item;
    items = Array.isArray(raw)
      ? (raw as Record<string, unknown>[])
      : raw
        ? [raw as Record<string, unknown>]
        : [];
  } catch (err) {
    console.error("[newsletter] feed parse error", err);
    return [];
  }

  const issues = await Promise.all(
    items.map(async (item): Promise<Issue | null> => {
      const title = pickText(item.title).trim();
      const link = pickText(item.link).trim();
      const rawHtml = pickText(item["content:encoded"]);
      if (!title || !rawHtml) return null;

      const html = await sanitizeHtml(rawHtml);
      const text = stripTags(html);
      const enclosure = item.enclosure as { "@_url"?: string } | undefined;
      const descriptionText = stripTags(pickText(item.description));

      return {
        title,
        slug: slugFromLink(link, title),
        externalUrl: link,
        date: new Date(pickText(item.pubDate) || Date.now()).toISOString(),
        excerpt:
          (descriptionText || text).slice(0, 200).trim() +
          (text.length > 200 ? "…" : ""),
        image: enclosure?.["@_url"] ?? firstImage(rawHtml),
        readingTimeMinutes: Math.max(1, Math.round(readingTime(text).minutes)),
        html,
      };
    }),
  );

  return issues
    .filter((i): i is Issue => i !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getIssues(): Promise<Issue[]> {
  return fetchIssues();
}

export async function getIssue(slug: string): Promise<Issue | null> {
  const issues = await fetchIssues();
  return issues.find((i) => i.slug === slug) ?? null;
}

export function issueUrl(slug: string): string {
  return `/newsletter/${slug}`;
}
