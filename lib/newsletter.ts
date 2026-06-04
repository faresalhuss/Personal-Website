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
  /** Real image pulled from the feed, if any (used for the social OG card). */
  image?: string;
  /** Always-present card thumbnail: the feed image, or a generated OG card. */
  thumbnail: string;
  readingTimeMinutes: number;
  /** Sanitized, restyle-ready HTML body. */
  html: string;
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
};

/**
 * Decode HTML entities in plain-text fields (title, excerpt). beehiiv wraps
 * these in CDATA, so a compliant XML parser leaves `&#39;` etc. literal — React
 * would then render the raw entity. The body HTML is decoded by rehype-parse,
 * so this is only for the strings we render directly.
 */
function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]*);/gi, (m, code) => {
    if (code[0] === "#") {
      const n =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? m;
  });
}

/** Generated, on-brand fallback thumbnail (reuses the OG image route). */
function generatedThumbnail(title: string): string {
  return `/api/og?eyebrow=${encodeURIComponent(
    "The Weekly Note",
  )}&title=${encodeURIComponent(title)}`;
}

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
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
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
 * Cleans beehiiv's email HTML into flat, semantic prose:
 * - removes <style>/<script>/comment subtrees (sanitize would otherwise unwrap
 *   them and leak raw CSS as text),
 * - drops obvious email chrome (unsubscribe/preferences/"read online"/
 *   "powered by beehiiv"),
 * - **unwraps layout `<div>`s** so paragraphs/headings become direct children of
 *   `.essay-prose` and pick up its inter-block spacing (beehiiv nests everything
 *   in wrapper divs, which otherwise renders cramped),
 * - forces external links to open safely in a new tab.
 */
function cleanChildren(nodes: HastNode[]): HastNode[] {
  const out: HastNode[] = [];
  for (const node of nodes) {
    // Strip HTML comments (email templates are full of conditional ones).
    if (node.type === "comment") continue;
    if (node.type !== "element") {
      out.push(node);
      continue;
    }
    // Delete script/style/etc. subtrees outright (text and all).
    if (node.tagName && DROP_TAGS.has(node.tagName)) continue;

    const href =
      typeof node.properties?.href === "string" ? node.properties.href : "";
    const text = nodeText(node);
    if (CHROME_LINK.test(href)) continue;
    if (
      text.length < 120 &&
      CHROME_TEXT.test(text) &&
      (node.tagName === "p" ||
        node.tagName === "a" ||
        node.tagName === "div" ||
        node.tagName === "span")
    ) {
      continue;
    }

    // Harden external links.
    if (node.tagName === "a" && /^https?:/i.test(href)) {
      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }

    // Recurse first, then unwrap pure layout wrappers (lift their children).
    node.children = cleanChildren(node.children ?? []);
    if (node.tagName === "div") {
      out.push(...node.children);
    } else {
      out.push(node);
    }
  }
  return out;
}

function cleanTree() {
  return (tree: HastNode) => {
    tree.children = cleanChildren(tree.children ?? []);
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
      const title = decodeEntities(pickText(item.title).trim());
      const link = pickText(item.link).trim();
      const rawHtml = pickText(item["content:encoded"]);
      if (!title || !rawHtml) return null;

      const html = await sanitizeHtml(rawHtml);
      const text = stripTags(html);
      const enclosure = item.enclosure as { "@_url"?: string } | undefined;
      const descriptionText = stripTags(pickText(item.description));
      const image = enclosure?.["@_url"] ?? firstImage(rawHtml);
      const base = (descriptionText || text).slice(0, 200).trim();

      return {
        title,
        slug: slugFromLink(link, title),
        externalUrl: link,
        date: new Date(pickText(item.pubDate) || Date.now()).toISOString(),
        excerpt: base + (text.length > 200 ? "…" : ""),
        image,
        thumbnail: image ?? generatedThumbnail(title),
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
