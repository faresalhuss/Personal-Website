# AI Handoff — fareshusseini.com

**Purpose:** a single self-contained context file. If you hand another Claude Code
session this document plus git access, it should be able to pick up exactly where
the last one left off — without re-deriving the project's history, conventions, or
the owner's preferences.

**Last updated:** 2026-05-31
**Maintenance rule:** updated deliberately, not after every prompt. When a change is
significant enough to matter here (new feature/route, changed design direction, new
convention, deploy/infra change, a preference learned), **ask the owner whether to
update this file**. Remove or replace anything no longer true rather than letting it
accumulate.

---

## 1. What this is

The personal website for **Fa'res Husseini** at **https://www.fareshusseini.com**.
A personal home — not a portfolio, not a sales funnel. Priorities, in order:

1. Tell visitors who Fa'res is.
2. Get them onto the weekly newsletter ("The Weekly Note").
3. Show what he's currently working on.

## 2. Who the owner is (context that shapes copy)

- **Fa'res Husseini**, based in Atlanta, Georgia.
- Runs **Clicks & Clients** (marketing firm, mostly small law firms; started
  Aug 2025) and co-founded **Animedic** (pet-health app / vet practice tool;
  Mar 2026). Also associated with **OneWahed**.
- Plans to start **law school in 2027**; wants to build something that works first.
- Podcast **"Wondering Out Loud"** planned for summer 2026.
- Bio arc (About page): YouTube/gaming as a kid → moved to the U.S. at 14 (from
  Saudi Arabia) → finished high school → economics degree (SDSU) → building now.
  Mother started businesses before he was born. Keep the bio **interwoven as a
  story, not a timeline**.

## 3. Voice & house style (do not violate)

- **Warm, first-person, learner's voice.** Frame advice as "here's what I've found
  works," a builder learning alongside the reader, never a guru.
- He is **not a guru**, but he may run courses or an education platform later, so
  don't write "no courses." The accepted phrasing is **"no guru act."**
- **No em dashes anywhere in the copy** (he flagged them as an AI tell), and watch
  for other AI-tells / filler. Keep meta descriptions ~150–160 chars. (Exception:
  the OG/`<title>` template uses " — Fa'res Husseini" site-wide for consistency.)
- **De-emphasize Atlanta** — in config/JSON-LD, not featured in copy.
- **No newsletter capture in the hero.**
- Eyebrow/tagline: "entrepreneur, creator, and writer."
- Never reproduce book copyrighted text — only titles, authors, covers.
- The newsletter's proper name is **"The Weekly Note"** (title case).

## 4. Design direction (FINAL, accepted)

- A **bold, high-contrast dark theme** with an acid-lime accent — editorial, punchy.
- Black canvas (`#000`), acid-lime accent (`#DBFF00`), occasional white "break"
  panels. Condensed display type = **Anton** (placeholder for the licensed **Zuume**;
  swap later if licensed). Body = Geist; mono = Geist Mono.
- Restrained, fluid motion; **always honor `prefers-reduced-motion`**.
- All colors/spacing come from `@theme` tokens in `app/globals.css`. Never hard-code
  hex in components. (`--color-ink-faint` is `#8c8c8c` — tuned for WCAG AA on black.)

> History note: the first build used a sage-on-paper palette with Fraunces; it was
> fully scrapped for the dark+lime direction. Any "sage"/"Fraunces" reference is stale.
> The design is *inspired by* a bold editorial style; do not name or reference any
> other person's website in the code or copy.

## 5. Tech stack

Next.js 16 (App Router, RSC, Turbopack) · TypeScript · Tailwind CSS 4 (`@theme`
tokens) · **Motion** (`motion/react`, used ONLY by the homepage timeline, and it's
code-split via `next/dynamic` so it stays off the critical path) · next/font (Anton +
Geist + Geist Mono) · MDX (`next-mdx-remote/rsc` + remark-gfm, rehype-slug,
rehype-autolink-headings, shiki) · next/og (OG images, favicon, apple-icon) · Vercel
Analytics + Speed Insights (**gated behind cookie consent**) · **pnpm** · ESLint
(sorted imports) + Prettier · Zod.

Also in-repo (not shipped to the browser): **Python** asset generators using
`reportlab` + `Pillow` (+ `pymupdf` for ad-hoc previews), and fonts in `assets/fonts/`
(Anton, Sacramento) used only by those scripts.

See [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) for architecture/conventions and
[`BRAND_GROWTH_STRATEGY.md`](BRAND_GROWTH_STRATEGY.md) for the growth/positioning plan.
Key config/data: `lib/site.ts`, `lib/books.ts`, `lib/quiz.ts`,
`lib/structured-data.ts`, `lib/consent.ts`, `lib/lead-magnet.ts`, `lib/subscribe.ts`.

## 6. Current state of the site (routes & features)

- **Homepage** (`app/(home)/`): hero (giant wordmark + a **scroll cue** that fades
  out on scroll and back in at the top, `_components/scroll-cue.tsx`), intro,
  ventures, a **quiz CTA** band, scroll-driven **timeline** (lime fill climbs the
  rail; lazy-loaded), writing teaser, "weekly note" feature, newsletter section.
- **/about**: long-form bio as a `string[]` in `app/about/page.tsx`.
- **/books**: curated lists + Amazon affiliate links; single source of truth
  `lib/books.ts`. Cover marquee, stats row, FTC disclosure, currently-reading,
  favorites-by-theme, full reading history, Kobo (Kobo Libra Colour) affiliate
  mention, and a CTA to the reading-list lead magnet.
  - Counter = `readingHistory.length` (no double-counting). **42** finished books.
  - Covers self-hosted at `public/books/{key}.jpg`, normalized to ≤900px tall.
  - Amazon Associates tag **`fareshussein-20`**; affiliate links use
    `rel="sponsored noopener noreferrer"` + `target="_blank"`.
- **/reading-list** — lead-magnet landing page. Email → free PDF
  ("The 15 Books That Shaped How I Build"). Flow: form → server action
  `app/reading-list/actions.ts` → `subscribeEmail(email, {source:"reading-list"})`
  (Beehiiv, tagged) → sets a short-lived **HMAC-signed grant cookie**
  (`lib/lead-magnet.ts`, secret `DOWNLOAD_SIGNING_SECRET`) → success state reveals a
  download button → **`/api/reading-list/download`** verifies the grant and streams
  the PDF. The PDF lives **outside `/public`** at `assets/lead-magnets/reading-list.pdf`
  and is bundled into the route via `outputFileTracingIncludes` in `next.config.ts`,
  so it can't be hotlinked. Regenerate the PDF with
  `python3 scripts/build_reading_list_pdf.py`.
- **/quiz** — segmenting questionnaire that produces a **Momentum Score (0–10, one
  decimal)** and a tailored multi-section roadmap. Two gating questions route to a
  track (**Founder / Focus / Operator / Explorer**); each track asks scored maturity
  questions plus profile questions (goal, biggest hurdle, what they've tried, the
  last one multi-select). Result assembles from track + tier + goal + hurdle: a
  roadmap of moves in Fa'res's voice (Founder/Operator anchor on a clear offer via
  Hormozi's value equation + provable delivery + converting with confidence, with
  Fa'res's real win/flop aside; Focus anchors on energy/sleep + consistency with his
  flow-state aside; Operator's leverage move uses AI-first-then-delegation grounded
  in Dan Martell's Buy Back Your Time), plus a hurdle section, one next move,
  pitfalls, and resource cards. Contact gate (first name + email required, **phone
  optional**) unlocks the result and subscribes via Beehiiv. All content + scoring in
  `lib/quiz.ts`; wizard `app/quiz/_components/quiz.tsx`; action `app/quiz/actions.ts`;
  homepage CTA `app/(home)/_components/quiz-cta.tsx`. Founder track copy is owner-
  approved; Focus/Operator/Explorer were drafted from his stated anchors.
  - **Conditional flow (no irrelevant questions).** Gating options carry a `key`
    (business: `none`/`idea`/`running`/`multi`; productivity: `dialed`/
    `inconsistent`/`struggling`/`bottleneck`). Every question may declare a
    `showIf(ctx)` predicate, where `ctx = { business, productivity, mat }` (mat =
    maturity answers by question id). Helpers in `lib/quiz.ts`: `isOperating`,
    `isPreLaunch`, `hasOffer`, `operatingWithOffer`. Operational maturity questions
    (customers, pricing, runs-without-you) use `operatingWithOffer`, so pre-launch
    (idea) and pre-offer people skip them; work-habit questions always show. The
    **hurdle** and **"what you've tried"** questions each have an *operating* variant
    (`showIf: isOperating`) and a *pre-launch* variant (`showIf: isPreLaunch`) on the
    same `field`; only one shows. The wizard walks `trackItems` dynamically, skipping
    non-applicable items (forward and back), and the score counts only applicable +
    answered maturity questions (robust to back-edits). Focus/Explorer have no
    conditions (every question is stage-independent). To add a new condition, give a
    question a `showIf`; `profileLabel` searches all questions of a field so
    variant-specific option keys still map to Beehiiv labels.
- **/welcome** — post-confirmation page (Beehiiv opt-in redirect URL). `noindex`.
  Confirms the subscription, sets expectations, links to story / reading-list / books
  and the socials.
- **/terms** and **/privacy** — comprehensive legal pages (Georgia governing law,
  arbitration + class-action waiver, AS-IS + no-professional-advice disclaimers,
  indemnification; privacy covers Beehiiv/Vercel/Amazon, GDPR + CCPA/CPRA, cookies,
  COPPA, and a clause noting Fa'res does not sell data but cannot guarantee
  third-party providers' practices). **⚠️ Still need a licensed attorney's review.**
- **/writing**: MDX pipeline + `[slug]` reader exist, but **no essays published yet**
  and the nav link is hidden (`showWritingNav: false`). One `_example.mdx` template.
- **Cookie consent**: `lib/consent.ts` (dependency-free store via
  `useSyncExternalStore`; persists to localStorage + a `fh_consent` cookie; 180-day,
  versioned) + `components/cookie-consent.tsx` (Accept / Reject / Preferences banner,
  micro-animation) + `components/consent-scripts.tsx` (renders Vercel Analytics +
  Speed Insights ONLY after analytics consent) + `components/cookie-settings-button.tsx`
  (footer reopen via the `fh:consent-open` window event). Necessary cookies always on;
  the `rl_grant` functional download cookie is exempt from consent.
- **Footer** (`components/site-footer.tsx`): socials (TikTok, Instagram, **X** — all
  `@fareshusseini`), legal links (Privacy, Terms), a **Cookie settings** trigger, the
  `© {year}` line, and the "Website by Clicks & Clients" credit.
- **SEO/AIO**: consolidated JSON-LD via `homeGraphSchema()` (Person + WebSite graph,
  `sameAs` incl. X) plus per-page schema; title template + OpenGraph + Twitter card
  (`@fareshusseini`); `robots.ts` explicitly **allows AI crawlers** (GPTBot,
  OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot);
  `sitemap.ts` includes /terms + /privacy + /reading-list (excludes noindex /welcome);
  rich `llms.txt`; `manifest.ts`; generated favicon/apple-icon. Canonical host = **www**.
- **Accessibility**: skip link, `lang`, landmarks, `:focus-visible` rings, ARIA on the
  mobile menu (`inert` when closed, Esc + focus return) and cookie banner, form live
  regions, image alts, AA contrast, reduced-motion.

## 7. Infrastructure & deploy

- **Hosting:** Vercel. Project `prj_OIFu5dRtfPTVA9nxAGg0onjaDzFl`, team scope
  **`onewahedllc`**. Linked via `.vercel/` (gitignored).
- **Deploy:** `pnpm build` then `pnpm dlx vercel deploy --prod --yes --scope onewahedllc`.
  Then verify on `https://www.fareshusseini.com` (the www alias can briefly lag).
- **GitHub:** `origin` → https://github.com/faresalhuss/Personal-Website.git (`main`),
  authenticated via `gh` as `faresalhuss`. Commit author on this machine is
  "Fares Husseini <admin@animedic.app>". Keep GitHub in sync after verified changes.
- **Newsletter — LIVE on Beehiiv** (free Launch plan, "The Weekly Note"):
  - `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` are set in Vercel (Production). With
    no keys the code falls back to a local dev stub.
  - **Double opt-in + Smart Nudge are ON** → fake/unconfirmed emails stay "pending"
    and never consume the 2,500 free active-subscriber slots.
  - Signups are tagged via `utm_source`: `reading-list` (lead magnet), or
    `quiz-founder` / `quiz-focus` / `quiz-operator` / `quiz-explorer` (quiz), else
    `fareshusseini.com`. Opt-in **redirect URL → /welcome**.
  - The quiz also sends Beehiiv **custom fields**: First Name, Phone Number,
    Momentum Score, Quiz Track, Quiz Tier, Quiz Goal, Quiz Hurdle, Quiz Tried.
    These must be created in Beehiiv (Settings → Custom Fields) for the data to
    stick; unknown fields are ignored, so signups never break. `subscribeEmail` in
    `lib/subscribe.ts` accepts a `customFields` map.
  - **Welcome-email automation is intentionally deferred** (it requires a paid tier);
    fold a welcome into issue #1 or send a manual broadcast. Turn on Beehiiv
    **Recommendations** for free subscriber growth.

## 8. Environment variables

| Variable | Set in Vercel? | Purpose |
|---|---|---|
| `BEEHIIV_API_KEY` | ✅ Production | Live newsletter (v2 API). |
| `BEEHIIV_PUBLICATION_ID` | ✅ Production | Beehiiv publication (v2 id). |
| `DOWNLOAD_SIGNING_SECRET` | ✅ Production | HMAC secret for the reading-list download grant. Dev falls back to an insecure constant. Generate with `openssl rand -base64 32`. |
| `YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID` | ❌ (unused yet) | For a future `<LatestVideo />`. |

`.env*` is gitignored; never commit real values. See `.env.example`.

## 9. Definition of done (every change)

1. `pnpm lint` (run `pnpm lint:fix` for import-order drift) — clean.
2. `pnpm typecheck` — clean.
3. `pnpm build` — succeeds.
4. Deploy to prod (for site/content changes the owner wants live) and **verify on the
   live www URL** (not just the CLI exit — see gotchas).
5. Commit + push to GitHub.
6. If significant, **ask** before updating this handoff file.

## 10. Known quirks / gotchas

- **Next.js 16** — newer than most training data. When unsure about an API, read
  `node_modules/next/dist/docs/` (per `AGENTS.md`) instead of guessing.
- **JSX whitespace bug:** text that wraps to a new line *after* an inline `<a>`,
  `<Link>`, or `<strong>` loses its leading space (rendered "comand", "give me.When").
  Use an explicit `{" "}`. This bit the legal pages; they're fixed.
- **Vercel CLI `read ETIMEDOUT`:** `vercel deploy` sometimes errors while *polling*
  deployment status, but the build still completes server-side. Don't trust the CLI
  exit — verify against the live URL.
- **Claude Preview harness is flaky:** `window.scrollTo`/`scrollY` don't move in its
  eval sandbox (innerHeight quirks), so scroll-linked behavior (e.g. the hero scroll
  cue) can't be simulated there. In-page navigation (`location.assign`/`href`)
  sometimes doesn't take on the first try, and long `preview_eval` walk-throughs can
  time out. Workarounds: verify the path with `location.pathname` before driving, and
  for multi-step UI (like the quiz) script `preview_eval` click-throughs that read
  the rendered state rather than relying on screenshots.
- ESLint forbids **synchronous `setState` in an effect**. Patterns used to avoid it:
  `book-grid.tsx` relies on IntersectionObserver + global reduced-motion CSS;
  `lib/consent.ts` uses `useSyncExternalStore` (also avoids hydration mismatch).
- Imports must stay **sorted** (`simple-import-sort`) or lint fails.
- Book covers from auto-fetch can be wrong/low-res; prefer owner-supplied covers and
  normalize to ≤900px tall.

## 11. Backlog / not yet done

- **⚖️ Have a lawyer review `/terms` and `/privacy`.**
- **Create the quiz Beehiiv custom fields** (First Name, Phone Number, Momentum
  Score, Quiz Track, Quiz Tier, Quiz Goal, Quiz Hurdle, Quiz Tried) so quiz data is
  captured. Segmentation by `utm_source` works without this.
- Have the owner review the **Focus / Operator / Explorer** roadmap wording in
  `lib/quiz.ts` (Founder is approved). Get a personal win/flop for the Focus aside
  is done; Operator delegation is researched (Dan Martell), not personal experience.
- Later: feed segment-relevant content to subscribers based on quiz track/score.
- Publish the first essay(s) and flip `showWritingNav` to `true` in `lib/site.ts`.
- Confirm Beehiiv **Recommendations** is enabled (free subscriber growth).
- When the list grows, reconsider a paid Beehiiv tier for automated welcome emails.
- Optional: add a live `<LatestVideo />` once the YouTube channel exists.
- Optional: license **Zuume** and replace Anton.

## 12. Generators & brand assets (in-repo, not shipped)

- `scripts/build_reading_list_pdf.py` — regenerates the lead-magnet PDF
  (`assets/lead-magnets/reading-list.pdf`). Dark/lime, Anton + Sacramento, 15 books,
  affiliate-linked. Edit the book list / blurbs there, then re-run.
- `scripts/build_beehiiv_assets.py` — generates Beehiiv publication logo + thumbnail
  variants into `assets/brand/beehiiv/` (FH monogram, dark/lime). Recommended picks:
  `logo-3-lime-rounded` (publication logo) and `thumb-1-dark` (default thumbnail).
- `scripts/fetch-covers*.mjs` — one-off book-cover downloaders.
- Python deps installed via `python3 -m pip install --user reportlab pillow pymupdf`.
