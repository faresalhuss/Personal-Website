/**
 * ── QUIZ / MOMENTUM SCORE ───────────────────────────────────────────────
 * Data-driven config for the segmenting questionnaire + tailored roadmaps.
 *
 * Flow: two gating questions (business? productivity?) route to a track. Each
 * track then asks scored "maturity" questions, plus profile questions (goal,
 * biggest hurdle, what they've tried) that tailor the result and feed Beehiiv
 * segmentation. Maturity answers normalize to a 0–10 Momentum Score (one
 * decimal) and a tier. The result assembles a multi-section guide from the
 * track's moves + the visitor's tier, goal, and hurdle.
 *
 * Voice for all copy: first person, plain language, "here's what I've found
 * works" (a builder learning alongside the reader). No em dashes, no guru tone.
 *
 * Edit freely; the wizard and result UI read this config.
 */

export const SCORE_NAME = "Momentum Score";

export type TrackKey = "founder" | "focus" | "operator" | "explorer";

export type QuizOption = {
  label: string;
  /** 1–4; higher = more momentum/maturity. */
  points: number;
};
/** Context passed to every showIf predicate: the chosen gating keys plus the
 * maturity answers so far (keyed by question id, value = chosen points). */
export type QuizCtx = {
  business: string;
  productivity: string;
  mat: Record<string, number>;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuizOption[];
  /** Only show this question when the predicate passes. Used to skip questions
   * that don't apply yet (e.g. asking about customers before there's an offer,
   * or anything operational before the business has launched). */
  showIf?: (ctx: QuizCtx) => boolean;
};

export type GatingOption = { label: string; yes: boolean; key: string };
export type GatingQuestion = {
  id: "business" | "productivity";
  prompt: string;
  options: GatingOption[];
};

export type ProfileOption = { key: string; label: string };
export type ProfileQuestion = {
  field: "goal" | "hurdle" | "tried";
  kind: "single" | "multi";
  prompt: string;
  options: ProfileOption[];
  /** Optional condition (e.g. show the pre-launch hurdle only for idea-stage). */
  showIf?: (ctx: QuizCtx) => boolean;
};

export type Tier = { min: number; name: string; blurb: string };
export type Recommendation = { label: string; href: string; note: string };

export type Move = { title: string; body: string; aside?: string };
export type Guide = {
  moves: Move[];
  /** hurdleKey -> targeted advice paragraph. */
  hurdleSections: Record<string, string>;
  /** hurdleKey -> a single concrete next action. */
  nextActions: Record<string, string>;
  /** Used when a track has no hurdle question (e.g. Explorer). */
  defaultNextAction?: string;
  /** goalKey -> one-line destination framing shown at the top. */
  goalFraming: Record<string, string>;
  pitfalls: string[];
};

export type Track = {
  key: TrackKey;
  label: string;
  utmSource: string;
  lede: string;
  questions: Question[]; // scored maturity questions
  profile: ProfileQuestion[]; // unscored, for tailoring + segmentation
  tiers: Tier[];
  recommendations: Recommendation[];
  guide: Guide;
};

export const MAX_POINTS = 4;

// ── Condition helpers (used by showIf predicates) ───────────────────────────
/** They run at least one business (vs pre-launch "idea" or "none"). */
export const isOperating = (ctx: QuizCtx) =>
  ctx.business === "running" || ctx.business === "multi";
/** Pre-launch: has an idea but hasn't started. */
export const isPreLaunch = (ctx: QuizCtx) => ctx.business === "idea";
/** Past "still figuring out what I'm selling" (offer answer >= 2). */
export const hasOffer = (ctx: QuizCtx) => (ctx.mat.offer ?? 0) >= 2;
/** Operational questions (customers, pricing, systems) only apply once the
 * business is running AND there's at least a rough offer. */
export const operatingWithOffer = (ctx: QuizCtx) =>
  isOperating(ctx) && hasOffer(ctx);

export const gatingQuestions: GatingQuestion[] = [
  {
    id: "business",
    prompt: "Where are you with business right now?",
    options: [
      { label: "Not looking to start or run one", yes: false, key: "none" },
      {
        label: "I've got an idea or an itch, but haven't started",
        yes: true,
        key: "idea",
      },
      {
        label: "I run a business (solo or small team)",
        yes: true,
        key: "running",
      },
      {
        label: "I run more than one, it's my main focus",
        yes: true,
        key: "multi",
      },
    ],
  },
  {
    id: "productivity",
    prompt: "And how would you describe your productivity?",
    options: [
      { label: "Honestly, I'm already dialed in", yes: false, key: "dialed" },
      { label: "Decent, but inconsistent", yes: true, key: "inconsistent" },
      {
        label: "I struggle to focus and follow through",
        yes: true,
        key: "struggling",
      },
      {
        label: "It's the bottleneck holding me back",
        yes: true,
        key: "bottleneck",
      },
    ],
  },
];

export function routeTrack(business: boolean, productivity: boolean): TrackKey {
  if (business && productivity) return "operator";
  if (business) return "founder";
  if (productivity) return "focus";
  return "explorer";
}

const tiers = (
  names: [string, string, string, string],
  blurbs: [string, string, string, string],
): Tier[] => [
  { min: 0, name: names[0], blurb: blurbs[0] },
  { min: 5, name: names[1], blurb: blurbs[1] },
  { min: 7, name: names[2], blurb: blurbs[2] },
  { min: 8.5, name: names[3], blurb: blurbs[3] },
];

const REC_READING_LIST: Recommendation = {
  label: "The free reading list",
  href: "/reading-list",
  note: "15 books that shaped how I build. A good first step.",
};
const REC_BUSINESS_BOOKS: Recommendation = {
  label: "My favorite business books",
  href: "/books#favorite-business-books",
  note: "Including $100M Offers for the offer formula above.",
};
const REC_PERSONAL_BOOKS: Recommendation = {
  label: "Books that changed how I work",
  href: "/books#favorite-personal-development-books",
  note: "Focus, habits, and sustaining your energy.",
};
const REC_ABOUT: Recommendation = {
  label: "My story",
  href: "/about",
  note: "How I got here and what I'm building.",
};
const REC_DELEGATION: Recommendation = {
  label: "Buying back your time (podcast)",
  href: "https://www.smartpassiveincome.com/podcasts/spi-743-buying-back-your-time-with-dan-martell/",
  note: "Dan Martell on delegation, via Smart Passive Income.",
};

const FOUNDER_ASIDE = `The most expensive lesson I've learned came from a lead I lost that could have changed my business. They were genuinely interested. I talked to them at least ten times, but I let weeks, sometimes months, go by between calls. Several times they'd forgotten who I even was, even though they still wanted what I was offering. The real reason I wasn't persistent was that I wasn't confident in what I was charging for, so I kept hesitating instead of pushing to close.

The opposite situation taught me the other half of it. A client once tried to walk back a price they'd already agreed to, saying the work wasn't worth it. I held firm and we got paid. The only reason I could do that is because I knew we'd actually delivered real value. That part matters more than the holding firm. There's a real difference between a client who genuinely feels let down or misled and one who's just trying to get out of paying what they agreed to. If someone feels scammed or betrayed, take it seriously and look hard at whether you delivered, because sometimes the right move is to make it right. But if you were upfront about the price, you delivered what you promised, and they're acting in bad faith, stand your ground. Holding firm when you didn't actually deliver only guarantees they never come back, and they shouldn't.

So get confident enough in your offer and your pricing that you can follow up without it feeling awkward, and stand behind your number when it counts.`;

const FOCUS_ASIDE = `My biggest struggle has never been motivation. It's the opposite. I get pulled into a flow state where I'm hyper-productive, and I let it wreck the habits I've spent months building. I tell myself I just need to finish this one thing, and then it's 5:30 in the morning. I still fight this. What helps most is an external commitment I can't talk my way out of. I've agreed to walk the dogs and watch an episode with my partner at night, and when that isn't an option I'll book an early workout with a friend so I either sleep on time or embarrass myself the next morning. Those commitments force me to accept that the work isn't going anywhere, and that if I keep my routine, tomorrow brings another good day of focus.

Here's the part that's easy to forget at 2 in the morning. Take two people over a year. One works a steady eight hours a day. The other works eighteen hours once or twice a week. The consistent one wins every time. They sleep better so they make sharper decisions, they train so they have more energy, and they stay healthier so they lose less time to burnout. It sounds obvious, but in the middle of a productive night it is shockingly easy to talk yourself out of your routine and call it hustle. Most of the time you're just setting yourself up to crash.`;

const OPERATOR_WEEK_ASIDE = `I get sidetracked by exciting new ideas constantly. A new angle pops into my head and it feels like business creativity, but a lot of the time it's just procrastination wearing a nicer outfit. What keeps me honest is deciding one clear goal for the week and putting it somewhere I can't miss it. I'm planning to stick mine on a whiteboard above my monitor, so every shiny new idea has to get past that goal before it gets my afternoon.`;

export const tracks: Record<TrackKey, Track> = {
  // ───────────────────────────── FOUNDER ─────────────────────────────────
  founder: {
    key: "founder",
    label: "Founder",
    utmSource: "quiz-founder",
    lede: "You're building. Here's where your momentum stands and what I'd focus on next.",
    questions: [
      {
        id: "offer",
        prompt: "How clear is your offer, what you sell and why people buy?",
        options: [
          { label: "Still figuring out what I'm even selling", points: 1 },
          { label: "I have an offer, but it's fuzzy", points: 2 },
          { label: "It's clear and converts okay", points: 3 },
          { label: "Dialed in, people get it fast and buy", points: 4 },
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
        showIf: operatingWithOffer,
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
        showIf: operatingWithOffer,
      },
      {
        id: "systems",
        prompt: "How much of the business runs without you?",
        options: [
          { label: "Nothing, I'm the bottleneck", points: 1 },
          { label: "A few things, but mostly me", points: 2 },
          { label: "Core work is delegated or systemized", points: 3 },
          { label: "It largely runs without me day to day", points: 4 },
        ],
        showIf: operatingWithOffer,
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
    profile: [
      {
        field: "goal",
        kind: "single",
        prompt: "What are you really after?",
        options: [
          { key: "income", label: "Replace and grow my income" },
          { key: "lifestyle", label: "A steady, profitable business" },
          { key: "scale", label: "Build something big and scale it" },
          { key: "freedom", label: "Freedom in time and location" },
        ],
      },
      {
        field: "hurdle",
        kind: "single",
        prompt: "What's the biggest thing in your way right now?",
        showIf: isOperating,
        options: [
          { key: "customers", label: "Not enough customers" },
          { key: "offer", label: "My offer isn't landing" },
          { key: "time", label: "Buried in the day to day, no time" },
          { key: "pricing", label: "Pricing and margins don't work" },
          { key: "focus", label: "Too many directions, no focus" },
        ],
      },
      {
        field: "hurdle",
        kind: "single",
        prompt: "What's holding you back from starting?",
        showIf: isPreLaunch,
        options: [
          { key: "start", label: "I haven't actually started" },
          { key: "offer", label: "My idea or offer isn't clear yet" },
          { key: "time", label: "I can't find the time to get going" },
          { key: "fear", label: "Fear, or not knowing the first step" },
          { key: "focus", label: "Too many ideas, I can't pick one" },
        ],
      },
      {
        field: "tried",
        kind: "multi",
        prompt: "What have you already tried? Pick any that apply.",
        showIf: isOperating,
        options: [
          { key: "content", label: "Organic content / posting" },
          { key: "ads", label: "Paid ads" },
          { key: "outreach", label: "Cold outreach / DMs" },
          { key: "referrals", label: "Referrals / word of mouth" },
          { key: "networking", label: "Networking / events" },
          { key: "none", label: "Nothing structured yet" },
        ],
      },
      {
        field: "tried",
        kind: "multi",
        prompt: "What have you done to get started so far? Pick any that apply.",
        showIf: isPreLaunch,
        options: [
          { key: "research", label: "Researched and planned it" },
          { key: "talked", label: "Talked to potential customers" },
          { key: "built", label: "Built something (a site, product, prototype)" },
          { key: "shared", label: "Shared it publicly or with people I know" },
          { key: "none", label: "Nothing yet" },
        ],
      },
    ],
    tiers: tiers(
      [
        "Laying the Foundation",
        "Finding Traction",
        "Gaining Momentum",
        "Scaling Up",
      ],
      [
        "You're at the start, which is exactly where the leverage is. Nail your offer and one repeatable way to get customers before anything else.",
        "You've got signs of life. The work now is making the unpredictable repeatable: one channel and one clear offer, done consistently.",
        "You're building real momentum. Focus on pricing and systems so growth doesn't depend entirely on you.",
        "You're operating at a high level. The next gains come from leverage: systems, team, and sharper strategic bets.",
      ],
    ),
    recommendations: [REC_BUSINESS_BOOKS, REC_READING_LIST],
    guide: {
      moves: [
        {
          title:
            "Build an offer that's hard to say no to, and prove you can deliver it",
          body: "Start with the offer, because a fuzzy one confuses the buyer and it confuses you too. Use Alex Hormozi's value equation from $100M Offers as your formula: Value = (Dream Outcome x Perceived Likelihood of Success) / (Time Delay x Effort and Sacrifice). To make it hard to refuse, raise the dream outcome and their belief it will actually work with specifics, proof, and a guarantee, then lower how long it takes and how much effort it costs them. After that, prove it. Get a handful of real results, even free or beta ones, before you try to scale. A clear promise backed by proof is the part a crowded market and cheap AI tools can't copy.",
        },
        {
          title: "Pick one way to get attention and go deep",
          body: "Most founders spread themselves across five platforms and do none of them well. Choose the single channel where your buyers already spend time, whether that's founder-led short-form video, warm outreach, or one content engine, and get real reps in. Stay with it long enough to read the signal before you judge it. Attention, not the offer, is where most people stall.",
        },
        {
          title:
            "Convert with confidence: follow up like it matters and stand behind your price",
          body: "Interest means nothing without follow-up and a clear ask for the sale. Be more persistent than feels comfortable, and price like you believe in the value, because hesitation is what quietly kills deals.",
          aside: FOUNDER_ASIDE,
        },
      ],
      hurdleSections: {
        customers:
          "Customers are your constraint, and the fix is almost always distribution, not a nicer logo or website. Pick one channel from Move 2 and commit to daily reps for 60 days before you decide whether it works.",
        offer:
          "If the offer isn't landing, run it back through the value equation. Usually the dream outcome is vague or they don't believe you can deliver it. Tighten the promise and add proof until it's obvious.",
        time: "If you're buried, you're spending hours on work that someone or something else could handle. Map your week, then cut, automate, or hand off the lowest-value third so you can protect time for offer and sales.",
        pricing:
          "Thin margins usually mean you're underpricing out of fear. Raise your price to a number that funds growth, and let your proof justify it. Test the new number on your next three leads.",
        focus:
          "Too many directions is a focus tax. Pick the one bet with the clearest path to revenue and give it 90 days of real attention. The other ideas will still be there.",
        start:
          "If you haven't started, that's the whole game right now. Pick the smallest version of your idea you can offer to one real person, and sell it before you build anything else. Starting teaches you more than planning ever will.",
        fear:
          "Fear and not knowing the first step are normal, and the cure is a tiny action, not more thinking. Shrink the next step until it feels almost too small to matter, do it today, and let momentum carry the rest.",
      },
      nextActions: {
        customers:
          "This week: choose one channel and do five straight days of reps. Track replies and conversations, not likes.",
        offer:
          "This week: rewrite your offer in one sentence using the value equation, then pitch it to five real prospects.",
        time: "This week: write out where your hours actually go, then cut or hand off the bottom third.",
        pricing:
          "This week: set your new price and quote it to the next lead without flinching.",
        focus:
          "This week: pick your one bet, write down what working looks like in 90 days, and pause the rest.",
        start:
          "This week: offer the simplest version of your idea to one real person and ask them to pay or commit.",
        fear:
          "Today: write down the single smallest next step, then do just that one thing.",
      },
      goalFraming: {
        income:
          "You're aiming to replace and grow your income, so every move below should point straight at revenue you can rely on.",
        lifestyle:
          "You want a steady, profitable business, so favor durable margins and repeatable demand over chasing fast growth.",
        scale:
          "You want to build something big, so build the offer and systems now that can carry that weight later.",
        freedom:
          "You're after freedom in time and place, so prioritize a model that doesn't depend on you being everywhere at once.",
      },
      pitfalls: [
        "Building in a vacuum, with no paying or beta customer to prove it",
        "Polishing the offer for weeks instead of selling it",
        "Chasing every channel at once and going shallow on all of them",
        "Underpricing because you're nervous, then resenting the work",
        "Scaling delivery before it can survive more volume",
      ],
    },
  },

  // ────────────────────────────── FOCUS ──────────────────────────────────
  focus: {
    key: "focus",
    label: "Focus",
    utmSource: "quiz-focus",
    lede: "You want to do more of what matters. Here's where your momentum stands and what I'd focus on next.",
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
    profile: [
      {
        field: "goal",
        kind: "single",
        prompt: "What are you really after?",
        options: [
          { key: "output", label: "Get more of the important work done" },
          { key: "calm", label: "Stop feeling behind and overwhelmed" },
          { key: "consistency", label: "Be consistent day to day" },
          { key: "space", label: "Free up time and headspace" },
        ],
      },
      {
        field: "hurdle",
        kind: "single",
        prompt: "What's the biggest thing in your way right now?",
        options: [
          { key: "notime", label: "I can't find focus time" },
          { key: "followthrough", label: "I start things but don't finish" },
          { key: "energy", label: "Low energy or burnout" },
          { key: "distraction", label: "Constant distraction" },
          { key: "system", label: "No system, I'm winging it" },
        ],
      },
      {
        field: "tried",
        kind: "multi",
        prompt: "What have you already tried? Pick any that apply.",
        options: [
          { key: "todo", label: "To-do apps" },
          { key: "timeblock", label: "Time-blocking / calendar" },
          { key: "habits", label: "Habit tracking" },
          { key: "books", label: "Productivity books or courses" },
          { key: "none", label: "Nothing structured yet" },
        ],
      },
    ],
    tiers: tiers(
      ["Reclaiming Control", "Building the Habit", "Finding Flow", "Deep Operator"],
      [
        "Right now the day runs you. The first win is protecting one block of focused time and guarding it.",
        "You're past the chaos. Make the good days repeatable with a simple weekly system you actually follow.",
        "You're getting real leverage from your attention. Tighten the edges: energy management and cutting the last distractions.",
        "You operate with serious focus. The frontier now is depth and intention, not just more output.",
      ],
    ),
    recommendations: [REC_PERSONAL_BOOKS, REC_READING_LIST],
    guide: {
      moves: [
        {
          title: "Build the engine first: sleep, food, and movement",
          body: "Focus is downstream of energy, and energy comes from the boring basics. Consistent sleep and wake times, training your body, and eating in a way that doesn't crash you mid-afternoon build the focus muscle, and none of it requires knowing your big goal yet. One thing that helps me is tying small daily rituals to fixed points in the day, a morning routine and a real wind-down at night, so they anchor everything else. The simplest lever is also the hardest, which is just going to bed on time.",
        },
        {
          title: "Protect a focus window, and aim it at one thing",
          body: "Once the engine runs, point it. Decide the single most important thing before you sit down, then guard a block for it. What works for me is a set window where I don't take meetings or check email. I check email once in the morning and not again until the afternoon, my phone sits face down and out of reach, and a focus mode only lets true emergencies through. The basics build the focus. This is where you aim it, because a hard-won hour spread across ten things makes you a master of none.",
        },
        {
          title: "Win on consistency, not intensity",
          body: "The person who works steadily beats the person who works in heroic bursts, every time, over a long enough season. Protecting that consistency is the whole game, and it is harder than it sounds.",
          aside: FOCUS_ASIDE,
        },
      ],
      hurdleSections: {
        notime:
          "If you can't find focus time, you don't need more hours, you need to defend one. Block it on the calendar before the day fills up, and treat it as non-negotiable.",
        followthrough:
          "If you start things and don't finish, you're probably carrying too much at once. Shrink your active commitments to one or two until finishing feels normal again.",
        energy:
          "If energy is the problem, this is your starting line, not a side quest. Hold consistent sleep and wake times for two weeks, and protect them even when you're in a productive groove. Torching your routine for one big night usually costs you the next three days.",
        distraction:
          "If distraction runs you, design it out instead of relying on willpower. Phone in another room, notifications off, one tab open. Make the distraction harder to reach than the work.",
        system:
          "If you're winging it, add the lightest possible structure: a short weekly review and a daily top three. That's enough to start, so don't over-build it.",
      },
      nextActions: {
        notime:
          "Tonight: block one 60-minute focus session on tomorrow's calendar and decide where your phone will be during it.",
        followthrough:
          "This week: cut your active priorities down to two and finish those before adding anything new.",
        energy:
          "Tonight: set a consistent sleep and wake time, and add one external commitment (an early workout, a standing plan with someone) that forces you to stop working.",
        distraction:
          "Right now: turn off non-essential notifications and pick where your phone lives during deep work.",
        system:
          "This week: do a 15-minute weekly review and write a daily top three each morning.",
      },
      goalFraming: {
        output:
          "You want to get more of the important work done, so the moves below are about depth, not staying busy.",
        calm: "You want to stop feeling behind, so the aim is fewer things done well, not more things attempted.",
        consistency:
          "You want to be consistent, so favor small habits you can keep over big bursts you can't.",
        space:
          "You want to free up time and headspace, so protecting energy and cutting inputs matter as much as any tactic.",
      },
      pitfalls: [
        "Letting a productive flow state wreck your sleep and routine, then paying for it all week",
        "Chasing productivity hacks while ignoring sleep and energy",
        "Building an elaborate system you abandon within a week",
        "Spreading hard-won focus across ten things and finishing none",
        "Trying to fix focus with willpower instead of removing the distraction",
      ],
    },
  },

  // ───────────────────────────── OPERATOR ────────────────────────────────
  operator: {
    key: "operator",
    label: "Operator",
    utmSource: "quiz-operator",
    lede: "You're building a business and sharpening how you work. Here's your momentum and what I'd focus on next.",
    questions: [
      {
        id: "offer",
        prompt: "How clear is your offer, what you sell and why people buy?",
        options: [
          { label: "Still figuring out what I'm selling", points: 1 },
          { label: "I have an offer, but it's fuzzy", points: 2 },
          { label: "It's clear and converts okay", points: 3 },
          { label: "Dialed in, people get it and buy", points: 4 },
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
        showIf: operatingWithOffer,
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
          { label: "Nothing, I'm the bottleneck", points: 1 },
          { label: "A few things, mostly me", points: 2 },
          { label: "Core work is systemized", points: 3 },
          { label: "It mostly runs without me", points: 4 },
        ],
        showIf: operatingWithOffer,
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
    profile: [
      {
        field: "goal",
        kind: "single",
        prompt: "What are you really after?",
        options: [
          { key: "grow", label: "Grow without burning out" },
          { key: "systemize", label: "Systemize so it runs without me" },
          { key: "scale", label: "Scale it up" },
          { key: "time", label: "Reclaim my time" },
        ],
      },
      {
        field: "hurdle",
        kind: "single",
        prompt: "What's the biggest thing in your way right now?",
        showIf: isOperating,
        options: [
          { key: "bottleneck", label: "I'm the bottleneck" },
          { key: "customers", label: "Not enough customers" },
          { key: "deeptime", label: "No time for deep work" },
          { key: "execution", label: "Inconsistent execution" },
          { key: "pricing", label: "Pricing and margins" },
        ],
      },
      {
        field: "hurdle",
        kind: "single",
        prompt: "What's holding you back from starting?",
        showIf: isPreLaunch,
        options: [
          { key: "start", label: "I haven't actually started" },
          { key: "offer", label: "My idea or offer isn't clear yet" },
          { key: "deeptime", label: "No time to actually work on it" },
          { key: "execution", label: "I start things but don't finish" },
          { key: "focus", label: "Too many directions, can't pick one" },
        ],
      },
      {
        field: "tried",
        kind: "multi",
        prompt: "What have you already tried? Pick any that apply.",
        showIf: isOperating,
        options: [
          { key: "delegate", label: "Hiring / delegating" },
          { key: "marketing", label: "Marketing / content" },
          { key: "systems", label: "Systems / SOPs" },
          { key: "productivity", label: "Productivity methods" },
          { key: "none", label: "Nothing structured yet" },
        ],
      },
      {
        field: "tried",
        kind: "multi",
        prompt: "What have you done to get started so far? Pick any that apply.",
        showIf: isPreLaunch,
        options: [
          { key: "research", label: "Researched and planned it" },
          { key: "talked", label: "Talked to potential customers" },
          { key: "built", label: "Built something (a site, product, prototype)" },
          { key: "shared", label: "Shared it publicly or with people I know" },
          { key: "none", label: "Nothing yet" },
        ],
      },
    ],
    tiers: tiers(
      ["Wearing Every Hat", "Getting Organized", "Hitting Your Stride", "In Command"],
      [
        "You're doing it all at once. Pick the single highest-leverage thing, usually offer clarity or one lead channel, and protect time for it.",
        "You're juggling well. Turn your best habits into systems so progress doesn't hinge on a good week.",
        "You're running a real operation. Sharpen delegation and focus so you work on the business, not just in it.",
        "You operate at a high level on both fronts. The next gains are strategic leverage and protecting your attention for the few things only you can do.",
      ],
    ),
    recommendations: [
      REC_BUSINESS_BOOKS,
      REC_PERSONAL_BOOKS,
      REC_DELEGATION,
      REC_READING_LIST,
    ],
    guide: {
      moves: [
        {
          title: "Sharpen your offer and how you convert",
          body: "Run your core offer through Alex Hormozi's value equation from $100M Offers: raise the dream outcome and the belief it works, and lower the time and effort it takes the buyer. Then make sure you actually convert the interest you earn. Follow up consistently and price with conviction, because a great offer still dies from weak follow-through.",
          aside:
            "I've lost a deal that could have changed my business by not following up enough and not standing behind my price. I take this part seriously now. Conviction in your offer and your number is what turns interest into revenue.",
        },
        {
          title: "Define a winning week, then protect time for it",
          body: "As an operator your scarcest resource is attention, and the danger usually isn't laziness, it's drift. Every Sunday I decide what would actually make the week a win for the business, and I check that it lines up with my bigger goals. Then during the week, when a new idea shows up, I hold it against that goal and ask whether it moves me closer or just feels productive. Block deep-work time for the few things that move the week, and protect that block like a client meeting.",
          aside: OPERATOR_WEEK_ASIDE,
        },
        {
          title: "Get leverage: AI now, delegation as you grow",
          body: "Leverage is how operators escape the bottleneck, and it comes in stages. If you don't have a team yet, your fastest leverage is AI. Use it to expand your own output on research, first drafts, admin, and customer replies, so you get more done without more hours. As you grow and can afford help, shift to delegation. The clearest framing I've found is Dan Martell's Buy Back Your Time: work out your buyback rate, which is roughly a quarter of your effective hourly rate, then offload the tasks worth less than that first, starting with the low-value admin that drains you and climbing from there. Record yourself doing a task once, turn it into a simple checklist, and hand it off. Don't systemize something that isn't working yet, and don't wait so long to delegate that you become the ceiling on your own business.",
        },
      ],
      hurdleSections: {
        bottleneck:
          "If you're the bottleneck, the answer is leverage, not more hours. With no team yet, lean on AI to expand your own output. When you can afford help, use your buyback rate to decide what to offload first, starting with the low-value admin that drains you, and hand it off with a simple checklist.",
        customers:
          "If customers are short, treat distribution as a system, not a hope. Commit to one channel and make it a repeatable weekly cadence.",
        deeptime:
          "If you can't protect deep-work time, you'll stay reactive. Block it before the day fills and route interruptions somewhere else.",
        execution:
          "If execution is inconsistent, you're leaning on memory and motivation. Put the recurring work into simple systems so it happens without you deciding each time.",
        pricing:
          "If margins are thin, raise prices to a number that funds growth and back it with the value you deliver.",
        start:
          "If you haven't started, stop refining and ship the smallest version. Offer it to one real person this week and let their response, not your planning, tell you what to fix.",
        offer:
          "If your offer isn't clear yet, that's the first domino. Sharpen it with the value equation in Move 1 before you worry about systems, time, or customers.",
        focus:
          "Too many directions will stall you before you start. Pick the one bet with the clearest path to revenue and give it your protected time for 90 days.",
      },
      nextActions: {
        bottleneck:
          "This week: list every task you did, mark the low-value ones that drain you, and offload the top one, either to an AI tool or a first hire.",
        customers:
          "This week: commit to one channel and set a repeatable weekly cadence for it.",
        deeptime:
          "Tomorrow: block one deep-work session and route interruptions elsewhere.",
        execution:
          "This week: turn your most-repeated task into a simple checklist you follow every time.",
        pricing:
          "This week: set a new price that funds growth and quote it to the next lead.",
        start:
          "This week: offer the simplest version of your idea to one real person and ask for a commitment.",
        offer:
          "This week: write your offer in one sentence using the value equation, then test it on five people.",
        focus:
          "This week: pick your one bet, define what winning looks like in 90 days, and pause the rest.",
      },
      goalFraming: {
        grow: "You want to grow without burning out, so leverage and systems matter as much as effort.",
        systemize:
          "You want it to run without you, so every move should reduce how much depends on you personally.",
        scale:
          "You want to scale, so build the offer, the time, and the systems that can carry more weight.",
        time: "You want your time back, so protecting attention and offloading work are the priorities.",
      },
      pitfalls: [
        "Becoming the ceiling on your own business by refusing to let go",
        "Chasing shiny new ideas that are really procrastination in disguise",
        "A great offer with weak follow-up, losing deals you already earned",
        "Systemizing or delegating something before it actually works",
        "Underpricing while carrying all the risk",
      ],
    },
  },

  // ───────────────────────────── EXPLORER ────────────────────────────────
  explorer: {
    key: "explorer",
    label: "Explorer",
    utmSource: "quiz-explorer",
    lede: "Here's what you'll likely get the most out of, and the easiest way to start.",
    questions: [
      {
        id: "pull",
        prompt: "What pulls you to follow someone building in real time?",
        options: [
          { label: "Curiosity, I like seeing how it's done", points: 2 },
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
          { label: "It points me to great books and ideas", points: 4 },
        ],
      },
    ],
    profile: [
      {
        field: "goal",
        kind: "single",
        prompt: "What would make following along worth it for you?",
        options: [
          { key: "learn", label: "Learning how it's actually done" },
          { key: "inspired", label: "Motivation and momentum" },
          { key: "ideas", label: "Good ideas and book recommendations" },
          { key: "community", label: "Just following the journey" },
        ],
      },
    ],
    tiers: tiers(
      ["Curious", "Tuned In", "All In", "Kindred Spirit"],
      [
        "Welcome in. The weekly note is the easiest way to follow along, and the reading list is a great first taste.",
        "You're here for the good stuff. The reading list and the weekly note will be right up your alley.",
        "You're clearly into this. Dig into the books and the story, and the weekly note will keep you in the loop.",
        "We'd get along. You value honesty and ideas, so the writing, the books, and the weekly note are all for you.",
      ],
    ),
    recommendations: [REC_READING_LIST, REC_ABOUT],
    guide: {
      moves: [
        {
          title: "Start with the reading list",
          body: "If you only do one thing, grab the free reading list. It's the fastest way to see how I think and to pick up a few ideas you can use right away.",
        },
        {
          title: "Follow along where it's easy",
          body: "Subscribe to the weekly note for one honest email a week, and read the story if you want the fuller picture. No pressure to do anything with it. Take what's useful and leave the rest.",
        },
      ],
      hurdleSections: {},
      nextActions: {},
      defaultNextAction:
        "This week: download the reading list and start the first book that catches your eye.",
      goalFraming: {
        learn:
          "You're here to learn, so the books and the weekly note are the best places to start.",
        inspired:
          "You're here for momentum, so the story and the weekly note will keep you going.",
        ideas:
          "You're here for ideas and good books, so the reading list is made for you.",
        community:
          "You're here to follow along, so the weekly note is the easiest way to stay in the loop.",
      },
      pitfalls: [],
    },
  },
};

/** Normalize the answered (shown) maturity questions to a 0–10 score with one
 * decimal. Only counts the questions actually asked, so skipped questions don't
 * drag the score. Min option = 1pt, so scores land ~2.5–10.0, never 0. */
export function computeScore(points: number[]): number {
  if (points.length === 0) return 0;
  const sum = points.reduce((a, b) => a + b, 0);
  const max = points.length * MAX_POINTS;
  return Math.round((sum / max) * 100) / 10;
}

export function tierForScore(track: Track, score: number): Tier {
  return track.tiers.reduce(
    (best, t) => (score >= t.min ? t : best),
    track.tiers[0],
  );
}

export function profileLabel(
  track: Track,
  field: "goal" | "hurdle" | "tried",
  key: string,
): string {
  // Search every question of that field (a field can have stage-specific
  // variants, e.g. operating vs pre-launch hurdle/tried) for the option key.
  for (const p of track.profile) {
    if (p.field !== field) continue;
    const opt = p.options.find((o) => o.key === key);
    if (opt) return opt.label;
  }
  return key;
}
