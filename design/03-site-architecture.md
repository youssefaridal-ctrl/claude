# 03 — Site Architecture & Page-by-Page Specifications

> Every public page, section by section, specified for design handoff. All measurements, tokens, and component behaviors reference `04-ui-design-system.md` (grid: 12-col/1200 px content, spacing scale S1–S12, colors Ink/Bone/Solar, type styles Display/Serif/Body/Mono-label). Member app screens are specified in §26–§31.
>
> **Shared conventions for every page:** global header (`02 §4`), global footer (§25), dark mode is the *default* for narrative pages, light mode default for reading/tool pages (user toggle always wins). All scroll animations have reduced-motion equivalents (opacity-only). Every section below lists: *Purpose → Layout → Content → Motion/Interaction*.

---

## 1. Home `/`

**Job:** In 90 seconds of scrolling, move a skeptic from "another coaching site" to "I want to take the Audit." Emotional arc: *seen → intrigued → convinced → invited.*

### 1.1 Hero — "The Mirror"
- **Layout:** 100vh, dark (Ink-950), content centered on the 12-col grid, text block spans cols 3–10.
- **Content:** Mono-label eyebrow: `INNER ARCHITECTURE`. Display headline (2 lines, ~clamp 48–88 px): **"The voice in your head was written by other people."** Sub-line in serif italic, delayed entrance: *"Take the pen back."* Below: primary button **[Begin with the free Audit]** + ghost link "Explore the Method →". Bottom edge: a thin scroll cue (animated 1 px line, 24 px tall, looping downward).
- **Background:** near-black gradient field with an extremely subtle animated grain + one slow-breathing radial glow (Solar at 4% opacity) behind the headline — light behaving like dawn arriving. No imagery, no video. Type is the hero.
- **Motion:** headline words rise 16 px + fade in sequence (80 ms stagger); the serif line appears 600 ms later like a reply. Glow loops on an 8 s ease-in-out cycle. Reduced motion: simple fade.

### 1.2 Recognition strip — "You know this voice"
- **Layout:** full-bleed, Ink-950 continues; horizontally scrolling (drag + auto-drift) row of 5 large serif quotes, each on its own baseline, 40% ink-muted.
- **Content:** verbatim inner-critic lines: *"Don't raise your hand unless you're sure." · "They're going to find out." · "Who do you think you are?" · "Say yes, apologize later." · "Everyone else finds this easy."* Final card differs — Solar text: *"None of these are facts. All of them are drafts."*
- **Interaction:** drift pauses on hover; cards have no borders — pure typography. This section does the persona-mirroring work; it must feel uncomfortably accurate.

### 1.3 Thesis section — "Confidence is architecture"
- **Layout:** background shifts to Bone-50 (the "dawn" moment of the page — a full-width color transition, animated as a soft wipe tied to scroll). Two-column: left (cols 2–6) text; right (cols 7–11) illustration.
- **Content:** H2: "Confidence is not a feeling. It's an architecture." Three short paragraphs on the philosophy (identity → dialogue → practice). Right: the flagship blueprint illustration — an axonometric "self under construction," lines drawing on with scroll; the Solar line (the new thought-path) draws last.
- **Interaction:** illustration layers draw at 0.5× scroll speed; ⓘ marks on two claims open the Science Layer popover.

### 1.4 The Method preview — three movements
- **Layout:** Bone background, three horizontally arranged cards (cols 2–11), equal width, connected by a thin drafted line that draws between them on scroll.
- **Content:** `01 · AUDIT` — "Map the voice you have." / `02 · REWRITE` — "Author the voice you choose." / `03 · REP` — "Practice until it's simply yours." Each card: mono-label number, H4, 2-line body, small blueprint glyph. Below the row: text link "The full Method →".
- **Interaction:** cards lift 4 px on hover with shadow-2; glyph line-draws on card hover.

### 1.5 Interactive taste — mini Audit teaser
- **Layout:** contained card (cols 3–10), Ink-900 card on Bone page — an inverted island, glass edge.
- **Content:** "Try one question." A single real Audit item with 4 selectable answers. On selection: an honest one-line insight appears + CTA "11 more questions → your full Dialogue Profile. Free, no signup."
- **Interaction:** selection animates a thin Solar arc completing around the card corner; the insight types on (respecting reduced motion). This is the page's highest-converting element — it must feel like the product, not a quiz widget.

### 1.6 Instruments panorama
- **Layout:** full-bleed Ink-950 again; large product-UI screenshots (Journal, Tracker, Ledger) in a gentle 3D-flat parallax stack (Framer-style), each within a browser-chrome-less rounded frame, floating over a faint grid.
- **Content:** H2: "Tools you'll actually open tomorrow." One-line captions per instrument. CTA link "See all Instruments →".
- **Motion:** screenshots translate at three parallax depths (max 24 px), settle on scroll-stop; specular hairline sweeps across frames once when entering viewport.

### 1.7 Evidence band — honest numbers
- **Layout:** Bone, single row (cols 2–11) of four stat blocks separated by hairlines.
- **Content:** e.g., "71% report speaking up more within 8 weeks*", "12 min — median daily practice", "n=1,204 — 2025 member survey", "30-day refund, no questions". Footnote line links methodology. Numbers in Display type; labels in mono.
- **Motion:** numbers count up over 900 ms on first viewport entry (reduced-motion: static).

### 1.8 One story
- **Layout:** 80vh split — left half full-bleed photograph ("quiet moment before" grade, `01 §15`), right half (Ink-900) a single pull-quote in large serif + name/occupation + link.
- **Content:** one Success Story excerpt, chosen quarterly. "Read Maya's story →" and secondary "All stories →".
- **Motion:** photo scales 1.05→1.0 on entry; quote lines fade up sequentially.

### 1.9 Manifesto refrain
- **Layout:** full-bleed Ink-950, generous 160 px vertical padding, centered.
- **Content:** three manifesto lines (`01 §11`) revealed one at a time as sticky-scroll steps: "Architecture over adrenaline." / "Evidence over inspiration." / "You are the author now." Final line holds in Solar.
- **Motion:** classic sticky text-replace with crossfade + slight tracking-in; reduced-motion shows all three stacked.

### 1.10 Final invitation
- **Layout:** centered, Ink-950 continuing into footer.
- **Content:** H2: "Begin with four minutes of honesty." Body line: "The Audit is free. The results are yours either way." **[Take the Inner Dialogue Audit]** primary button + micro-trust row beneath (lock icon "No signup required · Results immediately · Private by design").
- **Motion:** button has the signature Solar-edge hover (see `04 §7`).

---

## 2. About `/about`

**Job:** Convert respect into trust: story, faces, credentials, values.

1. **Hero:** Bone, editorial. Eyebrow `ABOUT SELV`. Display: "Built by people who needed it." One paragraph of the origin (compressed from `01 §10`). No imagery yet — typographic confidence.
2. **The story:** long-form editorial column (cols 4–9, serif body 20 px, 1.7 line-height) telling the founding story in 5 short chapters with drop-cap chapter openers and 2 inline photographs (founder's desk, early notebooks — real, not staged).
3. **Manifesto (full):** the complete manifesto as a full-bleed Ink section, set as a typographic poster (mixed Display/serif scale), with a subtle "print" texture. A quiet [Download as poster PDF] ghost button — a giveaway that spreads the brand.
4. **The team:** grid of portrait cards (3-col), the photography direction's composed-not-corporate portraits; hover reveals a handwritten-style one-liner: what their inner critic used to say. Humanizing and on-thesis.
5. **Advisory board:** distinct band (Bone-100) — smaller cards with names, credentials, institutions, each linking to their published work. This section is deliberately more formal: mono-labels, hairline rules.
6. **Values in practice:** the six core values (`01 §4`) as an accordion — each opens to a concrete receipt ("Privacy as dignity → your journal is E2E-encrypted; here's the whitepaper").
7. **CTA band:** "Read how the Method works →" (to /method) — About sells belief; Method sells mechanism.

---

## 3. Method `/method` — flagship page

**Job:** The conviction engine. A visitor who finishes this page should feel the approach is *inevitable*. Longest narrative page (~9 sections); dark, cinematic, scroll-driven.

1. **Hero:** Ink-950. Eyebrow `THE SELV METHOD`. Display: "A system for rewriting the voice you think with." Sub: "Three movements. Twelve minutes a day. Grounded in how the brain actually changes."
2. **The problem, precisely:** sticky-scroll sequence (3 steps) pairing text (left, cols 2–6) with an evolving diagram (right): (a) "Your inner dialogue runs ~4,000 words an hour" — waveform densifies; (b) "Most of it was authored before you were 12" — waveform tinted by "other voices" labels; (c) "You've been editing behavior. The script writes the behavior." — camera pulls back to show the script feeding actions. Diagram in blueprint style, Solar reserved for the final insight.
3. **Movement I — Audit:** section header `01 / AUDIT` in huge outlined type. Explains dialogue-mapping: thought records, trigger inventory, the Dialogue Profile taxonomy (6 narrator archetypes with names + glyphs: The Perfectionist, The Guard, The Ghost, The Prosecutor, The Pleaser, The Prophet). Interactive: hoverable archetype wheel; each archetype flips to its core sentence.
4. **Movement II — Rewrite:** `02 / REWRITE`. Cognitive reappraisal, self-distancing, identity statements. Centerpiece interaction: a live "rewrite demo" — a harsh sentence on screen ("I always freeze in meetings") that the user can transform via three labeled operations (Distance / Evidence / Author); each click edits the sentence with a typing animation and names the mechanism. This demo *is* the product pitch.
5. **Movement III — Rep:** `03 / REP`. Practice architecture: daily reps, situation rehearsal, the Ledger. Shows an annotated Today-screen screenshot with call-out lines (drafted leader lines, mono-labels) explaining each element.
6. **The science layer:** Bone section, calmer. Grid of 6 mechanism cards (self-affirmation theory, reappraisal & amygdala down-regulation, identity-based habits, neuroplasticity & spaced repetition, self-distancing, implementation intentions), each: plain-language claim → expandable mechanism → citations. Advisory board strip beneath.
7. **What it isn't:** short, confident two-column list. "Not affirmations shouted at mirrors. Not toxic positivity. Not a personality transplant. Not therapy — and we say clearly when therapy is the right door." (The therapy honesty line is mandatory.)
8. **Proof:** the honest-numbers band (shared component with Home 1.7) + one embedded 90-second documentary clip.
9. **Threshold CTA:** "Start where everyone starts." → Audit button + secondary "See Programs →".

---

## 4. Programs index `/programs`

1. **Hero (compact, 40vh):** Bone. "Programs" Display + line: "Structured seasons of identity work. One focus, one cohort, one transformation at a time."
2. **Orientation row:** three filter chips (Starting point / Inner dialogue / Advanced) + fit-check entry: "Not sure? Take the 5-question fit check →".
3. **Program cards (stacked, full-width rows not grid):** each program is a wide horizontal card (cols 1–12, 320 px tall): left third — program glyph + name in Display ("Foundations") + season badge ("Next cohort: Sept 8"); middle — one-sentence promise + 3 mono-label meta rows (8 weeks · 15 min/day · cohort of 40); right — [Explore] button. Hover: card background shifts one step, glyph line-draws.
4. **Comparison strip:** minimal table (3 programs × 6 rows: for whom, duration, daily load, live elements, outcome focus, price) — hairline table style, sticky first column on mobile.
5. **Fit-check CTA band** + link to Stories filtered by program.

---

## 5. Program detail `/programs/foundations` (template)

1. **Emotional hero:** Ink. Eyebrow `PROGRAM 01`. Display: "Foundations." Serif sub: *"Eight weeks to a voice that's on your side."* Meta row (mono): duration, daily time, format, next cohort date. Primary [Check your fit] + ghost [Curriculum ↓]. Right side: abstract program artwork (blueprint illustration unique per program).
2. **Who it's for / not for:** two honest columns with checkmarks and em-dashes. The "not for" column is real (crisis states, seeking quick fixes → redirected with links).
3. **Outcomes:** "By week 8 you will —" 4 concrete, behavioral outcomes ("run a daily 12-minute practice without willpower", "have 50+ entries of self-evidence"…). No feelings-only promises.
4. **Curriculum accordion:** 8 weeks, each row expands: week theme, the science it's built on (ⓘ layer), the reps, the live session. Week rows numbered in outlined Display digits.
5. **A day inside:** horizontal timeline (07:00 rep → lunchtime micro-practice → evening reflection) with UI screenshots at each node — sets effort expectations honestly.
6. **Instructor & guides:** portrait + credibility + a 60-sec intro video with poster frame in the photography grade.
7. **Stories from this program:** 2 story cards + outcomes stat with methodology footnote.
8. **Pricing block:** single clear price, what's included list, refund policy sentence, cohort seat count (true numbers only). [Check your fit] remains the primary CTA — the fit-check gates checkout.
9. **FAQ (program-specific, 6 items)** + final CTA band.
10. **Sticky element:** after 50% scroll, a slim bottom bar (desktop: right rail card) with program name, next cohort, price, [Check your fit].

---

## 6. Mindset Academy `/academy`

**Job:** Position the learning hub as an institution: self-paced deep education vs. Programs' guided transformation.

1. **Hero:** Bone-100, collegiate-calm. Display: "Mindset Academy." Line: "The science of self, taught properly." Search field (⌘K hint) front and center.
2. **Learning paths:** 3 large path cards (Confidence Fundamentals / Emotional Mastery / Identity & Narrative), each showing course count, total hours, level dots, and a path-map micro-diagram (nodes and connecting line).
3. **Featured course** (wide card with lesson preview player embedded).
4. **All courses grid** → links into /courses catalog with filters (topic, depth, length).
5. **How the Academy works:** 3-step row (Watch/Read → Do the rep → Log the evidence) reinforcing content-to-practice linkage.
6. **Membership note band:** "All Academy courses are included in the Academy tier." → Pricing.

## 7. Courses catalog `/courses` & course detail `/courses/[slug]`

- **Catalog:** T2 template. Filter row: topic, length, level, format. Course cards: 16:9 abstract artwork (generative blueprint patterns per course), title, mono meta (6 lessons · 2h 10m · Practitioner), progress ring if started.
- **Course detail:** T3 template. Left: syllabus list with lesson rows (number, title, duration, lock state), preview lesson unlocked for visitors. Right rail: enrollment card (included-in-tier logic or single purchase), instructor chip, "what you'll practice" list. Below: science layer, related reps, related courses. Lesson player page: distraction-free (T4 chrome), video/audio/text tabs, transcript with clickable timestamps, end-of-lesson "Do the rep" interstitial before next lesson autoplays.

---

## 8. Library `/library`

**Job:** The content universe in one calm, searchable place — essays, guides, episodes, research summaries, exercises.

1. **Hero (slim):** "The Library." Search bar dominant (large, 56 px), placeholder: "Search 400+ essays, episodes, and exercises…"
2. **Filter system (sticky):** type chips (Essays / Guides / Podcast / Research / Exercises) + topic dropdown + depth toggle (Glance/Read/Study) + sort. Filters compose; active filters render as dismissible tokens.
3. **Curated shelves (default, pre-search):** horizontal shelves — "Start here", "Most shared", "For hard days", "New this month" — each a scrollable card row with shelf title in serif.
4. **Results grid (post-filter):** T2 grid, mixed-type cards visually unified: mono type-label (ESSAY / EPISODE / EXERCISE), title, 1-line dek, read/listen time, topic tag. Exercises carry a small Solar corner tick (they're doable).
5. **Zero results:** kind empty state + 3 suggested searches + "Ask the Commons" link.

## 9. Blog / Essays `/blog` & article `/blog/[slug]`

- **Index:** editorial, magazine-like: one full-width feature (large serif headline over photo), then 2-col essay list — date, title, dek, read time; no thumbnails after the fold (typography-led like a serious journal).
- **Article page:** light mode default. Reading column 680 px. Serif headline (up to 56 px), byline row with author chip + read time + listen button (every essay has TTS audio). Body: 20 px serif, 1.75 line-height; pull-quotes break the column (span wider, Solar hairline left border); footnote/science popovers; inline blueprint illustrations. Progress hairline at viewport top. Mid-article: one contextual "Do the rep" block (never more). End: author card, 3 related pieces, quiet newsletter field ("One essay, every Sunday. That's all."). **No comments** — discussion happens in the Commons (link provided).

## 10. Podcast `/podcast` & episode `/podcast/[episode]`

- **Index hero:** show artwork (blueprint-style cover), title ("The Inner Voice — conversations on becoming"), platform buttons (Apple/Spotify/RSS as ghost buttons), latest-episode inline player.
- **Episode list:** rows, not cards: episode number in outlined Display digits, title, guest, duration, tiny waveform sparkline; row expands inline to reveal player + summary.
- **Episode page:** sticky glass player bar (artwork, scrub with chapter ticks, ±15 s, speed). Below: chaptered show notes, full transcript (searchable, speaker-labeled, timestamps clickable), guest bio card, "Reps from this episode" block, related episodes.

---

## 11. Community (visitor page) `/community`

1. **Hero:** Ink. "The Commons." Serif line: *"Do the quiet work in good company."* Ambient background: slowly drifting constellation of small anonymous avatar dots connected by faint lines — community visualized without exposing anyone.
2. **How it works:** three panels — Circles (6–8 people, matched, weekly prompt) / The Forum ("seeking:" norm explained) / Live rituals (Open Practice, AMAs) — each with a stylized, anonymized UI vignette.
3. **The culture:** the community code rendered as a beautiful typographic list ("We witness, we don't fix." "No advice unless asked." "Wins are evidence, not bragging."). This *is* the selling point.
4. **Privacy panel:** pseudonyms, no public follower counts, no DMs by default — lock-glyph illustrated.
5. **A week in the Commons:** horizontal timeline of a typical member week (Mon prompt → Wed open practice → Fri wins thread).
6. **CTA:** "The Commons opens with the Practice tier →" + link to code-of-conduct full text.

## 12. Success Stories `/stories` & story `/stories/[slug]`

- **Index:** cinematic dark grid; story cards = portrait photo (documentary grade) + name, age, occupation + one serif line of their Day-1 inner sentence struck through, replaced beneath by today's sentence — the entire brand in one card. Filters: situation (work voice / rebuilding / social / performance) + program.
- **Story page:** documentary template — full-bleed portrait hero with title treatment; "Before" chapter (their words, serif, generous space); the turn ("The first rep"); the practice (what they actually did, with real Ledger excerpts shown as UI fragments, with permission); "Now" chapter; optional 3–4 min film; footer disclosure ("Shared with consent. Results vary — here's our methodology."). End CTA: "Their first step → the Audit."

---

## 13. Habit Tracker (marketing) `/tools` → member spec §28

Public /tools page lists free instruments; the Tracker/Journal/Planner marketing sections each show: hero screenshot in device-less frame, three-benefit row, and "free with account" CTA. (Member-app specs below in §27–§30.)

## 14. The Confidence Lab `/lab`

**Job:** The interactive playground — free diagnostic + experiments; the platform's viral engine.

1. **Hero:** Ink with subtle animated grid (drafting-table feel). "The Confidence Lab." Line: "Experiments for the inner voice. Try one now — no account, no catch."
2. **The Audit card (dominant):** large feature card: "Inner Dialogue Audit — 12 questions · 4 minutes · your Dialogue Profile immediately." [Begin] button. This card gets 60% of the visual weight.
3. **Experiment grid:** cards for micro-tools, each labeled with duration + mechanism: *The Rewrite Machine* (paste a harsh thought → guided 3-step reframe), *Rehearsal Room* (60-second spoken-confidence drill with mic-optional mode), *Evidence Sprint* (list 5 past proofs in 3 minutes against one doubt), *The Compliment Vault* (store and resurface received praise), *Boundary Script Builder*. Free ones open instantly; member ones show a small key glyph.
4. **Lab notes strip:** "What we're testing next" — public roadmap rows; users can vote with a single "I'd use this" tap. Builds co-creation trust.

### 14a. The Audit flow `/lab/audit` (T4 spec)
- 12 questions, one per screen: statement in large serif ("When something goes well, my first thought is that I got lucky."), 5-point agreement scale as large tappable segments (48 px min target), keyboard 1–5.
- Progress: thin arc filling around a small logo mark, top center; step count in mono ("07 / 12").
- Transitions: 300 ms crossfade+8 px slide; an encouraging micro-line appears at questions 4 and 9 ("Honest answers beat impressive ones.").
- **Results page (ungated):** full-screen reveal — the user's narrator archetype named in Display with its glyph drawing on ("Your dominant narrator: **The Perfectionist**"), a radar chart of 6 dialogue dimensions, three personalized insight cards (each: observation → mechanism → one rep to try), then the soft gate: "Save this profile + get your 7-day First Rep plan" email field, and a quieter "just let me screenshot it" tolerance — the page is beautiful enough to screenshot, and that's fine: the archetype card carries a subtle wordmark.

## 15. Tools `/tools` and 16. Resources `/resources`

- **/tools:** T2 grid of free instruments + downloadables (printable thought-record PDF, wallpaper packs of manifesto lines, notion-template Identity Ledger). Each card: what it is, time cost, format badge. Email-optional downloads (direct link visible; email field says "or get the full kit by email" — no forced gate).
- **/resources:** curated outbound trust page: crisis lines (prominent, always first, visually distinct calm band), recommended books with one-line reasons, research reading list, "when to seek therapy" honest guide, glossary of terms used across the site. This page exists to prove we're not a walled garden.

---

## 17. Journal, 18. Goal Planner, 19. Habit Tracker (public teasers)
Single scroll-page each under /tools/[instrument]: hero screenshot, 3 principles, privacy note (Journal: encryption panel), CTA to create free account. Keep under 5 sections; the product sells itself in §27–§30 screenshots.

---

## 20. FAQ `/faq`

- **Layout:** light, 680 px column. Search-first: type-ahead filter field at top.
- **Categories as anchor tabs:** Getting started / The Method & science / Membership & billing / Privacy & data / Community / Accessibility.
- **Accordion items:** question in 18 px medium; answer in relaxed body with links; deep-linkable (`#refunds`). Billing answers state numbers plainly. Two special entries always present: "Is this therapy?" (honest scope answer + resources link) and "What happens to my data if I leave?" (export + deletion, plainly).
- **Escape hatch footer:** "Still unsure? Write to a human →" (contact), response-time promise.

## 21. Pricing `/pricing`

1. **Hero:** Bone, calm. "Simple, honest pricing." Sub: "Cancel anytime in two clicks. 30-day refund, no interrogation." Billing toggle: Monthly / Annual ("2 months free" — no strikethrough theatrics).
2. **Tier cards (4):** Free / Practice / Academy / Inner Circle (`02 §11`). Practice is visually recommended (Solar hairline top border + "Most members start here" mono tag). Card anatomy: tier name, price in Display, one-sentence identity ("For building a daily practice"), included list with true checkmarks (no greyed fake-rows padding), [Begin] button per card. Inner Circle shows "By application" instead of button-to-checkout.
3. **Full comparison table:** collapsible, hairline style, grouped rows (Instruments / Learning / Community / Support), sticky tier header row.
4. **The guarantee panel:** refund policy in three plain sentences on a bordered card, signed with the founder's name — a page-within-page trust artifact.
5. **Pricing FAQ (6 items)** including "Why isn't there a lifetime deal?" answered honestly.
6. **Final band:** "Not ready to pay? The Audit and Lab basics are free forever." — anti-pressure release valve that raises long-term conversion.

## 22. Contact `/contact`

- Split layout: left — "Write to a human." + form (name, email, topic select, message; labels always visible, spec `04 §9`), response promise ("We answer within 2 business days, personally."). Right — alternate channels: support email in plain text, press kit link, partnership line, and the crisis-resources note ("If you're in crisis, please don't wait for email →" linking /resources, visually gentle but unmissable).
- Post-submit state: full-panel confirmation in serif ("Received. A person — not a bot — will reply."), reference number in mono.

## 23. Legal pages `/legal/privacy` · `/legal/terms` · `/legal/cookies`

- Shared template: 680 px reading column, sticky right mini-TOC, last-updated date + version history link.
- **Signature move: the Plain-Language Layer.** Each legal section is preceded by a Bone-100 summary card: "In plain words: we can't read your journal. Ever." Legal text follows beneath. Toggle at top: "Plain summary / Full text / Both" (default Both).
- Cookie policy pairs with the consent UI: our banner is a quiet bottom-left card, equal-weight Accept/Decline buttons, no dark patterns, remembers choice, and the site is fully functional on Decline.

## 24. Accessibility Statement `/accessibility`

- Not a compliance dump — a commitment page. Sections: our WCAG 2.2 AAA target and current audit status (with date + auditor), known issues list with fix ETAs (public!), how to use the site with keyboard/screen reader/reduced motion (illustrated), personalization features (type scale, contrast themes, plain-language mode), and a direct accessibility feedback channel with priority SLA. Publishing known issues honestly is a category-first trust move.

## 25. Global Footer (all pages)

- **Layout:** Ink-950 always (both modes), top hairline in 8% ink. Four link columns (Explore: Home/Method/Programs/Pricing/Stories · Learn: Academy/Courses/Library/Blog/Podcast · Instruments: Lab/Tracker/Journal/Planner/Tools/Resources · Company: About/Community/FAQ/Contact/Press).
- **Above columns:** one manifesto line in large serif ("You are the author now.") + newsletter field ("One essay, every Sunday.") with inline submit.
- **Bottom row:** logo symbol, © line, legal links (Privacy · Terms · Cookies · Accessibility), language selector, theme toggle, social icons (mono, 1.5 px stroke).
- **Detail:** the footer's background carries the faint blueprint grid at 3% — the brand's floor.

---

# Member App Screens

## 26. Today `/today` (T5)
- Serif greeting + date ("Thursday, March 12. Good morning, Maya."). Hero card: today's rep — title, duration, mechanism mono-tag, [Begin rep] button; card background: slow-breathing gradient.
- Row of 3 tiles: Practice week state (4 dots, e.g. ●●○○ "2 of 4 kept"), latest Ledger line ("Yesterday: 'Asked the question anyway.'"), one matched Library suggestion.
- Nothing below the fold except a quiet "Browse Instruments →". Empty/lapsed state: "The chair is still there." + 3-minute rep offer.

## 27. Session player (rep experience)
- T4 full-focus: dark canvas, step content centered (audio narration + synced text, or text-only mode toggle), progress arc, pause anytime, "leave" always available without guilt copy.
- Ends with capture step: one input ("What did you notice?") → Ledger write animation (the line visually files itself into a drawer glyph) → "Done is done." screen with tomorrow's preview. Total chrome: logo, progress, exit. Nothing else.

## 28. Habit Tracker `/practice/tracker`
- Left rail: habit list (name, identity tag "I am someone who…", schedule). Main: month grid — dots not checkmarks; kept = filled Ink dot, missed = hollow (never red), grace days marked with a small tilde. Week-based streak state banner. Habit detail drawer: identity statement, cue-plan (implementation intention builder: "After [cue], I will [action]"), history sparkline, notes. Add-habit flow enforces identity-first framing (step 1 is always "Who does this habit belong to?").

## 29. Journal `/practice/journal`
- Two-pane (T6). Left: entries list, search, filter by mood/tag/prompt. Main canvas: minimal editor — serif 20 px, slash-commands (/prompt inserts a guided reframe template, /evidence files the line to Ledger, /dialogue opens two-column critic-vs-author writing mode — the signature journaling feature).
- Encryption badge (lock glyph + "Only you can read this") persistent in the corner. Mood capture optional per entry (5 subtle glyphs, no emoji). Weekly review mode: Sunday layout showing the week's entries as a bound-notebook spread with a guided 4-question review.

## 30. Goal Planner `/practice/planner`
- Structure: Identity → Seasons → Moves. Top: identity statements (max 3, editable, serif). Middle: current season card (12-week horizon, theme, 2–3 goals max — the UI physically limits to 3). Each goal: outcome line + weekly moves checklist + linked habits + evidence auto-count from Ledger. Right rail: season progress arc + "quarterly Delta due in 3 weeks" reminder. Deliberately not a project manager: no dependencies, no Gantt — a *becoming* planner.

## 31. Progress `/progress`
- The Identity Ledger as centerpiece: reverse-chronological evidence lines, filter by doubt-theme, and the "Counter-evidence" search: type a doubt ("I can't speak up") → the Ledger returns your own contradicting entries. Quarterly Delta radar (this vs. last quarter, animated draw). Chapters shelf: closed 30-rep chapters as elegant spines; opening one renders the typeset recap. Export everything button (PDF/JSON) — your progress is yours.

---

*Next: `04-ui-design-system.md` — tokens, components, motion, and accessibility implementation.*
