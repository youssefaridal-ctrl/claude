# 02 — UX Strategy

> Companion to `01-brand-identity.md`. Defines who we design for, what they feel at every step, how the experience is structured, and how trust and conversion are engineered without violating the brand's "calm rigor" ethic.

---

## 1. User Personas (working personas for design decisions)

### P1 — Maya, 34 · "The High-Functioning Doubter" *(primary)*

- **Life:** Senior product manager, big-city, high performer, chronically self-critical. Therapy-literate. Uses Notion, Linear, Things, Arc.
- **Trigger moment:** Froze in an executive review despite knowing the material; that night searched "impostor syndrome evidence based" at 1 a.m.
- **Goals:** Speak without rehearsing every sentence twice; stop the post-meeting replay spiral; feel entitled to her own success.
- **Fears:** Being seen using "self-help"; wasting money on fluff; discovering she's "beyond help."
- **Design implications:** Needs scientific citations visible early; private-by-default everything; premium visual quality as permission ("this is a serious tool, like my other tools"); fast time-to-value (first exercise < 10 min).
- **Devices:** Desktop at work (research, Library), phone at night (Journal, audio).
- **Quote:** *"I don't need motivation. I need a mechanism."*

### P2 — David, 47 · "The Rebuilder"

- **Life:** Recently divorced operations director; identity was "husband + provider," now unmoored. Low digital-product fluency, high commitment.
- **Goals:** Rebuild a sense of self that isn't borrowed from a role; regain steadiness for his kids; sleep without 3 a.m. self-recrimination.
- **Fears:** Being too old to change; anything that feels like a dating-app-adjacent "new you" makeover; group settings where he must perform recovery.
- **Design implications:** Gentle, linear onboarding (no dashboard overwhelm); larger type comfort; clearly optional community; progress framed as rebuilding, never "fixing."
- **Devices:** iPad in the evening, occasionally desktop.
- **Quote:** *"I'm not trying to become someone new. I'm trying to find what's left and build on it."*

### P3 — Amara, 26 · "The Quiet Ascender"

- **Life:** Junior data scientist, introverted, immigrant background, first-gen professional. Consumes long-form podcasts and YouTube essays.
- **Goals:** Speak in meetings without her heart pounding; negotiate salary; keep her personality while gaining presence.
- **Fears:** Advice that says "just be louder"; cost (budget-sensitive); performative community exposure.
- **Design implications:** Strong free tier and free tools (Audit, basic Tracker); introversion-respecting language ("presence, not performance"); student/starter pricing; mobile-first flows.
- **Devices:** Phone, almost exclusively.
- **Quote:** *"I don't want to be the loudest person in the room. I want to stop disappearing in it."*

### P4 — Elena, 51 · "The Plateaued Achiever"

- **Life:** Founder who sold her company; externally "done," internally hollow. Money-insensitive, time-sensitive, bullshit-radar finely tuned.
- **Goals:** Meaning-level identity work; a peer community of substance; a structured way to redefine ambition.
- **Fears:** Being sold to; content beneath her sophistication; anything cultish.
- **Design implications:** Depth-first content (essays, podcast); premium tier with 1:1 and cohort access; understated luxury cues; she reads the Method page and privacy policy before anything else.
- **Devices:** Desktop and print (will download PDFs).
- **Quote:** *"I've achieved everything I was told to want. Now what?"*

---

## 2. User Goals → Product Capabilities Map

| User goal (jobs-to-be-done) | Product answer | Where |
|---|---|---|
| "Help me understand why I doubt myself" | Inner Dialogue Audit (free diagnostic) | Confidence Lab / onboarding |
| "Give me a daily practice that fits my life" | Daily Reps (7–15 min sessions), Habit Tracker | Instruments |
| "Change how I talk to myself" | Dialogue Rewriting exercises, Journal with reframe prompts | Journal, Programs |
| "Prepare me for a specific scary moment" | Situation Rehearsal tools (interview, talk, boundary) | Confidence Lab |
| "Show me this is real science" | Method page, citations layer, expert advisory board | Method, Library |
| "Show me people like me changed" | Success Stories (documentary-style) | Success Stories |
| "Track that I'm actually changing" | Identity Ledger (evidence log), quarterly self-report deltas | Tracker, Goal Planner |
| "Don't let me do this alone" | The Commons (circles of 6–8), cohort programs | Community |
| "Teach me the underlying science" | Mindset Academy courses | Academy, Courses |

---

## 3. Emotional Journey Map

The experience is choreographed against the five brand acts (`01 §9`). Per-stage emotional engineering:

### Stage 1 — Arrival (first 10 seconds)
- **Arrives feeling:** skeptical, quietly hopeful, braced for hype.
- **Must feel instead:** *"This is different. This is calm. This sees me."*
- **Design levers:** dark, spacious hero; a single devastatingly accurate sentence; zero popups; motion that breathes rather than shouts; no cookie banner ambush (see consent design, `03 §24`).

### Stage 2 — Exploration (first 5 minutes)
- **Feels:** curious, evaluating credibility.
- **Must feel:** *"There's a real mechanism here."*
- **Levers:** Method page storytelling; visible science layer (expandable citations); the free Audit as an irresistible, no-signup first taste (results shown before email is requested).

### Stage 3 — Commitment (day 0–1)
- **Feels:** hopeful but afraid of self-abandonment ("I never finish these things").
- **Must feel:** *"The first step is genuinely small."*
- **Levers:** onboarding asks for identity intent, not credit card; first session is 7 minutes and ends with a tangible artifact (their rewritten sentence, beautifully typeset, savable); explicit anti-overwhelm — one next action, never a wall of features.

### Stage 4 — Practice (weeks 1–12)
- **Feels:** oscillating — progress, then doubt, then progress.
- **Must feel:** *"Missing a day is data, not failure."*
- **Levers:** streak system with built-in grace (see §9 Gamification); weekly review ritual; Identity Ledger surfacing past evidence at low moments; adaptive session length on hard days ("Only have 3 minutes? Here's the 3-minute rep.").
- **Critical moment — the Day-13 dip:** analytics category-wide show week-2 abandonment. Countermeasure: the "Ordinary Middle" letter, an honest email + in-app note that normalizes the plateau, delivered on day 12, *before* the dip.

### Stage 5 — Embodiment (month 3+)
- **Feels:** quietly different; app usage naturally declining.
- **Must feel:** *"Graduating is the point — and I'm proud."*
- **Levers:** graduation review, alumni mode (lighter cadence, mentor option in Commons), invitation to record a Success Story. Churn at this stage is reframed and *celebrated* — which paradoxically drives referral and re-subscription for new life chapters.

---

## 4. Navigation Architecture

### Global header (desktop)
Left → right: **Logo** · **Method** · **Programs** · **Learn ▾** (Academy, Courses, Library, Blog, Podcast) · **Instruments ▾** (Habit Tracker, Journal, Goal Planner, Confidence Lab, Tools) · **Community** · **Stories** — right-aligned: **Search (⌘K)** · **Pricing** · **Sign in** · **[Begin] (primary CTA)**.

- Header is 64 px, glass (backdrop-blur) over content, hairline bottom border appears on scroll.
- Dropdowns are full-bleed "mega-panels" (Linear-style): two columns of items with 1-line descriptions + one featured card (e.g., latest podcast episode).
- Logged-in state swaps marketing nav for product nav: **Today** · **Practice** · **Learn** · **Commons** · **Progress** — right: search, notifications (digest-style, non-red), avatar.

### Mobile
- Top bar: logo + hamburger + [Begin]. Menu opens as a full-screen sheet with large type (28 px items), grouped exactly like desktop, staggered 40 ms fade-up per item.
- Logged-in mobile: bottom tab bar, 5 items: Today, Practice, Learn, Commons, Progress. Center "Practice" tab is the visually weighted action.

### Command palette
⌘K everywhere (public and product): navigate, search Library, start a session, jump to journal. This single feature signals "Linear-class product" louder than any copy.

### Footer
Four columns (Explore / Learn / Instruments / Company) + manifesto line + newsletter field + legal row (Privacy, Terms, Cookies, Accessibility Statement) + social. Detailed spec in `03 §25`.

---

## 5. Information Architecture — principles

1. **Two-audience split:** *Visitors* get a narrative site (persuasion architecture); *members* get a product (practice architecture). Same design system, different IA. The moment of login shifts the entire nav model.
2. **Three content depths:** Glance (cards, 30 s) → Read (articles, 5–10 min) → Study (courses, weeks). Every topic exists at all three depths, interlinked.
3. **Everything ends in practice.** Every article, episode, and story has a "Do the rep" block linking to a matching Instrument exercise. Content is never a dead end.
4. **Progressive disclosure of science:** claims are readable in one line, expandable to mechanism, expandable again to citations. Three layers, user-controlled.
5. **URL semantics:** human-readable, hierarchy-true (`/method`, `/programs/foundations`, `/library/essays/the-inner-critic`, `/lab/audit`).

---

## 6. Complete Sitemap

```
PUBLIC (visitor)
├── / ............................ Home
├── /about ....................... About (story, manifesto, team, advisors)
├── /method ...................... The Selv Method (flagship narrative page)
├── /programs .................... Programs index
│   ├── /programs/foundations .... 8-week core program
│   ├── /programs/the-voice ...... Inner-dialogue intensive
│   └── /programs/unshakeable .... Advanced identity program
├── /academy ..................... Mindset Academy (learning hub overview)
│   └── /courses ................. Courses catalog
│       └── /courses/[slug] ...... Course detail
├── /library ..................... The Library (all content, filterable)
│   ├── /blog .................... Blog / Essays index → /blog/[slug]
│   └── /podcast ................. Podcast index → /podcast/[episode]
├── /lab ......................... The Confidence Lab (interactive tools)
│   ├── /lab/audit ............... Inner Dialogue Audit (free diagnostic)
│   └── /lab/[experiment] ........ Individual experiments
├── /tools ....................... Free tools & downloads index
├── /resources ................... Curated external resources / starter kits
├── /community ................... The Commons (marketing page for visitors)
├── /stories ..................... Success Stories index → /stories/[slug]
├── /pricing ..................... Pricing & membership
├── /faq ......................... FAQ
├── /contact ..................... Contact
├── /legal/privacy ............... Privacy Policy
├── /legal/terms ................. Terms of Service
├── /legal/cookies ............... Cookie Policy
└── /accessibility ............... Accessibility Statement

MEMBER (app.selv.com or /app)
├── /today ....................... Daily home: today's rep, streak, one insight
├── /practice .................... Instruments hub
│   ├── /practice/tracker ........ Habit Tracker
│   ├── /practice/journal ........ Journal
│   ├── /practice/planner ........ Goal Planner
│   └── /practice/lab ............ Member Confidence Lab (full experiments)
├── /learn ....................... My programs & courses (enrolled, progress)
├── /commons ..................... Community: my circle, forums, events
├── /progress .................... Identity Ledger, stats, quarterly reviews
└── /settings .................... Account, privacy, accessibility, billing
```

---

## 7. Core User Flows

### Flow A — First Visit → Free Audit → Signup *(primary acquisition flow)*
1. Land on Home → scroll narrative → CTA "Take the Inner Dialogue Audit — free, 4 minutes, no signup."
2. `/lab/audit`: 12 questions, one per screen, elegant progress arc, autosave in local storage.
3. **Results shown immediately, ungated:** the user's "Dialogue Profile" (e.g., *The Perfectionist Narrator*) with 3 personalized insights, beautifully visualized.
4. Soft gate *after* value: "Save your profile & get your 7-day First Rep plan" → email → account created (passwordless magic link).
5. Day 0 email delivers Rep 1. Conversion logic: value first, reciprocity second, ask third.

### Flow B — Signup → First Session ("First Rep") — target < 10 min total
1. Welcome screen: one question — "What moment are you building toward?" (free text + suggested chips: *speak up at work / rebuild after change / quiet the critic / negotiate / perform*).
2. Choose practice window (morning/evening) → permission-based reminder opt-in framed as "appointment with yourself."
3. Rep 1 launches immediately: 7-minute guided exercise (audio + on-screen text), ends with the user writing one rewritten self-statement.
4. Artifact moment: their sentence rendered in large serif on a card → "Saved to your Identity Ledger." First entry exists; investment loop begins.
5. Tomorrow's rep is scheduled and visible. Session ends with a single quiet line: "That's today. Done is done."

### Flow C — Daily Practice Loop (the retention engine)
Open app → **Today** screen shows exactly one primary action (today's rep) → complete → 20-second reflection capture → Ledger updates → optional: one suggested Library read matched to today's theme → close. Time budget: 8–15 min. No feeds, no infinite scroll, by design.

### Flow D — Visitor → Program Enrollment *(primary revenue flow)*
Home/Method → Programs index → Program detail (curriculum, science, stories, instructor) → "Is this right for me?" fit-check quiz (5 questions; honest — it *will* recommend against a program when mismatched, a deliberate trust play) → Pricing → Checkout (Stripe, 2 steps max) → immediate Week 0 access.

### Flow E — Content → Practice cross-link
Any article/podcast → inline "Do the rep" block → matching Lab exercise → completion prompts account creation if visitor.

### Flow F — Struggle / lapse recovery
Missed 3+ days → no shame notification; instead one email: "The chair is still there." → one-tap "Restart with a 3-minute rep" → streak shows "Resumed" state (see §9), not zeroed.

### Flow G — Graduation
Quarterly review detects sustained self-report deltas + declining need → offers Graduation Review session → certificate-quality "Before/Now dialogue portrait" (their Day-1 sentence vs. today's) → alumni mode choice → Story invitation.

---

## 8. Wireframe Descriptions (key templates)

*(Text-spec wireframes; page-by-page visual detail is in `03-site-architecture.md`. These define the structural skeletons a designer lays out first.)*

### T1 — Narrative marketing page (Home, Method, About)
Single-column story spine, max-width 1200 px content on a 12-col grid; alternating full-bleed emotional moments and contained explanatory blocks; sticky mini-CTA appears after 60% scroll; every 3rd section offers an interactive taste (not just text). Rhythm: *feel → understand → try → feel…*

### T2 — Index/catalog page (Programs, Library, Courses, Stories)
Compact hero (30vh) with title + one-line promise + filter row (sticky on scroll). Card grid: 3-col desktop / 2-col tablet / 1-col mobile. Cards are the design system's showcase objects (spec in `04 §8`). Zero pagination — filtered lazy load with a visible count ("Showing 24 of 61").

### T3 — Detail page (Program, Course, Episode, Story, Article)
Two zones: emotional header (title, promise, meta, media) then a 8+4 column split — main content left, sticky right rail (enrollment card / episode player / "do the rep" block). Rail collapses beneath content on mobile, with a bottom-docked CTA bar.

### T4 — Interactive tool (Audit, Lab experiments)
Distraction-free canvas: nav collapses to logo + progress indicator + exit. One question/step per screen, centered, max 640 px. Progress shown as a thin arc around the logo mark. Keyboard-first (number keys select options, Enter advances).

### T5 — Member dashboard (Today)
Not a dashboard — a *daily page*. Date + greeting in serif; one hero card = today's rep; below: 3 small tiles max (streak state, ledger snippet, one Library suggestion). Nothing else. Whitespace is the feature.

### T6 — Workspace tools (Journal, Tracker, Planner)
Notion-calibre two-pane: left rail (entries/habits/goals list, collapsible), main canvas for editing. Full keyboard support, slash-commands in Journal, drag-to-reorder everywhere.

---

## 9. Gamification — "Evidence, not points"

Conventional gamification (XP, badges, leaderboards) would poison this brand. We gamify *self-evidence*:

1. **The Identity Ledger** *(core mechanic)* — every completed rep, reframed sentence, kept promise, and brave act logs one line of evidence: "March 3 — spoke first in standup." The Ledger is the emotional bank account; at low moments the app resurfaces the user's own past evidence ("You have 47 entries that disagree with that thought."). Progress = accumulated proof, not points.
2. **Streaks with grace** — streaks count *practice weeks* (≥4 sessions/week = kept), not consecutive days; a missed day never zeroes anything. Lapsed streaks show "Resumed — day 1 of again," honoring the restart as the real skill. Copy never uses "broken."
3. **Reps & Chapters** — sessions are "reps"; every 30 reps closes a "chapter" with a beautifully typeset recap page (auto-generated: their words, their deltas). Chapters are shareable as elegant image cards — private by default, share by choice.
4. **The Quarterly Delta** — a 10-minute guided self-assessment each quarter; results render as a radar of six confidence dimensions overlaid on last quarter's. The chart movement *is* the reward.
5. **Practice depth levels** — Foundations → Practitioner → Architect: unlocked by demonstrated practice (not payment), gating advanced Lab experiments. Named like disciplines, never like game ranks.
6. **No leaderboards, ever.** Comparison is the disease we treat.

---

## 10. Community Engagement — "The Commons"

- **Circles (core unit):** private groups of 6–8 members matched by intent + timezone (not demographics), guided by a weekly structured prompt. Small enough for safety, structured enough to avoid dead air. Opt-in, joinable/leavable without drama.
- **The Forum:** topic spaces (Inner Dialogue, Work & Voice, Rebuilding, Wins Evidence). Two signature norms enforced by design: posts have a **"seeking: support / perspectives / accountability"** selector (sets response expectations), and the only reaction is **"I see you"** — no likes, no counts displayed publicly.
- **Live rituals:** weekly "Open Practice" (drop-in 20-min co-practice session, cameras optional), monthly expert AMA, quarterly "Threshold Stories" open-mic.
- **Mentorship:** Architects (level 3) may host circles; trained + code-of-conduct bound.
- **Moderation & safety:** clear crisis-escalation protocol (self-harm keywords route to help resources + human review), pseudonym support, no DMs by default (opt-in mutual).
- **Visitor-facing community page** sells the *feeling* of the Commons without exposing member content (privacy is the pitch).

---

## 11. Membership Experience

**Tiers** (full pricing-page spec in `03 §21`):

| | **Free** | **Practice** (core, ~$19/mo) | **Academy** (~$39/mo) | **Inner Circle** (application, ~$290/mo) |
|---|---|---|---|---|
| Audit + Dialogue Profile | ✓ | ✓ | ✓ | ✓ |
| 7-day First Rep plan | ✓ | ✓ | ✓ | ✓ |
| Daily reps + Tracker + Journal + Ledger | limited (1 rep/wk, 30 journal entries) | ✓ | ✓ | ✓ |
| Library | previews | full | full | full |
| Programs & Courses | — | 1 program included/yr | all included | all included |
| The Commons | read-only | forums + circles | forums + circles | + cohort |
| Live rituals | — | ✓ | ✓ + workshops | + 1:1 sessions |

**Experience principles:** annual billing framed as "a year of practice" with two months free — never fake-urgency discounts; pausing is one click and honored gracefully ("Your Ledger will be here."); cancellation flow is 2 steps, no retention dark patterns, ends with a genuine "what we'd improve" question; a **graduation discount is offered to alumni returning for new life chapters** rather than win-back spam.

---

## 12. Trust-Building Elements (system-wide)

1. **The Science Layer:** every claim has a superscript ⓘ → expandable mechanism → citation with DOI link. An advisory board of named, credentialed psychologists/neuroscientists appears on About and Method.
2. **Honest numbers:** outcomes reported with methodology ("In our 2025 member survey, n=1,204, 71% reported…"), never "10x your confidence."
3. **The fit-check that says no:** program quizzes genuinely redirect mismatched users (to free tools or elsewhere). Referenced in marketing: "We'll tell you if this isn't for you."
4. **Radical pricing clarity:** all prices on one page, taxes explained, cancel-anytime stated at every purchase point, refund policy in plain language (30-day, no interrogation).
5. **Privacy as feature:** journal E2E-encrypted (and marketed as such: "We can't read your journal. That's the point."), no ad trackers, data export + true deletion in Settings.
6. **Documentary stories, not testimonials:** filmed/written Success Stories include the struggle and the relapse, name + occupation shown with consent, no income claims, no stock faces.
7. **Design quality itself:** in this category, taste *is* trust. Every hairline, easing curve, and sentence of microcopy is a credibility signal.
8. **Anti-guru stance:** the founder is present but the method is the hero; advisory board diffuses single-personality risk.

---

## 13. Conversion Funnels (ethical persuasion architecture)

### Funnel 1 — Content → Audit → Free plan → Practice tier
SEO/podcast/essays → "Do the rep" blocks → Audit → 7-day First Rep email sequence (7 emails, each one exercise + one idea, zero selling until day 5) → day-7 invitation to Practice tier with a personal-feeling recap of their week ("You wrote 5 entries. Here's what changes with full access.").
**KPIs:** Audit completion ≥ 65%; Audit→email ≥ 55%; free→paid in 30 days ≥ 8%.

### Funnel 2 — Method page → Program enrollment (high-intent)
Method (the conviction builder) → Program detail → fit-check → checkout. Instrument the fit-check as the trust fulcrum: users who receive a "not yet — start here instead" recommendation and follow it convert later at higher LTV.
**KPIs:** Method→Program CTR ≥ 22%; fit-check completion ≥ 70%; checkout completion ≥ 60%.

### Funnel 3 — Story-led (emotional entry)
Paid/social traffic → a single Success Story page (matched by persona) → "Their first step was the Audit" CTA → Funnel 1.

### Funnel 4 — Graduation → referral
Chapter recaps and graduation portraits are the only "shareable" artifacts; each carries a quiet referral link ("Given by [name]"). Referred friends get an extended 14-day First Rep; referrers get a month gifted — reciprocal, not pyramid-ish.

**Global rules:** no exit-intent popups, no countdown timers, no "only 3 spots left" unless literally true (cohorts), one CTA per viewport, and every funnel step must deliver standalone value even if the user never converts.

---

## 14. Measurement Framework (what "working" means)

- **North star:** Weekly Practicing Members (≥3 reps/week).
- **Experience health:** Day-13 retention (the dip), median time-to-first-rep, Ledger entries per member per month, grace-streak resume rate.
- **Trust health:** refund rate (< 3%), cancellation-survey sentiment, "would recommend to a friend in private" NPS variant.
- **Anti-metrics (deliberately not optimized):** session length (longer ≠ better here), daily opens beyond 1, notification CTR.

---

*Next: `03-site-architecture.md` — every page, every section, specified for design handoff.*
