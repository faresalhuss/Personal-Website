# fareshusseini.com

The personal site for Fa'res Husseini. It does three things, in order of priority:

1. Tell visitors who Fa'res is.
2. Get them to subscribe to the weekly newsletter.
3. Show what he's currently working on.

It is a personal home with a clear newsletter pull. Not a portfolio, not a sales funnel.

## Tech stack

- **Next.js 16** (App Router, React Server Components, Turbopack) + TypeScript
- **Tailwind CSS 4** with a custom token system — black canvas, acid-lime (`#DBFF00`)
  accent, white "break" panels. See the `@theme` block in `app/globals.css`.
- **Motion** for restrained animation (honors `prefers-reduced-motion`)
- **next/font**: Anton (heavy condensed display) + Geist / Geist Mono (sans + mono)
- **MDX** via `next-mdx-remote/rsc` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, and `shiki`
- **OG images**, favicon, and apple-icon generated with `next/og`
- **Newsletter** via the Beehiiv API (falls back to a local stub until configured)
- **Vercel Analytics** + Speed Insights
- **pnpm**, ESLint (with sorted imports), Prettier

> **Design note:** a bold, high-contrast dark theme with an acid-lime accent.
> Anton stands in for the licensed Zuume display face.

For deeper architecture, conventions, and workflows see
**[`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md)**.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # optional; the site runs without it
pnpm dev                     # http://localhost:3000
```

Useful scripts:

```bash
pnpm build         # production build
pnpm lint          # eslint
pnpm typecheck     # tsc --noEmit
pnpm format        # prettier --write .
```

## Environment variables

| Variable                 | Required | Purpose                                                            |
| ------------------------ | -------- | ------------------------------------------------------------------ |
| `BEEHIIV_API_KEY`        | No\*     | Beehiiv API key. Without it, signups fall back to a local stub.    |
| `BEEHIIV_PUBLICATION_ID` | No\*     | Beehiiv publication ID. Needed alongside the API key.              |
| `YOUTUBE_API_KEY`        | No       | Only when the YouTube placeholder is swapped for a live component. |
| `YOUTUBE_CHANNEL_ID`     | No       | Channel to pull the latest video from.                             |

\* Until **both** Beehiiv vars are set, the subscribe form writes to `data/subscribers.json`
in dev (gitignored). Set both vars and the form posts to Beehiiv automatically — no code change.

## Adding an essay (5 steps)

1. Create `content/writing/my-essay-slug.mdx`.
2. Add frontmatter (validated at build time):
   ```yaml
   ---
   title: "Your title"
   description: "150–160 chars for SEO."
   slug: my-essay-slug
   date: "2026-06-01"
   draft: false # set true to keep it out of the production build
   ---
   ```
   `reading_time_minutes` and `og_image` are computed automatically if omitted.
3. Write the body in MDX (headings, code, blockquotes, footnotes, tables all supported).
4. Run `pnpm dev` and preview at `/writing/my-essay-slug`. Drafts are visible in dev only.
5. To surface the essay index in the header nav, flip `showWritingNav` to `true` in
   `lib/site.ts`. RSS, sitemap, and llms.txt pick up published essays automatically.

## Adding books

Everything lives in **`lib/books.ts`**. `AMAZON_ASSOCIATES_TAG` holds your tracking id.

- **`readingHistory`** — every finished book. This is the single source of truth; the
  "books finished" counter is `readingHistory.length`, so books are never double-counted.
- **`currentlyReading`** — books you're in / next up. **To mark one finished, move its
  object from `currentlyReading` into `readingHistory`** (and, to feature it, add its
  `key` to a list — see below).
- **`featuredLists`** — favorites by theme. Each list references books by `key` via
  `pick([...])`, so a favorite is automatically part of your history with no duplicate
  data. Reorder a list by reordering its keys.

Per book: `key` (unique), `title`, `author`, optional `isbn` (cover via Open Library;
or set `coverUrl` to a `/public/books/...` image), optional `asin` + `linkId` (a clean
affiliate link is built from these + your tag) or a full `amazonUrl`, and an optional
`note`.

The page renders the counter, currently-reading, featured lists, and the full reading
history; affiliate links carry `rel="sponsored"`; the required FTC/Associates disclosure
shows near the top; and each list emits `ItemList` → `Book` JSON-LD. `/books` is in the
nav, sitemap, and llms.txt.

## Editing the bio

The long-form "About" prose lives in **`app/about/page.tsx`** as a plain array of
paragraph strings. Edit the strings there; nothing else needs to change.

Other homepage copy (hero, what I'm working on, newsletter) lives in the sibling files
under `app/(home)/_components/`. Site-wide constants (name, URL, social handles, the
writing-nav toggle) live in `lib/site.ts`.

## Deploying

Hosted on Vercel (project `prj_OIFu5dRtfPTVA9nxAGg0onjaDzFl`).

```bash
pnpm dlx vercel link --project prj_OIFu5dRtfPTVA9nxAGg0onjaDzFl
pnpm dlx vercel        # preview deploy
pnpm dlx vercel --prod # production deploy
```

Set `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` in the Vercel project settings (or via
`vercel env add`) for live newsletter signups. Confirm `fareshusseini.com` DNS + SSL on the
Vercel project before the first production deploy.

## Documentation

- **[`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md)** — architecture, file map,
  design tokens, animation patterns, and the books/affiliate model.
- **[`docs/AI_HANDOFF.md`](docs/AI_HANDOFF.md)** — a self-contained context snapshot
  (owner, voice, design direction, current state, infra) so a new contributor — human
  or an AI coding session — can pick up where the last one left off. Kept current as
  the project evolves.

Source of truth lives on GitHub: <https://github.com/faresalhuss/Personal-Website>.
