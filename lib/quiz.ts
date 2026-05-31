/**
 * ── QUIZ / MOMENTUM SCORE ───────────────────────────────────────────────
 * Data-driven config for the segmenting questionnaire.
 *
 * Flow: two gating questions (business? productivity?) route the visitor to a
 * track. Each track has detailed 4-option questions; each option carries
 * points. The total normalizes to a 0–100 "Momentum Score" (min option = 1pt,
 * so scores land in 25–100, never a demoralizing 0). The score maps to a tier
 * with tailored content. The track also drives Beehiiv segmentation.
 *
 * Edit questions/blurbs here; the wizard and result UI read this config.
 */

export const SCORE_NAME = "Momentum Score";

export type TrackKey = "founder" | "focus" | "operator" | "explorer";

export type QuizOption = {
  label: string;
  /** 1–4; higher = more momentum/maturity. */
  points: number;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type GatingOption = { label: string; yes: boolean };
export type GatingQuestion = {
  id: "business" | "productivity";
  prompt: string;
  options: GatingOption[];
};

export type Tier = {
  /** Inclusive lower bound of the 0–100 score for this tier. */
  min: number;
  name: string;
  blurb: string;
};

export type Recommendation = { label: string; href: string; note: string };

export type Track = {
  key: TrackKey;
  label: string;
  utmSource: string;
  /** One-line framing shown above the result. */
  lede: string;
  questions: Question[];
  tiers: Tier[];
  recommendations: Recommendation[];
};

export const MAX_POINTS = 4;

// ── Gating questions (shown to everyone, in this order) ───────────────────
export const gatingQuestions: GatingQuestion[] = [
  {
    id: "business",
    prompt: "Where are you with business right now?",
    options: [
      { label: "Not looking to start or run one", yes: false },
      { label: "I've got an idea or an itch, but haven't started", yes: true },
      { label: "I run a business (solo or small team)", yes: true },
      { label: "I run more than one — it's my main focus", yes: true },
    ],
  },
  {
    id: "productivity",
    prompt: "And how would you describe your productivity?",
    options: [
      { label: "Honestly, I'm already dialed in", yes: false },
      { label: "Decent, but inconsistent", yes: true },
      { label: "I struggle to focus and follow through", yes: true },
      { label: "It's the bottleneck holding me back", yes: true },
    ],
  },
];

export function routeTrack(business: boolean, productivity: boolean): TrackKey {
  if (business && productivity) return "operator";
  if (business) return "founder";
  if (productivity) return "focus";
  return "explorer";
}

const SHARED_TIERS = (
  t1: string,
  t2: string,
  t3: string,
  t4: string,
  b1: string,
  b2: string,
  b3: string,
  b4: string,
): Tier[] => [
  { min: 0, name: t1, blurb: b1 },
  { min: 50, name: t2, blurb: b2 },
  { min: 70, name: t3, blurb: b3 },
  { min: 87, name: t4, blurb: b4 },
];

const REC_READING_LIST: Recommendation = {
  label: "The free reading list",
  href: "/reading-list",
  note: "15 books that shaped how I build — start here.",
};
const REC_BUSINESS_BOOKS: Recommendation = {
  label: "My favorite business books",
  href: "/books#favorite-business-books",
  note: "The ones I've found most helpful building.",
};
const REC_PERSONAL_BOOKS: Recommendation = {
  label: "Books that changed how I work",
  href: "/books#favorite-personal-development-books",
  note: "Focus, habits, and getting more from your hours.",
};
const REC_ABOUT: Recommendation = {
  label: "My story",
  href: "/about",
  note: "How I got here and what I'm building.",
};

export const tracks: Record<TrackKey, Track> = {
  founder: {
    key: "founder",
    label: "Founder",
    utmSource: "quiz-founder",
    lede: "You're building. Here's where your momentum stands as a founder.",
    questions: [
      {
        id: "offer",
        prompt: "How clear is your offer — what you sell and why people buy?",
        options: [
          { label: "Still figuring out what I'm even selling", points: 1 },
          { label: "I have an offer, but it's fuzzy", points: 2 },
          { label: "It's clear and converts okay", points: 3 },
          { label: "Dialed in — people get it fast and buy", points: 4 },
        ],
      },
      {
        id: "leads",
        prompt: "Where do your customers come from?",
        options: [
          { label: "Mostly hope and word of mouth", points: 1 },
          { label: "A trickle, but unpredictable", points: 2 },
          { label: "A repeatable channel or two", points: 3 },
          { label: "A reliable system I can turn up", points: 4 },
        ],
      },
      {
        id: "money",
        prompt: "How healthy is your pricing and revenue?",
        options: [
          { label: "I undercharge and it shows", points: 1 },
          { label: "Breaking even, still figuring out pricing", points: 2 },
          { label: "Profitable, with room to optimize", points: 3 },
          { label: "Strong margins and a clear model", points: 4 },
        ],
      },
      {
        id: "systems",
        prompt: "How much of the business runs without you?",
        options: [
          { label: "Nothing — I'm the bottleneck", points: 1 },
          { label: "A few things, but mostly me", points: 2 },
          { label: "Core work is delegated or systemized", points: 3 },
          { label: "It largely runs without me day to day", points: 4 },
        ],
      },
      {
        id: "plan",
        prompt: "How clear is your next 12 months?",
        options: [
          { label: "Reacting day to day", points: 1 },
          { label: "A rough sense of direction", points: 2 },
          { label: "A plan I mostly follow", points: 3 },
          { label: "A sharp plan and I know my next moves", points: 4 },
        ],
      },
    ],
    tiers: SHARED_TIERS(
      "Laying the Foundation",
      "Finding Traction",
      "Gaining Momentum",
      "Scaling Up",
      "You're at the start, which is exactly where the leverage is. Nail your offer and one repeatable way to get customers before anything else.",
      "You've got signs of life. The work now is making the unpredictable repeatable — one channel, one clear offer, done consistently.",
      "You're building real momentum. Focus on systems and pricing so growth doesn't depend entirely on you.",
      "You're operating at a high level. The next gains come from leverage: systems, team, and sharper strategic bets.",
    ),
    recommendations: [REC_BUSINESS_BOOKS, REC_READING_LIST],
  },

  focus: {
    key: "focus",
    label: "Focus",
    utmSource: "quiz-focus",
    lede: "You want to do more of what matters. Here's where your momentum stands.",
    questions: [
      {
        id: "deep-time",
        prompt: "How protected is your deep-focus time?",
        options: [
          { label: "I rarely get uninterrupted time", points: 1 },
          { label: "I grab it when I can", points: 2 },
          { label: "I block some most days", points: 3 },
          { label: "It's sacred and scheduled", points: 4 },
        ],
      },
      {
        id: "priorities",
        prompt: "How do you decide what to work on?",
        options: [
          { label: "Whatever's loudest or most urgent", points: 1 },
          { label: "A to-do list I half-follow", points: 2 },
          { label: "Priorities I set each week", points: 3 },
          { label: "A clear system tied to my goals", points: 4 },
        ],
      },
      {
        id: "follow-through",
        prompt: "How's your follow-through on what matters?",
        options: [
          { label: "I start a lot and finish little", points: 1 },
          { label: "Inconsistent", points: 2 },
          { label: "Pretty reliable", points: 3 },
          { label: "I ship what I commit to", points: 4 },
        ],
      },
      {
        id: "energy",
        prompt: "How are your energy and attention through the day?",
        options: [
          { label: "Drained and scattered", points: 1 },
          { label: "Up and down", points: 2 },
          { label: "Mostly steady", points: 3 },
          { label: "Managed on purpose", points: 4 },
        ],
      },
      {
        id: "distraction",
        prompt: "How much do distractions run you?",
        options: [
          { label: "They run the show", points: 1 },
          { label: "More than I'd like", points: 2 },
          { label: "Mostly under control", points: 3 },
          { label: "I've designed them out", points: 4 },
        ],
      },
    ],
    tiers: SHARED_TIERS(
      "Reclaiming Control",
      "Building the Habit",
      "Finding Flow",
      "Deep Operator",
      "Right now the day runs you. The first win is protecting one block of focused time and guarding it ruthlessly.",
      "You're past the chaos. Make the good days repeatable with a simple weekly system you actually follow.",
      "You're getting real leverage from your attention. Tighten the edges — energy management and cutting the last distractions.",
      "You operate with serious focus. The frontier now is depth and intention, not just more output.",
    ),
    recommendations: [REC_PERSONAL_BOOKS, REC_READING_LIST],
  },

  operator: {
    key: "operator",
    label: "Operator",
    utmSource: "quiz-operator",
    lede: "You're building a business and sharpening how you work. Here's your momentum.",
    questions: [
      {
        id: "offer",
        prompt: "How clear is your offer — what you sell and why people buy?",
        options: [
          { label: "Still figuring out what I'm selling", points: 1 },
          { label: "I have an offer, but it's fuzzy", points: 2 },
          { label: "It's clear and converts okay", points: 3 },
          { label: "Dialed in — people get it and buy", points: 4 },
        ],
      },
      {
        id: "leads",
        prompt: "How reliably do new customers show up?",
        options: [
          { label: "Hope and word of mouth", points: 1 },
          { label: "A trickle, unpredictable", points: 2 },
          { label: "A repeatable channel or two", points: 3 },
          { label: "A system I can turn up", points: 4 },
        ],
      },
      {
        id: "deep-time",
        prompt: "How protected is your time for the work that moves things?",
        options: [
          { label: "I'm buried in reactive busywork", points: 1 },
          { label: "I grab focus time when I can", points: 2 },
          { label: "I block it most days", points: 3 },
          { label: "It's scheduled and protected", points: 4 },
        ],
      },
      {
        id: "systems",
        prompt: "How much runs without you in the loop?",
        options: [
          { label: "Nothing — I'm the bottleneck", points: 1 },
          { label: "A few things, mostly me", points: 2 },
          { label: "Core work is systemized", points: 3 },
          { label: "It mostly runs without me", points: 4 },
        ],
      },
      {
        id: "follow-through",
        prompt: "How well do your priorities turn into shipped work?",
        options: [
          { label: "I start a lot, finish little", points: 1 },
          { label: "Inconsistent", points: 2 },
          { label: "Pretty reliable", points: 3 },
          { label: "I ship what I commit to", points: 4 },
        ],
      },
    ],
    tiers: SHARED_TIERS(
      "Wearing Every Hat",
      "Getting Organized",
      "Hitting Your Stride",
      "In Command",
      "You're doing it all at once. Pick the single highest-leverage thing — usually offer clarity or one lead channel — and protect time for it.",
      "You're juggling well. Turn your best habits into systems so progress doesn't hinge on a good week.",
      "You're running a real operation. Sharpen delegation and focus so you work on the business, not just in it.",
      "You operate at a high level on both fronts. The next gains are strategic leverage and protecting your attention for the few things only you can do.",
    ),
    recommendations: [REC_BUSINESS_BOOKS, REC_PERSONAL_BOOKS, REC_READING_LIST],
  },

  explorer: {
    key: "explorer",
    label: "Explorer",
    utmSource: "quiz-explorer",
    lede: "Here's what you'll likely get the most out of following along.",
    questions: [
      {
        id: "pull",
        prompt: "What pulls you to follow someone building in real time?",
        options: [
          { label: "Curiosity — I just like seeing how it's done", points: 2 },
          { label: "Ideas I can borrow for my own stuff", points: 3 },
          { label: "Motivation and momentum", points: 3 },
          { label: "Honest, behind-the-scenes reality", points: 4 },
        ],
      },
      {
        id: "learn",
        prompt: "How do you like to learn?",
        options: [
          { label: "Stories and real examples", points: 3 },
          { label: "Frameworks and how-to", points: 3 },
          { label: "Books and deep dives", points: 4 },
          { label: "Short, punchy takeaways", points: 2 },
        ],
      },
      {
        id: "worth",
        prompt: "What would make this worth a spot in your inbox?",
        options: [
          { label: "I learn one useful thing each week", points: 3 },
          { label: "It's genuinely honest, not hype", points: 4 },
          { label: "It's short and respects my time", points: 3 },
          { label: "It introduces me to great books and ideas", points: 4 },
        ],
      },
    ],
    tiers: SHARED_TIERS(
      "Curious",
      "Tuned In",
      "All In",
      "Kindred Spirit",
      "Welcome in. The weekly note is the easiest way to follow along, and the reading list is a great first taste.",
      "You're here for the good stuff. The reading list and the weekly note will be right up your alley.",
      "You're clearly into this. Dig into the books and the story — and the weekly note will keep you in the loop.",
      "We'd get along. You value honesty and ideas, so the writing, the books, and the weekly note are all for you.",
    ),
    recommendations: [REC_READING_LIST, REC_ABOUT],
  },
};

/** Normalize raw points to a 0–100 score (min option = 1pt → floor ~25). */
export function computeScore(track: Track, points: number[]): number {
  const sum = points.reduce((a, b) => a + b, 0);
  const max = track.questions.length * MAX_POINTS;
  if (max === 0) return 0;
  return Math.round((sum / max) * 100);
}

export function tierForScore(track: Track, score: number): Tier {
  return track.tiers.reduce((best, t) => (score >= t.min ? t : best), track.tiers[0]);
}
