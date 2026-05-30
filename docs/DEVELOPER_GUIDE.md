# Developer Guide — fareshusseini.com

This is the engineering reference for the site. The [README](../README.md) covers
quick-start and content editing; this document covers architecture, conventions,
and the decisions behind them.

---

## 1. Prerequisites

| Tool    | Version           | Notes                                            |
| ------- | ----------------- | ------------------------------------------------ |
| Node    | ≥ 20              | Matches `@types/node` and Vercel's runtime.      |
| pnpm    | 10.x (see `packageManager` in `package.json`) | The only supported package manager. |
| Vercel CLI | latest         | Used via `pnpm dlx vercel` — no global install needed. |

```bash
pnpm install
cp .env.example .env.local   # optional — the site runs without it
pnpm dev                     # http://localhost:3000
```

> **Read before coding:** `AGENTS.md` flags that this is Next.js 16, which has
> breaking changes vs. older training data. When unsure about a framework API,
> read the bundled docs in `node_modules/next/dist/docs/` rather than guessing.

---

## 2. Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Dev server (Turbopack) on :3000.              |
| `pnpm build`        | Production build. Run before every deploy.    |
| `pnpm start`        | Serve the production build locally.           |
| `pnpm lint`         | ESLint (Next config + sorted imports).        |
| `pnpm lint:fix`     | Auto-fix lint issues (esp. import order).     |
| `pnpm typecheck`    | `tsc --noEmit`.                               |
| `pnpm format`       | Prettier write.                               |
| `pnpm format:check` | Prettier check (CI-style).                    |

**Definition of done for any change:** `pnpm lint && pnpm typecheck && pnpm build`
all pass. Imports must be sorted (`simple-import-sort`) — run `pnpm lint:fix` if
they drift.

---

## 3. Project structure

```
app/
  (home)/                 Route group for the homepage (no URL segment)
    _components/           Home-only sections: hero, intro, ventures, timeline,
                           writing, newsletter (+ newsletter-form, actions.ts)
    page.tsx               Homepage composition
  about/page.tsx           Long-form bio (prose lives here as a string[])
  books/page.tsx           Books / affiliate page
  writing/                 Essay index + [slug] reader
  api/
    og/route.tsx           Dynamic OG image (next/og ImageResponse)
    subscribe/route.ts     Newsletter endpoint (Beehiiv or local stub)
  icon.tsx, apple-icon.tsx Generated favicons (next/og)
  manifest.ts, robots.ts, sitemap.ts, rss.xml/, llms.txt/   SEO/AIO endpoints
  layout.tsx               Root layout: fonts, header/footer, metadata, JSON-LD
  template.tsx             Per-navigation wrapper (page transitions)
  globals.css              Tailwind 4 @theme tokens + component classes

components/                Shared UI (header, footer, section, book-*, reveal,
                           portrait, json-ld, mdx-content, placeholder)
lib/
  site.ts                  Central site config (name, url, socials, nav toggle)
  books.ts                 Books data layer — single source of truth (see §6)
  structured-data.ts       JSON-LD builders (Person, WebSite, Article, Book…)
  writing.ts               Essay loading/parsing from content/writing/*.mdx
  markdown.ts              MDX → HTML pipeline config
  subscribe.ts             Beehiiv client + local stub fallback
  cn.ts                    className merge helper
content/writing/*.mdx      Essays (frontmatter + body)
public/books/*.jpg         Self-hosted book covers, named {key}.jpg
public/fares-portrait.jpg  Portrait asset
scripts/*.mjs              One-off cover fetchers (Open Library + Google Books)
docs/                      This guide + the AI handoff file
```

---

## 4. Design system

All tokens are CSS custom properties in the `@theme` block of `app/globals.css`,
consumed through Tailwind 4 utility names (e.g. `bg-night`, `text-lime`,
`border-line`). **Never hard-code hex values in components** — add or reuse a token.

Core palette:

| Token              | Value     | Use                              |
| ------------------ | --------- | -------------------------------- |
| `--color-night`    | `#000000` | Primary background               |
| `--color-night-soft` | `#0b0b0b` | Raised cards on black          |
| `--color-paper`    | `#ffffff` | White "break" sections           |
| `--color-ink`      | `#ffffff` | Text on black                    |
| `--color-ink-dim`  | `#a6a6a6` | Muted text                       |
| `--color-ink-faint`| `#6b6b6b` | Captions (AA on black)           |
| `--color-lime`     | `#dbff00` | Primary accent                   |
| `--color-line`     | `#232323` | Borders on black                 |

Type: **Anton** (`--font-anton`) for display headings, **Geist** for body,
**Geist Mono** for code. Display headings use the `font-display` utility.

Reusable component classes live in `globals.css`: `.btn-lime`, `.btn-outline`,
`.eyebrow` (uppercase tracked label), `.reveal-item` (scroll reveal),
`.marquee-track`, plus prose styles for essays.

---

## 5. Animation conventions

- Library: **Motion** (`motion/react`). Keep it restrained.
- **Always** honor `prefers-reduced-motion` — either via `useReducedMotion()` in
  JS or by relying on the global reduced-motion CSS rule that collapses
  `.reveal-item` transitions.
- Patterns in use:
  - `components/book-grid.tsx` — one `IntersectionObserver` toggles a
    `data-shown` attribute on `.reveal-item` wrappers; staggered via
    `transitionDelay`. (No per-item observers; no synchronous `setState` in
    effects — that trips an ESLint rule.)
  - `app/(home)/_components/timeline.tsx` — `useScroll` + `useTransform` drive a
    lime fill up the center rail; each dot fills when scroll progress passes its
    measured threshold.
  - `components/books-marquee.tsx` — CSS marquee of unique covers with an edge mask.

---

## 6. Books data layer (`lib/books.ts`)

The most-edited file. Rules that keep it consistent:

- **`readingHistory`** is the single source of truth for finished books. The
  "books finished" counter is `readingHistory.length` — books are never
  double-counted.
- **`currentlyReading`** holds in-progress / up-next titles. **To mark one
  finished, move its object from `currentlyReading` into `readingHistory`.**
- **`featuredLists`** (favorites by theme) reference history books **by key** via
  `pick([...])` — never duplicate a book object. Reorder a list by reordering its keys.
- Covers are **self-hosted** at `public/books/{key}.jpg` for instant, reliable
  loading. Normalize new covers to **max 900px tall**:
  ```bash
  sips --resampleHeightWidthMax 900 -s format jpeg -s formatOptions 85 \
    public/books/{key}.jpg --out /tmp/x.jpg && mv /tmp/x.jpg public/books/{key}.jpg
  ```
- Affiliate compliance (Amazon Associates, tag `fareshussein-20`):
  - Links built from `asin` + `linkId` (or a full `amazonUrl`) by `amazonHref()`.
  - Every affiliate `<a>` uses `rel="sponsored noopener noreferrer"` + `target="_blank"`.
  - The FTC/Associates disclosure renders near the top of `/books` — keep it.
  - Each list emits `ItemList` → `Book` JSON-LD via `bookListSchema()`.

Per-book fields: `key` (unique slug), `title`, `author`, optional `isbn`,
optional `asin` + `linkId` (or full `amazonUrl`), optional `coverUrl` (overrides
the `/books/{key}.jpg` convention), optional `note`.

---

## 7. Writing / MDX

Essays are `.mdx` files in `content/writing/`. Frontmatter is validated at build
time (Zod). `reading_time_minutes` and `og_image` are computed if omitted. Drafts
(`draft: true`) appear only in dev. The header nav link to `/writing` is gated by
`showWritingNav` in `lib/site.ts`. RSS, sitemap, and llms.txt pick up published
essays automatically. See the README for the step-by-step add-an-essay flow.

---

## 8. SEO / AIO

- Per-page `metadata` exports (title, description, canonical, OpenGraph) — keep
  descriptions ~150–160 chars and **no em dashes** (house style).
- Structured data via `lib/structured-data.ts`, injected with the `<JsonLd>`
  component. The graph cross-references nodes by `@id` (Person ⇄ WebSite ⇄
  ProfilePage/Article).
- Machine endpoints: `sitemap.ts`, `robots.ts`, `rss.xml/`, `llms.txt/`,
  `manifest.ts`. Canonical host is **https://www.fareshusseini.com** (the `www`
  apex) — set once in `lib/site.ts` (`site.url`).
- OG images are generated at `/api/og` and accept an `?eyebrow=` param.

---

## 9. Environment variables

| Variable                 | Required | Purpose                                            |
| ------------------------ | -------- | -------------------------------------------------- |
| `BEEHIIV_API_KEY`        | No\*     | Beehiiv key. Without it, signups hit the local stub. |
| `BEEHIIV_PUBLICATION_ID` | No\*     | Beehiiv publication id. Needed with the key.       |
| `YOUTUBE_API_KEY`        | No       | Only when a live `<LatestVideo />` replaces the stub. |
| `YOUTUBE_CHANNEL_ID`     | No       | Channel for the latest video.                      |

\* Until **both** Beehiiv vars are set, the subscribe form writes to
`data/subscribers.json` in dev (gitignored). Set both and it posts to Beehiiv —
no code change. Never commit real values; `.env*` is gitignored.

---

## 10. Deploying

Hosted on Vercel (project `prj_OIFu5dRtfPTVA9nxAGg0onjaDzFl`, team scope
`onewahedllc`). The repo is already linked (`.vercel/`, gitignored).

```bash
pnpm build                                          # verify locally first
pnpm dlx vercel deploy --prod --yes --scope onewahedllc
```

After deploy, verify on the **www** host (the alias can briefly lag a fresh prod
deploy):

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.fareshusseini.com/books
```

Set `BEEHIIV_*` in Vercel project settings (or `vercel env add`) for live signups.

---

## 11. Git workflow

- `main` is the deployable branch. Keep it green (`lint`, `typecheck`, `build`).
- Conventional, imperative commit subjects ("Add…", "Fix…", "Update…").
- After a meaningful change, push so GitHub stays in sync with the deployed site.
- See [`docs/AI_HANDOFF.md`](AI_HANDOFF.md) for a full context snapshot that lets a
  new contributor (human or AI) pick up where the last session left off.
