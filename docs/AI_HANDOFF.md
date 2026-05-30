# AI Handoff — fareshusseini.com

**Purpose:** a single self-contained context file. If you hand another Claude Code
session this document plus git access, it should be able to pick up exactly where
the last one left off — without re-deriving the project's history, conventions, or
the owner's preferences.

**Last updated:** 2026-05-30
**Maintenance rule:** this file is updated deliberately, not after every prompt.
When a change is significant enough to matter here (new section/feature, changed
design direction, new convention, deploy/infra change, a preference learned), the
assistant should **ask the owner whether to update this file**. Remove or replace
anything that is no longer true rather than letting it accumulate.

---

## 1. What this is

The personal website for **Fa'res Husseini** at **https://www.fareshusseini.com**.
A personal home — not a portfolio, not a sales funnel. Priorities, in order:

1. Tell visitors who Fa'res is.
2. (Eventually) get them onto the weekly newsletter.
3. Show what he's currently working on.

## 2. Who the owner is (context that shapes copy)

- **Fa'res Husseini**, based in Atlanta, Georgia.
- Runs **Clicks & Clients** (a marketing firm, mostly small law firms; started
  Aug 2025) and co-founded **Animedic** (pet-health app / vet practice tool;
  Mar 2026) with a co-founder. Also associated with **OneWahed**.
- Plans to start **law school in 2027**; wants to build something that works first.
- Podcast **"Wondering Out Loud"** planned for summer 2026.
- Bio arc (for the About page): YouTube/gaming as a kid → moved to the U.S. at 14
  (from Saudi Arabia) → finished high school → college/degree → building now.
  His mother started businesses before he was born. Keep the bio **interwoven as a
  story, not a timeline**.

## 3. Voice & house style (do not violate)

- **Warm, first-person, learner's voice** — never teacher/guru. (E.g. book blurb
  is "the ones I've found the most helpful," not "the ones you must read.")
- **No em dashes in SEO/meta descriptions.** Keep meta descriptions ~150–160 chars.
- Avoid AI-tells / filler. Write like a thoughtful person, not a content mill.
- **De-emphasize Atlanta** — it's in config for JSON-LD but not featured in copy.
- **No newsletter capture in the hero.**
- Eyebrow/tagline framing: "entrepreneur, creator, and writer."
- Never reproduce book copyrighted text — only titles, authors, and covers.

## 4. Design direction (FINAL, accepted)

- A **bold, high-contrast dark theme** with an acid-lime accent — editorial and
  punchy.
- Black canvas (`#000`), acid-lime accent (`#DBFF00`), occasional white "break"
  panels. Bold **condensed display type** — **Anton** (placeholder for the
  licensed **Zuume** face; swap later if licensed).
- Photo-light where needed; restrained motion that honors
  `prefers-reduced-motion`.
- All colors/spacing come from the `@theme` tokens in `app/globals.css`. Never
  hard-code hex in components.

> History note: the very first build used a sage-on-paper palette with Fraunces.
> That was fully scrapped and replaced by the dark+lime direction above. If you
> see references to "sage" or "Fraunces" anywhere, they are stale.

## 5. Tech stack

Next.js 16 (App Router, RSC, Turbopack) · TypeScript · Tailwind CSS 4 (`@theme`
tokens) · Motion (`motion/react`) · next/font (Anton + Geist + Geist Mono) ·
MDX (`next-mdx-remote/rsc` + remark-gfm, rehype-slug, rehype-autolink-headings,
shiki) · next/og (OG images, favicon, apple-icon) · Vercel Analytics + Speed
Insights · **pnpm** · ESLint (sorted imports) + Prettier.

See [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) for the full architecture, file map,
and conventions. Key data/config files: `lib/site.ts` (site-wide config),
`lib/books.ts` (books data layer), `lib/structured-data.ts` (JSON-LD).

## 6. Current state of the site (what exists today)

- **Homepage** (`app/(home)/`): hero, intro, ventures, scroll-driven **timeline**
  (lime fill climbs the center rail; dots fill as you pass them), writing teaser,
  newsletter section.
- **/about**: long-form bio as a `string[]` of paragraphs in `app/about/page.tsx`.
- **/books**: curated reading lists + Amazon affiliate links. Single source of
  truth is `lib/books.ts`. Features: cover marquee, stats row (books finished /
  reading now / favorites), FTC disclosure, **currently reading**, **favorites by
  theme**, full **reading history**, and a subtle e-reader mention
  (**Kobo Libra Colour**, affiliate link) at the bottom.
  - **Counter = `readingHistory.length`** (no double-counting). Currently **42**
    finished books. Most recent addition: *Introduction to Islamic Economics*.
  - Covers are **self-hosted** at `public/books/{key}.jpg`, normalized to ≤900px tall.
  - Amazon Associates tag: **`fareshussein-20`**. Affiliate links use
    `rel="sponsored noopener noreferrer"` + `target="_blank"`.
- **/writing**: MDX pipeline + `[slug]` reader exist, but **no essays are
  published yet** and the nav link is hidden (`showWritingNav: false` in
  `lib/site.ts`). One `_example.mdx` exists as a template.
- **SEO/AIO**: per-page metadata, JSON-LD graph, `sitemap.ts`, `robots.ts`,
  `rss.xml`, `llms.txt`, `manifest.ts`, generated favicon/apple-icon. Canonical
  host is the **www** apex.
- **Footer**: TikTok + Instagram (both `@fareshusseini`), `© {year}` line, and a
  small **"Website by Clicks & Clients"** credit linking to clicksclients.com.

## 7. Infrastructure & deploy

- **Hosting:** Vercel. Project `prj_OIFu5dRtfPTVA9nxAGg0onjaDzFl`, team scope
  **`onewahedllc`**. Repo is linked via `.vercel/` (gitignored).
- **Deploy:** `pnpm build` then
  `pnpm dlx vercel deploy --prod --yes --scope onewahedllc`. After deploying,
  verify on `https://www.fareshusseini.com` (the www alias can briefly lag a
  fresh prod deploy).
- **GitHub backup:** `origin` → https://github.com/faresalhuss/Personal-Website.git
  (`main`). Authenticated locally via `gh` as `faresalhuss`. **Keep GitHub in sync
  after changes** — commit and push once a change is verified.
- **Newsletter:** Beehiiv, currently a **local stub** (writes
  `data/subscribers.json` in dev). Goes live automatically once `BEEHIIV_API_KEY`
  and `BEEHIIV_PUBLICATION_ID` are set in Vercel — no code change.

## 8. Definition of done (every change)

1. `pnpm lint` (run `pnpm lint:fix` for import-order drift) — clean.
2. `pnpm typecheck` — clean.
3. `pnpm build` — succeeds.
4. Deploy to prod (if it's a content/site change the owner wants live) and verify
   on the www host.
5. Commit + push to GitHub.
6. If the change is significant per the rule at the top, **ask** whether to update
   this handoff file.

## 9. Known quirks / gotchas

- **This is Next.js 16** — newer than most training data. When unsure about an
  API, read `node_modules/next/dist/docs/` (per `AGENTS.md`) instead of guessing.
- ESLint forbids **synchronous `setState` inside an effect** — `book-grid.tsx`
  relies on `IntersectionObserver` firing immediately for visible grids plus the
  global reduced-motion CSS, rather than a JS reduced-motion branch.
- Imports must stay **sorted** (`simple-import-sort`) or lint fails.
- Book covers occasionally come back wrong/low-res from auto-fetch; prefer
  owner-supplied covers and always normalize to ≤900px tall.

## 10. Backlog / not yet done

- Wire up Beehiiv (set env vars in Vercel) to take the newsletter live.
- Publish the first essay(s) and flip `showWritingNav` to `true`.
- Optional: swap the YouTube placeholder for a live `<LatestVideo />` once the
  channel exists (`YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID`).
- Optional: license **Zuume** and replace Anton.
