/**
 * Prototype fixture data — powers the clickable prototype (/preview and the
 * public catalog pages) with realistic sample content drawn from content/*.
 * Replaced by Prisma queries as each surface graduates from prototype to wired.
 */

export const programs = [
  {
    slug: "foundations",
    number: "01",
    name: "Foundations",
    promise: "Eight weeks to a voice that's on your side.",
    meta: { weeks: 8, minutesPerDay: 15, cohort: 40, nextCohort: "September 8" },
    price: 490,
    whoFor: [
      "You're functional — maybe impressively so — and privately exhausted by your own narrator.",
      "You want a complete system, built once, properly.",
      "You can hold 15 minutes a day, most days.",
    ],
    whoNotFor: [
      "You're in acute crisis — a therapist is the right container, and our Resources page will help you find one.",
      "You want results without daily practice. We'd be taking your money for nothing, and we won't.",
    ],
    outcomes: [
      "Run a 12-minute daily practice that no longer requires willpower",
      "Know your narrator's verbatim scripts — and hold rewrites you actually believe",
      "Have 50+ Ledger entries of self-evidence, searchable on hard days",
      "Have completed three real-world reps you currently avoid",
    ],
    curriculum: [
      { week: 1, theme: "The Audit", detail: "Meet your narrator. Thought records without self-judgment." },
      { week: 2, theme: "The Anatomy of a Thought", detail: "Feelings vs. facts vs. forecasts; the labeling effect." },
      { week: 3, theme: "Distance", detail: "Distanced self-talk; your name as a tool." },
      { week: 4, theme: "The Trial", detail: "Evidence examination; the believability rule." },
      { week: 5, theme: "Authorship", detail: "Writing your working sentences; values before traits." },
      { week: 6, theme: "The Body", detail: "Breath, posture, and the honest limits of both." },
      { week: 7, theme: "Rehearsal", detail: "Situation reps for your real calendar — that meeting, that call." },
      { week: 8, theme: "The Ledger", detail: "The evidence habit; your maintenance practice; graduation." },
    ],
  },
  {
    slug: "the-voice",
    number: "02",
    name: "The Voice",
    promise: "An intensive for the sentence you can't stop hearing.",
    meta: { weeks: 6, minutesPerDay: 15, cohort: 12, nextCohort: "October 6" },
    price: 590,
    whoFor: [
      "You've done Foundations, or your Audit shows one pattern towering over the rest.",
      "You want six weeks on a single dominant narrator, in a smaller circle.",
    ],
    whoNotFor: ["You haven't mapped your dialogue yet — start with the free Audit, then Foundations."],
    outcomes: [
      "A complete case file on your dominant narrator: origins, triggers, verbatim scripts",
      "Working rewrites tested under real load, twice a week",
      "A relapse plan you've already rehearsed",
    ],
    curriculum: [
      { week: 1, theme: "The Case File", detail: "Transcripts, attribution, the museum label." },
      { week: 2, theme: "The Function", detail: "What the pattern protects; the cost ledger." },
      { week: 3, theme: "The Rewrite", detail: "Believability engineering for your hardest line." },
      { week: 4, theme: "Load Testing", detail: "Rehearsals at rising stakes." },
      { week: 5, theme: "The Relapse", detail: "Designing for the return of the old voice." },
      { week: 6, theme: "The Handover", detail: "Maintenance, evidence, and what graduation means." },
    ],
  },
  {
    slug: "unshakeable",
    number: "03",
    name: "Unshakeable",
    promise: "For when the room gets bigger.",
    meta: { weeks: 12, minutesPerDay: 20, cohort: 20, nextCohort: "By application" },
    price: 1190,
    whoFor: [
      "You lead, perform, publish, or decide under watchers.",
      "Foundations or equivalent practice history.",
    ],
    whoNotFor: ["This is advanced identity work — the fit check will honestly redirect you if the base isn't built."],
    outcomes: [
      "Scrutiny tolerance built through graded public reps",
      "A criticism metabolism: taking feedback without swallowing verdicts",
      "An identity that doesn't outsource its verdict to the audience",
    ],
    curriculum: [
      { week: 1, theme: "The Audience in Your Head", detail: "Mapping the imagined jury." },
      { week: 4, theme: "Recovering in Public", detail: "The mid-sentence blank, rehearsed until boring." },
      { week: 8, theme: "The Criticism Metabolism", detail: "Feedback intake without identity damage." },
      { week: 12, theme: "The Bigger Room", detail: "Your visibility ladder's top rung, taken." },
    ],
  },
] as const;

export const courses = [
  { slug: "the-anatomy-of-self-talk", title: "The Anatomy of Self-Talk", promise: "Where the inner voice comes from and why it sounds like that.", lessons: 6, hours: "1h 20m", path: "Confidence Fundamentals", preview: true },
  { slug: "the-confidence-equation", title: "The Confidence Equation", promise: "Evidence, appraisal, and why achievement alone never settles the question.", lessons: 5, hours: "1h 05m", path: "Confidence Fundamentals", preview: false },
  { slug: "practice-architecture", title: "Practice Architecture", promise: "Build a daily practice that survives motivation's disappearance.", lessons: 5, hours: "1h 10m", path: "Confidence Fundamentals", preview: false },
  { slug: "emotions-are-data", title: "Emotions Are Data", promise: "Reading feelings as signals without obeying them as orders.", lessons: 6, hours: "1h 30m", path: "Emotional Mastery", preview: false },
  { slug: "the-regulation-toolkit", title: "The Regulation Toolkit", promise: "Breath, labeling, reappraisal, movement: what works, when, and why.", lessons: 7, hours: "1h 45m", path: "Emotional Mastery", preview: true },
  { slug: "the-criticism-metabolism", title: "The Criticism Metabolism", promise: "Taking feedback without swallowing verdicts.", lessons: 4, hours: "55m", path: "Emotional Mastery", preview: false },
  { slug: "where-your-story-came-from", title: "Where Your Story Came From", promise: "Family scripts, cultural scripts, and the archaeology of “who I am.”", lessons: 6, hours: "1h 25m", path: "Identity & Narrative", preview: false },
  { slug: "the-rewrite-deep", title: "The Rewrite, Deep", promise: "Advanced dialogue transformation: believability engineering, relapse design.", lessons: 7, hours: "1h 50m", path: "Identity & Narrative", preview: false },
] as const;

export const articles = [
  {
    slug: "the-inner-critic-is-a-bodyguard",
    title: "The Inner Critic Is a Bodyguard With Terrible Manners",
    dek: "Your critic isn't trying to destroy you — it's protecting you with strategies it learned decades ago.",
    author: "Dr. Lena Hartwig",
    minutes: 9,
    category: "Inner Dialogue",
    type: "ESSAY" as const,
  },
  {
    slug: "why-affirmations-fail",
    title: "Why Affirmations Fail — and What to Say to Yourself Instead",
    dek: "“I am confident” bounces off the mind's fact-checker. Believable sentences don't.",
    author: "Dr. Marcus Oyelaran",
    minutes: 8,
    category: "The Rewrite",
    type: "ESSAY" as const,
  },
  {
    slug: "the-2am-tribunal",
    title: "The 2 A.M. Tribunal: Why Your Mind Re-Runs the Day",
    dek: "The late-night replay feels like quality control. It's a threat rehearsal — and it can be adjourned.",
    author: "Dr. Lena Hartwig",
    minutes: 10,
    category: "Emotional Mastery",
    type: "ESSAY" as const,
  },
  {
    slug: "where-confidence-actually-comes-from",
    title: "Confidence Doesn't Come From Achievement. Here's Where It Actually Comes From.",
    dek: "If achievement produced confidence, the most accomplished would doubt themselves least. They don't.",
    author: "Sofia Reyes",
    minutes: 9,
    category: "Foundations",
    type: "ESSAY" as const,
  },
  {
    slug: "talk-to-yourself-by-name",
    title: "Talk to Yourself by Name. (It's Not Weird.)",
    dek: "Distanced self-talk measurably reduces stress reactivity — and costs one pronoun.",
    author: "Dr. Marcus Oyelaran",
    minutes: 7,
    category: "The Rewrite",
    type: "ESSAY" as const,
  },
  {
    slug: "evidence-sprint",
    title: "The Evidence Sprint",
    dek: "One doubt versus five facts from your own history. Three minutes.",
    author: "Jonas Weber",
    minutes: 3,
    category: "Practice & Habits",
    type: "EXERCISE" as const,
  },
] as const;

export const episodes = [
  { number: 8, title: "The Graduation Episode", guest: "with a hospice-turned-leadership coach", minutes: 52 },
  { number: 7, title: "Your Brain on Reappraisal", guest: "with a cognitive neuroscientist", minutes: 47 },
  { number: 6, title: "Rebuilt: A Story in Three Drafts", guest: "a member's rebuild, long form", minutes: 55 },
  { number: 5, title: "Field Notes: The 2 a.m. Tribunal", guest: "solo — the adjournment protocol", minutes: 12 },
  { number: 4, title: "The Confidence of Quiet People", guest: "with an introverted CEO", minutes: 49 },
  { number: 3, title: "What Therapists Wish Self-Help Knew", guest: "with a clinical psychologist", minutes: 51 },
  { number: 2, title: "The Impostor Files", guest: "with a decorated surgeon", minutes: 48 },
  { number: 1, title: "The Voice Nobody Hears But You", guest: "season premise, solo", minutes: 41 },
] as const;

export const stories = [
  {
    slug: "maya",
    name: "Maya T.",
    age: 34,
    role: "Product lead",
    before: "If you say it and it's obvious, they'll wonder why you're here.",
    after: "I've never once asked a question that ended a career. Ask the question.",
    situation: "Work voice",
  },
  {
    slug: "david",
    name: "David M.",
    age: 47,
    role: "Operations director",
    before: "The good part is over now.",
    after: "Evidence says otherwise — I'm keeping the ledger.",
    situation: "Rebuilding",
  },
  {
    slug: "elena",
    name: "Elena V.",
    age: 29,
    role: "Software engineer",
    before: "Someone smarter will say what you were about to say. Wait.",
    after: "My half-formed idea became the direction. It doesn't have to be finished to be useful.",
    situation: "Speaking up",
  },
  {
    slug: "james",
    name: "James O.",
    age: 41,
    role: "Secondary school teacher",
    before: "You care too much about what people think — and you always will.",
    after: "Caring is the job. I just stopped letting the audience write my verdict.",
    situation: "Visibility",
  },
] as const;

export const faqs = [
  {
    category: “Getting started”,
    items: [
      { q: “What actually is SELV?”, a: “An education and practice platform for confidence and inner dialogue: a method, daily tools, courses, programs, and a community — built on published psychology, not personality.” },
      { q: “How much time does it take?”, a: “Twelve minutes a day is the designed dose. Three minutes counts on hard days. There is no falling behind; the practice waits.” },
      { q: “I've read all the books. How is this different?”, a: “Books deliver insight; insight decays in about three days without practice. SELV is the practice layer — the place ideas become reps become evidence.” },
      { q: “Where do I start?”, a: “The free Audit — four minutes, no account needed. It maps your dominant narrator and gives you something specific to work with. Everything else branches from there.” },
      { q: “Do I need prior experience with therapy or self-development?”, a: “No. Many members come with years of therapy; others arrive with none. SELV is its own methodology, not a homework assignment from somewhere else.” },
    ],
  },
  {
    category: “The Method & science”,
    items: [
      { q: “Is this scientifically supported?”, a: “The components are — reappraisal, self-distancing, affect labeling, expressive writing, and implementation intentions are among the best-replicated tools in behavioral science. Our specific assembly is supported by member outcomes, published annually with methodology. We'll never claim more than the evidence holds.” },
      { q: “Is this therapy?”, a: “No. Many members use SELV alongside therapy; many therapists like it that way. If you're dealing with trauma, clinical anxiety or depression, or thoughts of self-harm, please start at our Resources page — the door to real help, today.” },
      { q: “Do affirmations work?”, a: “Trait affirmations (“I am confident!”) mostly don't — and can backfire when your mind rejects them. Values affirmation and believable rewritten self-statements do have evidence behind them. That difference is basically our whole second movement.” },
      { q: “How is the Method different from CBT?”, a: “CBT is a clinical framework delivered by a therapist to treat a disorder. The Selv Method borrows several CBT tools — thought records, cognitive reappraisal — and applies them as a self-directed practice for non-clinical confidence work. Adjacent, not the same thing.” },
      { q: “Will this work for introversion, neurodivergence, or high sensitivity?”, a: “The Method adapts to personality rather than trying to change it. Introverts stay introverts; the goal is a steadier inner voice for whoever you already are. Members with ADHD, autism spectrum traits, and HSP profiles all practice here — adjustments are part of the design.” },
    ],
  },
  {
    category: “Membership & billing”,
    items: [
      { q: “Can I cancel easily?”, a: “Two clicks, in Settings, no chat with a “retention specialist.” Your Ledger and journal remain exportable for 90 days after.” },
      { q: “What's the refund policy?”, a: “Thirty days, full, no interrogation. One question — “what should we improve?” — and answering is optional.” },
      { q: “Why no lifetime deal?”, a: “Because we design for graduation, not for owning you. A lifetime deal would be a bet against our own method.” },
      { q: “What's included in the free tier?”, a: “The Audit, your Dialogue Profile, a 7-day First Rep plan, one guided rep per week, 30 journal entries, and read-only access to the Commons. Not a crippled trial — a real front door.” },
      { q: “Can I pause instead of cancel?”, a: “Yes. You can pause billing for up to three months from Settings. Your data, Ledger, and streak history are preserved.” },
    ],
  },
  {
    category: “Privacy & data”,
    items: [
      { q: “Can you read my journal?”, a: “Reading it is blocked by design and forbidden by policy: entries are encrypted before storage with keys held separately from your words, so a database breach exposes nothing. Full end-to-end encryption is on our public roadmap; we deliberately don't claim that phrase until it's true.” },
      { q: “What happens to my data if I leave?”, a: “Export everything (PDF/JSON) in Settings, then true deletion — not deactivation — within 30 days of request.” },
      { q: “Is my data used to train AI models?”, a: “No. Journal entries, Ledger entries, and Audit responses are never used for any model training — ours or anyone else's. This is a hard rule, not a “currently” policy.” },
      { q: “Do you sell or share my data?”, a: “We don't sell data. We share aggregate, anonymized outcome statistics in our annual methodology publication — no individual is identifiable in that data, and you can opt out of aggregate inclusion in Settings.” },
    ],
  },
] as const;

export const pricingTiers = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    identity: "For meeting your narrator",
    features: ["The Audit + Dialogue Profile", "7-day First Rep plan", "1 guided rep / week", "30 journal entries", "Library previews", "Commons: read-only"],
    cta: "Begin free",
    recommended: false,
  },
  {
    name: "Practice",
    monthly: 19,
    annual: 190,
    identity: "For building a daily practice",
    features: ["Everything in Free", "Unlimited reps, Tracker, Journal, Ledger", "Full Library", "1 program included / year", "Commons: forums + circles", "Live rituals"],
    cta: "Start practicing",
    recommended: true,
  },
  {
    name: "Academy",
    monthly: 39,
    annual: 390,
    identity: "For studying the machinery",
    features: ["Everything in Practice", "All Academy courses", "All programs included", "Workshops"],
    cta: "Join the Academy",
    recommended: false,
  },
  {
    name: "Inner Circle",
    monthly: null,
    annual: null,
    identity: "For depth, with company",
    features: ["Everything in Academy", "Cohort of peers", "1:1 sessions", "By application"],
    cta: "Apply",
    recommended: false,
  },
] as const;

// ---- Member-app preview fixtures -------------------------------------------

export const previewHabits = [
  { id: "h1", name: "Morning First Draft", identity: "I'm someone who shows up before the day decides for me", target: 4, kept: [1, 2, 4] },
  { id: "h2", name: "One question in standup", identity: "I'm someone who asks the question anyway", target: 3, kept: [2] },
  { id: "h3", name: "Evening adjournment", identity: "I'm someone who closes the day once, kindly", target: 4, kept: [1, 3, 4] },
] as const;

export const previewLedger = [
  { id: "l1", text: "Asked the budget question in front of the VP", because: "because I rehearsed the opening once and trusted it", days: 1 },
  { id: "l2", text: "Said “I can't take that on” without a three-line excuse", because: "because the boundary script was ready before I needed it", days: 2 },
  { id: "l3", text: "Ran the 3-minute rep on a terrible day", because: "because showing up small is still showing up", days: 4 },
  { id: "l4", text: "Sent the proposal before it felt finished", because: "because 80% shipped beats 100% imagined", days: 6 },
  { id: "l5", text: "Spoke first in the retro", because: "because my read of the sprint was worth hearing", days: 9 },
  { id: "l6", text: "Told Sam what I'm working on becoming", because: "because saying it out loud makes it real", days: 12 },
] as const;

export const previewJournal = [
  { id: "j1", title: "Before the review", excerpt: "The Prophet showed up at 7 a.m. with the usual forecast. Wrote it down verbatim, then the second draft…", mood: "CHARGED", daysAgo: 0 },
  { id: "j2", title: "Sunday review", excerpt: "Three kept promises this week. The counter-evidence search is getting embarrassing for the narrator…", mood: "CLEAR", daysAgo: 2 },
  { id: "j3", title: "The dinner conversation", excerpt: "Held the silence for three seconds. It didn't kill me. Interesting.", mood: "AFTER_RAIN", daysAgo: 5 },
] as const;

export const previewPosts = [
  { id: "p1", title: "Kept my week despite the launch chaos", seeking: "SUPPORT", author: "quiet-ascender", comments: 4, space: "wins" },
  { id: "p2", title: "How do you handle the day-13 dip?", seeking: "PERSPECTIVES", author: "rebuilding-dad", comments: 11, space: "general" },
  { id: "p3", title: "Accountability: visibility ladder rung 4 this week", seeking: "ACCOUNTABILITY", author: "m-architect", comments: 6, space: "work-and-voice" },
] as const;

export const previewDelta = {
  dimensions: ["Voice", "Worth", "Boundaries", "Recovery", "Action", "Self-trust"],
  current: [58, 51, 64, 47, 62, 71],
  previous: [41, 44, 52, 38, 55, 60],
} as const;
