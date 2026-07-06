# SELV — Master Blueprint

> **The one document that holds the whole project.** Everything below is a synthesis with pointers into the detailed sources — `design/` (identity, UX, UI), `content/` (copy, articles, tools), `src/` + `prisma/` (implementation), `ARCHITECTURE.md` (engineering), `docs/INTEGRATION-REVIEW.md` (cross-layer audit). When this summary and a source document disagree, the source wins; when copy and code disagree, code wins (Integration Rule 1).
>
> **Thesis:** *Confidence is not a feeling. It is an architecture.*
> **Status legend used throughout:** ✅ built & verified · 🔧 scaffolded (schema/pattern exist) · 📋 designed only.

---

## 1. Project at a Glance

| | |
|---|---|
| **Product** | SELV — an identity-transformation platform: audit your inner dialogue, rewrite it, practice daily (12 min), log evidence |
| **Positioning** | "Calm rigor" — the anti-guru quadrant: evidence over inspiration, architecture over adrenaline |
| **Design ambition** | Apple / Notion / Linear calibre; WCAG 2.2 AAA target |
| **Method (core IP)** | **Audit → Rewrite → Rep**, with six narrator archetypes and the Identity Ledger |
| **Business model** | Subscriptions: Free / Practice (~$19) / Academy (~$39) / Inner Circle (application) — designed for graduation, not lock-in |
| **Stack** | Next.js 15 · React 19 · TypeScript strict · Tailwind · Prisma + PostgreSQL · Redis · NextAuth v5 · Stripe · Cloudinary |
| **Verification** | tsc clean · 15/15 unit tests · production build passing · e2e suite in CI |

**Non-negotiable product laws** (enforced structurally where possible): no leaderboards or public counts · streaks never "break" (grace weeks) · the Audit stays ungated (value before email) · no urgency/shame mechanics · security copy never claims more than the code does · everything ends in practice.

---

## 2. Document Map — how the blueprint fits together

```
MASTER-BLUEPRINT.md (this file — the index and the connective tissue)
│
├── IDENTITY & DESIGN            ├── CONTENT                       ├── ENGINEERING
│   design/01-brand-identity     │   content/00-content-guide      │   ARCHITECTURE.md
│   design/02-ux-strategy        │   content/01-site-copy          │   prisma/schema.prisma
│   design/03-site-architecture  │   content/02-articles           │   src/** (app, lib, services)
│   design/04-ui-design-system   │   content/03-practice-library   │   tests/**, .github/ci
│                                │   content/04-frameworks         │
│                                │   content/05-stories-cases      └── GOVERNANCE
│                                │   content/06-seo-editorial          docs/INTEGRATION-REVIEW.md
│                                │   content/07-interactive-tools      (conflict log + standing rules)
```

Authoring flow for any new feature: **design section → content section → schema/service → route/UI → test → traceability row in §11.**

---

## 3. Visual Identity (source: `design/01`, `design/04`)

- **Name:** SELV (Old Norse "self"); wordmark "The Rising Baseline," symbol "The Ascending Stroke" (draws bottom-to-top, 600 ms — the signature animation).
- **Color:** warm neutrals **Ink** (#0E0D0B → #DDD9D1) and **Bone** (#FAF8F4 → #E7E2D8); one accent, **Solar** (#E8A23D / #B4741A / #8A5810), capped at ≤5% of any viewport. Functional colors are desaturated (errors are terracotta, never alarm-red). *In code:* raw scales in `tailwind.config.ts`, semantic HSL variables in `src/styles/globals.css`, three themes (light default, dark, high-contrast; "calm" 📋).
- **Type:** two-voice system — engineered grotesque (system: Inter, target: Söhne) for structure, editorial serif (Source Serif 4 → Tiempos) for "the mentor's voice," mono for blueprint annotations. Fluid clamp scale `display-xl → caption` mirrored 1:1 in Tailwind.
- **Motion:** "breath, not bounce" — ease-out-quart entrances, five signature moves (line-draw, solar trace, dawn wipe, ledger file-away, type rise); reduced-motion is a first-class parity theme (CSS kill + `useReducedMotion` + dedicated Playwright project). *In code:* `src/components/motion/reveal.tsx`, button solar-trace in `ui/button.tsx`.
- **Imagery:** photography = "The Quiet Moment Before" (thresholds, dawn light, composed faces); illustration = "Blueprints of the Inner World" (monoline schematics, Solar marks exactly one element). Icons: 24-grid, 1.5px stroke, architecture/writing metaphors only.

---

## 4. Site Map (source: `design/02 §6`; route status from code)

```
PUBLIC (marketing — dark-first narrative)                        STATUS
├── /                     Home (hero → recognition → thesis → proof) ✅
├── /method               The Selv Method (conviction engine)        📋 copy ready
├── /about /programs[/…] /academy /courses[/…]                       📋 copy ready
├── /library /blog[/…] /podcast[/…] /stories[/…]                     📋 copy+CMS schema ready
├── /lab                  Confidence Lab (experiments index)         📋
│   └── /lab/audit        Inner Dialogue Audit — UNGATED             ✅ full flow
├── /community /tools /resources /faq /pricing /contact              📋 copy ready
├── /signin (+/sent)      Passwordless magic link                    ✅
└── /legal/* /accessibility                                          📋 copy pattern ready

MEMBER (app — light-first product; session-gated at edge + layout)
├── /today                Daily page: ONE rep + 3 tiles              ✅
├── /practice/tracker     Habit Tracker (grace weeks)                ✅
├── /practice/journal|planner|lab                                    🔧 API ✅/schema ✅, UI pending
├── /learn /commons /progress /settings                              🔧
└── (admin) /admin        CMS + moderation queue (EDITOR/ADMIN)      🔧

API (all through createHandler: zod + rate limit + RFC 9457)
auth ✅ · habits+logs ✅ · journal ✅ · moods ✅ · ledger ✅ · assessments/audit+claim ✅
community/posts ✅ · billing/checkout+webhook ✅ · seasons, courses, messages, admin 🔧
```

---

## 5. User Experience (source: `design/02`)

**Personas:** Maya (High-Functioning Doubter, *primary*) · David (Rebuilder) · Amara (Quiet Ascender) · Elena (Plateaued Achiever).
**Journey in five acts:** Recognition → Trust → Threshold → Practice → **Embodiment (designed graduation)** — with engineered counter-moves at known failure points (the day-13 dip gets the "Ordinary Middle" letter 🔧; lapses get "the chair is still there" ✅ email template).

**The three load-bearing flows:**
1. **Flow A — acquisition ✅:** Home → ungated Audit (12 items, keyboard-first, localStorage resume) → immediate narrator result → soft gate → magic-link signup → anonymous result claimed (`anonToken`). *This flow is e2e-tested; it must never break.*
2. **Flow C — daily retention ✅ core:** Today (one action) → rep → Ledger entry → done. No feeds, by design.
3. **Flow D — revenue 🔧:** Method → Program → honest fit-check → Stripe checkout ✅ → webhook-synced entitlements ✅.

**Gamification = "evidence, not points":** Identity Ledger (+ counter-evidence search ✅), Chapters auto-close each 30 reps ✅, practice levels earned by practice, grace-based weeks ✅. Leaderboards intentionally do not exist (see `docs/INTEGRATION-REVIEW.md` C6).

---

## 6. All Pages — master specification index

Every page: layout spec → final copy → implementation route.

| Page | Design spec | Copy | Code |
|---|---|---|---|
| Home | `design/03 §1` (10 sections) | `content/01 §HOME` | `(marketing)/page.tsx` ✅ |
| About / Mission / Vision | `03 §2` | `01 §ABOUT, §MISSION` | 📋 |
| Method | `03 §3` (9 sections, narrators) | `01 §METHOD` | 📋 |
| Programs (+3 details) | `03 §4–5` | `01 §PROGRAMS` (full curricula) | 📋 |
| Academy / Courses | `03 §6–7` | `01 §COURSES` (10-course catalog) | schema+seed ✅, UI 🔧 |
| Library / Blog / Podcast | `03 §8–10` | `02` (5 articles), `05` (podcast bible) | CMS schema ✅, UI 🔧 |
| Confidence Lab / Dialogue Lab | `03 §14` | `01 §LAB, §DIALOGUE LAB` | Audit ✅, others 🔧 |
| Community | `03 §11` | `01 §COMMUNITY` | posts API ✅, UI 🔧 |
| Stories | `03 §12` | `05` (2 stories, labeled composites) | 📋 |
| Pricing / FAQ / Contact | `03 §20–22` | `01 §FAQ, §CONTACT` | checkout API ✅, pages 📋 |
| Legal + Accessibility stmt | `03 §23–24` (plain-language layer) | pattern in `01`/`00` | 📋 |
| Today / Tracker / Journal / Planner / Progress | `03 §26–31` | tool copy in `07` | Today+Tracker ✅, rest 🔧 |

---

## 7. Content System (source: `content/`)

- **Voice law:** `content/00` — mechanism or cut; banned-word list; scope note wherever clinical territory is touched; every piece ends in one rep.
- **Inventory shipped:** all site copy · 5 flagship articles · practice library (30+ exercises, 3 meditation scripts, morning/evening routines, 30-day challenge deck, 7 worksheets) · 12 named frameworks/mental models · stories + podcast season + video briefs · **100 SEO article ideas** in 10 clusters with editorial calendar and author profiles · full item banks + scoring + result copy for **11 interactive tools**.
- **Operating rule:** `content/07` is *executable spec* — assessment items/weights/formulas change only together with `src/server/services/assessments.ts` and its tests (Integration Rule 2).
- **CMS path:** Article/Category/Course/Lesson models ✅ → admin dashboard 🔧 → MDX render with science-layer components 🔧.

---

## 8. Software Architecture (source: `ARCHITECTURE.md`)

```
┌─ EDGE ────────────────────────────────────────────────────────────┐
│ middleware.ts (session gate) · next.config headers (HSTS/CSP…)    │
└──────────────┬────────────────────────────────────────────────────┘
┌─ PRESENTATION┴───────────────────────────────────────────────────┐
│ app/(marketing) dark narrative │ app/(app) member │ (admin) 🔧    │
│ RSC-first; client islands only: audit-flow, habit-week, motion    │
│ components/ui (tokens) ← never imports features                   │
└──────────────┬────────────────────────────────────────────────────┘
┌─ API ────────┴───────────────────────────────────────────────────┐
│ createHandler: auth mode + zod + rate-limit policy + problem JSON │
└──────────────┬────────────────────────────────────────────────────┘
┌─ DOMAIN ─────┴───────────────────────────────────────────────────┐
│ server/services: habits · ledger(+chapters) · assessments ·       │
│ subscription(entitlements) — pure logic, unit-tested              │
└──────┬──────────────┬──────────────┬─────────────────────────────┘
┌─ DATA┴───┐  ┌─ CACHE┴────┐  ┌─ EXTERNAL┴───────────────────────┐
│ Postgres  │  │ Redis:      │  │ Stripe (webhook = source of      │
│ (Prisma)  │  │ tiers, rate │  │ truth) · Resend · Cloudinary     │
└───────────┘  └─────────────┘  └──────────────────────────────────┘
```

Cross-cutting: zod-validated env (fail-fast) · AES-256-GCM journal envelope (`lib/crypto`) · pino redacted logging · first-party analytics (anti-metrics untracked) · CI: lint→typecheck→unit→build→e2e · Dockerfile (non-root standalone) or Vercel.

---

## 9. Database — domain map (source: `prisma/schema.prisma`, 40+ models)

```
IDENTITY            PRACTICE (Instruments)         LEARNING
User ─┬─ Profile    Habit ── HabitLog (KEPT|GRACE) Course ─ Module ─ Lesson
      ├─ Account    MoodEntry (8 weather states)     │          │
      ├─ Session    JournalEntry (ciphertext only) Enrollment ─ LessonProgress
      │             Season ─ Goal ─ Move             │
BILLING             IdentityStatement (max 3)      Certificate
Subscription        LedgerEntry ──> Chapter (per 30 reps)
WebhookEvent        AssessmentResult (anonToken ⇒ ungated Audit)
                    Challenge ─ ChallengeAssignment
COMMUNITY                              PLATFORM
Circle ─ CircleMembership              Notification (digest-style)
Post ─ Comment                         Article ─ Category (CMS)
  └─ Witness (composite PK, NO count)  NewsletterSubscriber
Connection (mutual consent) ─→ Conversation ─ Message
                                       AnalyticsEvent · AuditLog
```

**Schema-as-policy highlights:** `Witness` can't surface counts · `HabitLog` unique per day with GRACE status · `AssessmentResult.anonToken` makes the ungated funnel structural · `JournalEntry` has no plaintext column · `WebhookEvent` = idempotency ledger · `keyVersion` pre-plans the E2E-encryption migration.

---

## 10. Component Relationships

**Dependency rule (one direction only):**
`app/* pages → feature components (audit/, tracker/) → ui/ primitives + motion/`
`app/api routes → lib/api wrapper → server/services → lib (prisma, redis, crypto) → data`
*ui/ and lib/ never import upward; services never import React; features never import each other directly.*

**Request lifecycle (write path, e.g. logging a habit):**
`HabitWeek (client, useOptimistic) → POST /api/habits/[id]/logs → createHandler [auth() → rate-limit → zod] → habits.logHabit → prisma upsert → ledger.addLedgerEntry → maybe Chapter close → Notification → analytics.track` — errors at any stage map to problem-details JSON with request-id; optimistic UI reconciles on failure with blame-free copy.

**Conversion data path (the platform's signature relationship):**
`AuditFlow (anonymous) → AssessmentResult{anonToken} → magic-link signup → events.createUser → Profile → /api/assessments/claim → result attached → 7-day First Rep emails 🔧 → Stripe checkout → webhook → Subscription → tier cache invalidated → entitlements unlock`.

---

## 11. Traceability Matrix (feature ↔ all four layers)

| Feature | Design | Content | Code | Tests |
|---|---|---|---|---|
| Dialogue Audit | `02 §7 FlowA`, `03 §14a` | `07 §3` (items/weights/copy) | `audit-flow.tsx`, `services/assessments`, `api/assessments/*` | unit ✅ e2e ✅ |
| Habit Tracker | `02 §9`, `03 §28` | `07 §5` (state copy) | `services/habits`, `tracker/*` | unit ✅ |
| Identity Ledger + Chapters | `02 §9`, `03 §31` | `04 §3` (model) | `services/ledger`, `api/ledger` | 🔧 |
| Confidence Map | `03 §31` (Delta radar) | `07 §1` | `scoreConfidenceMap` | unit ✅ |
| Journal | `03 §29` | `03 §I` (prompts) | `api/journal`, `lib/crypto` | 🔧 |
| Commons | `02 §10`, `03 §11` | `01 §COMMUNITY` | `api/community/posts` (crisis queue) | 🔧 |
| Membership | `02 §11`, `03 §21` | `01 §FAQ billing` | `services/subscription`, `api/billing/*` | 🔧 |
| Email system | `02 §3` (day-12 letter) | `01 §NEWSLETTER` | `lib/email/mailer` | 🔧 |
| SEO | `03` metadata specs | `06` (clusters, 100 ideas) | `lib/seo`, `sitemap/robots/manifest` | build ✅ |

---

## 12. Roadmap & Governance

**Next build milestones (in order):** 1) Method + Pricing pages (revenue flow D end-to-end) → 2) Audit results radar + insight cards → 3) Journal editor UI → 4) Admin CMS + Library rendering → 5) Circles/forum UI → 6) course player + certificates → 7) client-side E2E journal encryption (then, and only then, the copy changes).

**Standing rules** (full text in `docs/INTEGRATION-REVIEW.md §4`): claims flow downhill from implementation · `content/07` is executable · tier changes touch three files · voice rules bind UI copy · anti-comparison is structural.

*This blueprint is the map, not the territory — keep it one page per concern, keep the pointers accurate, and update §11 with every feature PR.*
