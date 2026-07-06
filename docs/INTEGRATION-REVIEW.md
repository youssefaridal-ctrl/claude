# Integration Review — Design × Content × Platform

> Cross-layer consistency audit of the three project phases: brand/UX/UI (`design/`), content (`content/`), and implementation (code + `ARCHITECTURE.md`). Method: every claim, number, taxonomy, and product rule was traced across all layers; conflicts were resolved toward the most defensible version and fixed at the source. **Conducted 2026-07-06; all resolutions applied in the same commit as this document.**

---

## 1. Conflicts found and resolved

### C1 — Journal encryption overclaim *(severity: high — trust/legal)*
- **Conflict:** Design (`02 §12`) and content (Home, About values, FAQ) claimed the journal is **end-to-end encrypted** ("keys are yours," "we can't read it," "we can't recover it if you lose your keys"). The implementation is **server-held AES-256-GCM encryption at rest** with per-user derived keys — strong, but not E2E: the service holds the master key. For a brand whose stated values are "honest numbers" and "privacy as dignity," this is the worst possible kind of inconsistency.
- **Resolution (applied):** All copy unified to the honest claim: *encrypted before storage, keys kept apart from words, a database breach exposes nothing* — with full E2E named as a **public roadmap item** and an explicit rule that the phrase "end-to-end" is not used until it ships. Updated: `design/02 §12(5)`, `design/03 §2, §23, §29`, `content/01` (Home instruments, About values, FAQ). `ARCHITECTURE.md §8` already documented the truthful state and the migration path (`keyVersion` envelope); it is now the single source all copy defers to.
- **Why this direction:** shipping client-side E2E is a multi-week effort (passphrase-derived keys, recovery UX, search trade-offs); shipping honest copy is immediate and *more* on-brand — the FAQ answer now demonstrates the honesty value instead of merely asserting it.

### C2 — Free tier locked out of reading the Commons *(severity: medium — product)*
- **Conflict:** The tier table (`design/02 §11`) grants Free members **read-only** Commons access; the implemented `GET /api/community/posts` required the Practice tier — code contradicted the designed funnel (read-only access is the upgrade motivator).
- **Resolution (applied):** `GET` now requires only authentication; `POST` still requires Practice. Code comment cites the spec.

### C3 — Confidence Map scale was 20–100, documented as 0–100 *(severity: medium — correctness)*
- **Conflict:** `content/07 §1` specified "mean × 20 (0–100)", but mean×20 of a 1–5 scale bottoms out at 20 — the documented range was unreachable, and quarterly-delta comparisons would sit on a misleading floor.
- **Resolution (applied):** Normalized to a true 0–100 scale, `((mean − 1) ÷ 4) × 100`, in both the content spec and `scoreConfidenceMap`; unit tests updated (neutral profile = 50, extremes reach 0/100) and passing.

### C4 — Mindset Assessment item count *(severity: low — spec arithmetic)*
- **Conflict:** `content/07 §2` said "18 items" but enumerates 4 axes × 4 = **16**; the scoring engine implements 16.
- **Resolution (applied):** Content corrected to 16.

### C5 — Today's rep duration *(severity: low — copy)*
- **Conflict:** The Today page labeled "The Second Draft" as 7 minutes; the practice library (`content/03 §B5`) defines it as a 4-minute rep. (The 7-minute figure belongs to the *onboarding First Rep*, a different exercise.)
- **Resolution (applied):** Today page corrected to 4 min.

### C6 — Leaderboards (requested in the build brief) vs. anti-comparison brand law *(resolved during build, recorded here)*
- **Conflict:** The engineering brief listed "Leaderboards"; `design/02 §9` forbids them ("comparison is the disease we treat").
- **Resolution:** Brand law wins. Gamification ships as the Identity Ledger, Chapters, practice levels, and the challenge deck — all self-referential progress. The `Witness` model structurally omits public counts for the same reason. Documented in `ARCHITECTURE.md §6`.

## 2. Verified consistent (no action needed)

- **Naming & voice:** SELV, the six narrators, "The Commons," "Instruments," the Sunday Rewrite, manifesto lines — identical across all layers; UI microcopy (empty states, errors, lapse email) uses content-guide vocabulary; banned words absent from shipped copy.
- **Scoring specs:** Audit narrator weights, tiebreak items (8/9/6/3/11/7), and the 5-point scale match `content/07` exactly in code and tests; Confidence ★ reverse-items {3,6,8,10,14,18,22} match; mood Weather taxonomy (8 states) matches the enum 1:1.
- **Tiers & quotas:** FREE/PRACTICE/ACADEMY/INNER_CIRCLE across design table, Stripe mapping, and entitlement service; free-tier quotas (30 journal entries, 1 guided rep/week) match `design/02 §11`; Inner Circle correctly has no self-serve checkout (application only).
- **Product rules in structure:** grace-based weeks (≥4 kept = kept week, nothing zeroes), identity-first habit creation enforced at the API, ungated Audit with claim-on-signup, digest-style notifications, no third-party trackers, anti-metrics untracked.
- **Journey ↔ routes:** funnel Flow A (Home → Audit → result → soft gate) is implemented end-to-end and e2e-tested; app nav (Today/Practice/Learn/Commons/Progress) matches `design/02 §4`; evidence-band numbers (71% · 12 min · n=1,204 · 30 days) identical in content and code.

## 3. Known gaps (consistent, but incomplete — tracked, not conflicts)

These are scaffolds where all layers agree on the target; `ARCHITECTURE.md §6` carries the ✅/🔧/📋 map:
Audit results radar + three insight cards (result page currently ships narrator + work paragraph); mega-panel nav and ⌘K palette; journal/course/circles UIs; day-12 "Ordinary Middle" and Sunday digest emails; CSP nonces; FTS migration. Additionally: domain placeholders (`selv.example` in code vs. `hello@selv.com` in copy) resolve at domain purchase; certificates should be art-directed as *graduation artifacts* (chapter-recap typography), never badge-styled, per the gamification rules.

## 4. Standing integration rules (to prevent regressions)

*(See also §5 — after the v1.0.0 freeze, these rules are enforced through the change-control log.)*

1. **Claims flow downhill from implementation.** Marketing copy may promise less than the code does, never more. Any security/privacy sentence must cite its `ARCHITECTURE.md` section.
2. **`content/07` is executable.** Assessment items, weights, and formulas change only alongside `server/services/assessments.ts` and its tests — one PR, both layers.
3. **Tier changes touch three files** (`design/02 §11` table, entitlement service, pricing copy) — reviewers check all three.
4. **Voice rules bind UI copy** (`content/00`): error states, empty states, and emails are content, not engineering afterthoughts.
5. **The anti-comparison rule is structural:** no schema may add publicly readable counts of other members' activity.

## 5. Change-control log (post-freeze — blueprint v1.0.0, 2026-07-06)

The blueprint is frozen as the official reference. Every deviation from identity, page structure, product laws, scoring specs, or tier definitions must be logged here **before** merging, with a version bump in `MASTER-BLUEPRINT.md`.

| Date | Version | Genuine problem found | Minimal change applied | Layers touched |
|---|---|---|---|---|
| — | 1.0.0 | *(freeze baseline — no entries)* | — | — |
