import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

import { site } from "@/lib/site";

const CONTENT_DIR = path.join(process.cwd(), "content/writing");
const isProd = process.env.NODE_ENV === "production";

const FrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(50).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "invalid date"),
  reading_time_minutes: z.number().positive().optional(),
  og_image: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostMeta = {
  title: string;
  description: string;
  slug: string;
  date: string;
  readingTimeMinutes: number;
  ogImage: string;
  draft: boolean;
};

export type Post = PostMeta & { content: string };

export type TocItem = { depth: 2 | 3; text: string; id: string };

async function readAll(): Promise<Post[]> {
  let files: string[];
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
        const { data, content } = matter(raw);
        const fm = FrontmatterSchema.parse({
          ...data,
          slug: data.slug ?? file.replace(/\.mdx$/, ""),
        });

        const minutes =
          fm.reading_time_minutes ??
          Math.max(1, Math.round(readingTime(content).minutes));

        const ogImage =
          fm.og_image ??
          `/api/og?title=${encodeURIComponent(fm.title)}&eyebrow=${encodeURIComponent("Writing")}`;

        return {
          title: fm.title,
          description: fm.description,
          slug: fm.slug,
          date: fm.date,
          draft: fm.draft,
          readingTimeMinutes: minutes,
          ogImage,
          content,
        } satisfies Post;
      }),
  );

  return posts;
}

/** Posts visible in the current environment, newest first. Drafts hidden in prod. */
export async function getPosts(): Promise<Post[]> {
  const all = await readAll();
  return all
    .filter((p) => !isProd || !p.draft)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function postUrl(slug: string): string {
  return `${site.url}/writing/${slug}`;
}

/** Build a table of contents from h2/h3 headings, matching rehype-slug ids. */
export function buildToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const lines = content.split("\n");
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(##|###)\s+(.*)$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/[#*`]/g, "").trim();
    items.push({ depth, text, id: slugger.slug(text) });
  }

  return items;
}
