# SELV Platform — Engineering Architecture

> The engineering companion to `design/` (UX/UI) and `content/` (copy, scoring specs).
> Stack: **Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind + shadcn-style components · Framer Motion (+GSAP for scroll narratives) · PostgreSQL + Prisma · Redis · NextAuth v5 · Stripe · Cloudinary.**
>
> **Honest status legend used below:** ✅ implemented in this repo · 🔧 scaffolded (schema + pattern exist; endpoint/UI follows the established pattern) · 📋 designed here, not yet coded.

---

## 1. Folder structure

```
prisma/                      # schema.prisma (all tables), seed.ts
src/
├── env.ts                   # zod-validated environment (fail-fast at boot)
├── auth.ts / auth.config.ts # NextAuth v5 (full / edge-safe split)
├── middleware.ts            # session gating (edge) — headers in next.config.mjs
├── app/
│   ├── (marketing)/         # public narrative site: home, method, lab, signin…
│   ├── (app)/               # member product: today, practice/*, progress…
│   ├── (admin)/             # 🔧 admin dashboard (RBAC: EDITOR/ADMIN)
│   ├── api/                 # REST route handlers (see §5)
│   ├── layout.tsx, robots.ts, sitemap.ts, manifest.ts
├── components/
│   ├── ui/                  # design-system primitives (button, card, input…)
│   ├── motion/              # Reveal/RevealGroup — reduced-motion-safe primitives
│   ├── site/                # header, footer
│   ├── audit/, tracker/     # feature components
├── lib/                     # cross-cutting: prisma, redis, api wrapper, errors,
│   │                        # rate-limit, crypto, logger, seo, stripe, email, analytics
├── server/services/         # domain logic (habits, ledger, assessments, subscription)
├── styles/globals.css       # Blueprint tokens as CSS variables (3 themes)
└── types/                   # module augmentation (next-auth session typing)
tests/unit/  tests/e2e/      # vitest + Playwright (incl. reduced-motion project)
```

**Component architecture:** server components by default; client components only where interaction demands it (`audit-flow`, `habit-week`, motion primitives, theme). Feature components own their data contracts; `components/ui` never imports from features. State management: **server state via RSC + revalidation; interaction state via `useState`/`useOptimistic`** (see `habit-week.tsx`) — no global client store until a real cross-cutting need appears; the first candidate is a command-palette store (Zustand) when ⌘K ships.

## 2. Design tokens

Single source: `design/04-ui-design-system.md` → encoded twice, deliberately: raw brand scales (ink/bone/solar) in `tailwind.config.ts`, semantic tokens as HSL CSS variables in `globals.css` swapped by theme class (`light` default / `.dark` / `[data-theme="high-contrast"]`; the "calm" theme adds a saturation-reduced variable set). Fluid type scale via `clamp()` matches the spec table 1:1. **Rule: no untokenized values in components** — enforced in review.

## 3. Database schema

`prisma/schema.prisma` — 40+ models across ten domains: identity/auth, billing, habits, moods, journal (encrypted envelope columns), Identity Ledger + Chapters, seasons/goals/moves, assessments, courses/enrollment/certificates, community (Circles/posts/witnesses), messaging (mutual-consent connections), challenges, notifications, CMS articles, analytics, audit log. Notable decisions:

- **JournalEntry stores only ciphertext** (AES-256-GCM envelope; §8).
- **AssessmentResult supports anonymous rows** (`anonToken`) so the ungated Audit can attach to an account later — the conversion flow is a schema feature.
- **HabitLog is date-unique per habit** with `KEPT|GRACE` status — grace-based streaks are structural, not cosmetic.
- **Witness has no counter column** — reaction counts are unqueryable by design intent (never displayed).
- **WebhookEvent** = Stripe idempotency ledger.
- 📋 Migration adding `tsvector` columns + GIN indexes on `Article` and `LedgerEntry` for ranked FTS (`to_tsvector('english', …)`); service layer already isolates search so the upgrade is invisible to callers.

## 4. Authentication & authorization

- **AuthN:** NextAuth v5, JWT sessions, **magic-link primary** (10-min single-use links; satisfies WCAG 3.3.8 accessible auth), Google OAuth secondary. Rate-limited link issuance. Split config: edge-safe `auth.config.ts` powers middleware gating; `auth.ts` adds Prisma adapter + email provider.
- **AuthZ, two axes:** RBAC roles (`MEMBER/MENTOR/EDITOR/ADMIN`) for surfaces (admin/CMS/moderation), and **tier entitlements** (`FREE/PRACTICE/ACADEMY/INNER_CIRCLE`) via `server/services/subscription.ts` (`requireTier`, Redis-cached 5 min, invalidated by webhook). Free-tier quotas (30 journal entries, 1 guided rep/week) enforced server-side.

## 5. API architecture

REST route handlers under `src/app/api`, all built through `createHandler` (`lib/api.ts`): **auth mode + zod body schema + named rate-limit policy + RFC 9457 problem-details errors + request-id logging** in one wrapper. Implemented: ✅ `habits` (+ `[habitId]/logs`), `journal`, `moods`, `assessments/audit`, `assessments/claim`, `ledger` (incl. counter-evidence search), `community/posts` (with crisis-flag pipeline), `billing/checkout`, `billing/webhook`, `auth/[...nextauth]`.
🔧 Following the identical pattern: `seasons|goals|moves`, `challenges/today`, `courses/[slug]/enroll`, `lessons/[id]/complete` (issues Certificate on course completion), `circles`, `messages` (gate: ACCEPTED Connection required), `notifications`, `admin/*` (role-gated CRUD for CMS + moderation queue), `export` (full JSON/PDF takeout), `account/delete` (30-day true deletion).

## 6. Interactive modules — status map

| Module | Status | Where |
|---|---|---|
| Internal Dialogue Analyzer (Audit) | ✅ full flow: UI, scoring engine, anonymous persistence, claim-on-signup | `components/audit`, `services/assessments` |
| Habit Tracker | ✅ identity-first creation, grace weeks, optimistic UI | `services/habits`, `components/tracker` |
| Identity Ledger + Chapters (gamification) | ✅ evidence entries, counter-evidence search, auto-closing chapters | `services/ledger` |
| Mood Tracker | ✅ API + schema (weather taxonomy); UI 🔧 | `api/moods` |
| Journal | ✅ encrypted CRUD API; editor UI 🔧 (slash-commands 📋) | `api/journal`, `lib/crypto` |
| Confidence Score / Mindset Assessment | ✅ scoring engines + tests; flow UI 🔧 (reuses AuditFlow pattern) | `services/assessments` |
| Goal Dashboard (Seasons) | schema ✅, API/UI 🔧 | `prisma` |
| Progress Dashboard | Today tiles ✅; radar/Delta charts 🔧 | `(app)/today`, `(app)/progress` |
| Achievements | ✅ as Chapters + PracticeLevel (earned by practice, not payment) | `services/ledger`, `Profile` |
| Challenges | schema + seed deck ✅; assignment API 🔧 | `prisma/seed.ts` |
| Courses & Certificates | schema + seed ✅; player UI 🔧 | `prisma` |
| Community | posts API with seeking-labels, witness reactions, crisis queue ✅; Circles UI 🔧 | `api/community` |
| Messaging | schema ✅ (mutual-consent gate); API 🔧 | `prisma` |
| **Leaderboards** | **intentionally omitted** — violates the product's explicit anti-comparison rule (design/02 §9). Chapters + private Deltas are the sanctioned progress mechanics. | — |

## 7. CMS

First-party CMS: `Article/Category/Course/Lesson` models + `(admin)` dashboard (role-gated) with draft→review→publish workflow, MDX bodies rendered via `next-mdx-remote` 🔧. This keeps the content team in the same design system and the science-layer components (citation popovers) as first-class MDX components. If the team later prefers an external headless CMS, the read path is isolated behind the same service functions.

## 8. Security

- Headers (next.config): HSTS, nosniff, frame-deny, referrer-policy, permissions-policy. 📋 CSP with per-request nonces once the GSAP inline needs are audited.
- Input: zod at every boundary; Prisma parameterization; no raw HTML rendering of user content (plain-text render + typographic quotes).
- **Journal encryption:** AES-256-GCM, per-user derived keys (HKDF-style SHA-256 over master key + userId), versioned for rotation. *This is server-held encryption at rest — the public copy must say "encrypted," not "end-to-end," until the client-side E2E path (passphrase-derived keys, WebCrypto) ships. The `keyVersion` column and envelope format are designed for that migration.*
- Rate limiting: Redis fixed-window with named policies; fails open with alerting (availability > strictness for this product).
- Webhooks: signature verification + idempotency ledger + retry-safe failure handling.
- Secrets only via validated env; logger redacts auth headers, tokens, emails, journal fields.
- 📋 Dependency audit + `npm audit` gate in CI, secret scanning, CSRF hardening notes (NextAuth covers auth routes; mutation routes are same-origin JSON + SameSite=Lax cookies).

## 9. Performance & Core Web Vitals

Budgets: LCP < 1.8s (4G mid-tier), CLS < 0.05, INP < 200ms, marketing JS < 150KB gz/route.
Levers in place: RSC-first (interaction islands only), `next/font` self-hosting (zero-CLS type), `next/image` AVIF/WebP with spec'd breakpoints, immutable static caching, Redis read-through caching (entitlements; extend to Library indexes), route-level code splitting, `optimizePackageImports` for icon/motion libs. 🔧 Lazy-load GSAP scroll narratives via dynamic import on viewport approach; LQIP blur placeholders from Cloudinary (`q_auto,f_auto`, eager transforms). 📋 Lighthouse CI budget assertions as a CI job.

## 10. Accessibility (WCAG 2.2 AAA program)

In code now: skip link, visible focus everywhere (never removed), 44px+ targets, labels-above-fields, `aria-pressed` day dots with full labels, `aria-live` progress/status, keyboard-first Audit (1–5 keys), reduced-motion parity at three layers (CSS global kill, `useReducedMotion` variants, Playwright reduced-motion project), AAA-checked token pairs in both themes, high-contrast theme hooks. Process: axe automated pass per PR 🔧, manual SR walkthrough (NVDA/VoiceOver) per release 📋, public accessibility statement with known issues (route exists in sitemap).

## 11. Email, notifications, analytics, search

- **Email:** Resend HTTP API (`lib/email/mailer.ts`); templates obey content voice rules (magic link, lapse "the chair is still there"; 🔧 Sunday Rewrite digest, day-12 "Ordinary Middle", receipt mirror).
- **Notifications:** DB-backed, digest-oriented, no red badges (product rule); 🔧 read/unread API + settings-controlled practice reminders ("appointment with yourself").
- **Analytics:** first-party events table, no third-party trackers; anti-metrics (session length, notification CTR) deliberately untracked. Dashboards read replicas/rollups 📋.
- **Search:** service-isolated; launch = ILIKE + tag match (ledger counter-evidence ✅), upgrade = Postgres FTS migration (§3) powering Library search + ⌘K palette 🔧.

## 12. Error handling, logging, observability

Error taxonomy in `lib/errors.ts` → problem-details JSON with request-ids; blame-free 500 copy (brand rule reaches the API layer). Pino structured logs with redaction. 📋 OpenTelemetry traces + Sentry (client + server) with PII scrubbing, uptime checks on `/api/health`.

## 13. Testing & CI/CD

- **Unit (vitest):** scoring engines (the content spec is executable and tested — narrator weights, reverse scoring, grace weeks). Extend per service.
- **E2E (Playwright):** the Audit conversion journey (mouse + keyboard-only), overflow/skip-link checks; desktop, mobile, and reduced-motion projects.
- **CI (GitHub Actions):** Postgres+Redis services → install → prisma → lint → typecheck → unit → build → e2e. Deploy on green main (Vercel integration or the provided multi-stage Dockerfile, non-root standalone output). Migrations run in a release phase (`prisma migrate deploy`), never at container boot.
- 📋 Visual regression (Playwright screenshots on tokens/components), load smoke (k6) on auth + audit endpoints.

## 14. Scalability path

Stateless app tier (JWT sessions) → horizontal scale behind the platform LB. Postgres: read replicas for Library/analytics reads; `AnalyticsEvent` partitioning by month at volume. Redis: cache + rate limiting today; queue backend (BullMQ) for email digests, chapter generation, and export jobs 🔧. Cloudinary offloads all media transforms. The monolith is modular by `server/services` boundaries — any service (community, analytics) can be extracted later without API-shape changes; do not extract before the pain is real.
