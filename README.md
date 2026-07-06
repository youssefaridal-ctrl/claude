# SELV — Brand, UX & UI Design Specification

A complete design specification for a premium digital platform dedicated to self-confidence, identity transformation, emotional mastery, mindset development, and rewriting internal dialogue.

**Design ambition:** Apple / Notion / Linear / Framer calibre — a product you inhabit, not a coaching website.

**The thesis in one line:** *Confidence is not a feeling. It is an architecture.*

## Documents

| Doc | Contents |
|---|---|
| [`design/01-brand-identity.md`](design/01-brand-identity.md) | Brand philosophy, mission, vision, values, personality, tone of voice, emotional positioning, audience personas, customer journey, brand story, manifesto, naming (recommended: **SELV**), logo concept, iconography, photography & illustration direction, brand architecture |
| [`design/02-ux-strategy.md`](design/02-ux-strategy.md) | UX personas, user goals, emotional journey map, navigation & information architecture, complete sitemap, core user flows, wireframe templates, gamification ("evidence, not points"), community design, membership experience, trust systems, ethical conversion funnels, measurement framework |
| [`design/03-site-architecture.md`](design/03-site-architecture.md) | Every page specified section by section — Home, About, Method, Programs, Academy, Courses, Library, Blog, Podcast, Community, Stories, Confidence Lab, Tools, Resources, FAQ, Pricing, Contact, legal pages, Accessibility Statement, footer — plus all member-app screens (Today, session player, Habit Tracker, Journal, Goal Planner, Progress/Identity Ledger) |
| [`design/04-ui-design-system.md`](design/04-ui-design-system.md) | The "Blueprint" design system — color (Ink/Bone/Solar), typography, grid, spacing, elevation, radius, buttons, cards, forms, navigation, icons, illustration & photo usage, glassmorphism, full motion system, micro-interactions, dark/light/high-contrast/calm themes, WCAG 2.2 AAA program, responsive rules, governance |

## Content suite

Complete original content built on the design system's brand voice:

| Doc | Contents |
|---|---|
| [`content/00-content-guide.md`](content/00-content-guide.md) | Voice rules, banned/preferred words, structure conventions, the clinical scope note, reading-level standards |
| [`content/01-site-copy.md`](content/01-site-copy.md) | Publication-ready copy for Home, About, Mission/Vision, Method, Programs, Courses, Mindset Academy, Confidence Lab, Internal Dialogue Lab, Community, Newsletter, FAQ, Testimonials, Contact |
| [`content/02-articles.md`](content/02-articles.md) | Five complete flagship long-form articles (inner critic, affirmations, rumination, confidence sources, distanced self-talk) |
| [`content/03-practice-library.md`](content/03-practice-library.md) | Full exercise library: confidence, internal dialogue, limiting beliefs, emotional regulation, visualization; meditation scripts; morning/evening routines; journaling prompts; 30-day challenge deck; worksheets; checklists |
| [`content/04-frameworks-and-models.md`](content/04-frameworks-and-models.md) | The teachable IP: named frameworks, mental models, habit-building system, repair model, success roadmaps |
| [`content/05-stories-and-cases.md`](content/05-stories-and-cases.md) | Success stories (labeled composites until real consented stories replace them), teaching case studies, podcast show bible + launch season, video scripts |
| [`content/06-seo-editorial-strategy.md`](content/06-seo-editorial-strategy.md) | Category hierarchy, keyword clusters, 100 SEO article ideas, internal linking strategy, editorial calendar, author profiles, reading recommendations |
| [`content/07-interactive-tools.md`](content/07-interactive-tools.md) | Complete question sets, scoring logic, and result copy for all 11 interactive tools (Confidence & Mindset Assessments, Dialogue Analyzer, Mood/Habit Trackers, Goal Planner, Vision Board, Fear Challenge Generator, Life Wheel, Values Assessment, Daily Reflection) |

## Platform implementation

A production-grade Next.js codebase implementing the design and content specs. See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the full engineering documentation, including an honest status map (implemented / scaffolded / designed).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind (Blueprint tokens) · Framer Motion · Prisma + PostgreSQL · Redis · NextAuth v5 (passwordless magic links) · Stripe · Cloudinary.

**Implemented and verified** (typecheck ✅ · 14 unit tests ✅ · production build ✅):
- Full Prisma schema (40+ models: auth, billing, habits, moods, encrypted journal, Identity Ledger + Chapters, seasons/goals, assessments, courses/certificates, community, messaging, challenges, notifications, CMS, analytics, audit log)
- Assessment scoring engines wired to the content spec (Audit narrator weights, Confidence Map reverse scoring, Mindset axes) — unit-tested
- The ungated Inner Dialogue Audit: full interactive flow, keyboard-first, anonymous results claimable on signup
- Habit Tracker with grace-based weeks and optimistic UI; Identity Ledger with counter-evidence search and auto-closing Chapters
- Stripe checkout + signature-verified idempotent webhook; tier entitlements with Redis caching and free-tier quotas
- AES-256-GCM encrypted journal API; rate-limited REST layer with RFC 9457 errors; crisis-flagged community posts
- Marketing home + member Today page on the Blueprint token system (dark/light/high-contrast), reduced-motion parity
- SEO: metadata builder, JSON-LD, sitemap, robots, manifest; security headers; CI (GitHub Actions) + Dockerfile

**Quick start:** `docker compose up -d && cp .env.example .env && npm install && npx prisma migrate dev && npm run db:seed && npm run dev`

## How to use

Read in order (01 → 04). Documents cross-reference each other by section number. `03` assumes the tokens and components defined in `04`; a designer should be able to produce high-fidelity screens from `03` + `04` without further briefing.

## Design principles (the short version)

1. **Calm is credible** — restraint over hype; no urgency tactics, ever.
2. **Identity precedes behavior** — every feature starts from who the user is becoming.
3. **Everything ends in practice** — no content dead-ends; every page leads to a doable rep.
4. **Evidence over inspiration** — visible science layer, honest numbers, gamification via self-evidence.
5. **Privacy as dignity** — private by default; the journal is unreadable even to us.
6. **Radical accessibility** — WCAG 2.2 AAA target; reduced motion is a first-class experience.
