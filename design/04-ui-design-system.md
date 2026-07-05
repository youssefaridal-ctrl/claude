# 04 — UI Design System · "Blueprint"

> The visual and interactive language for SELV. Named **Blueprint** — architecture for the inner architecture. Every value here is a token; designers work from these primitives, never ad-hoc values. WCAG 2.2 **AAA** is the working target (7:1 contrast for text, 4.5:1 for large text; where a decorative usage can't hit AAA it must be non-essential and pass AA minimum).

---

## 1. Color System

### 1.1 Neutrals — "Ink" (dark) and "Bone" (light)

Warm-biased neutrals; never pure black or white (pure values feel clinical; warmth carries the brand's humanity).

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#0E0D0B` | Dark-mode base background, footer |
| `ink-900` | `#161512` | Dark elevated surfaces, cards |
| `ink-800` | `#211F1B` | Dark hover surfaces, inputs |
| `ink-700` | `#33302A` | Dark borders (strong), disabled text on light |
| `ink-500` | `#6B665C` | Muted text (both modes, check contrast per surface) |
| `ink-300` | `#A9A399` | Secondary text on dark |
| `ink-100` | `#DDD9D1` | Hairlines on light, tertiary text on dark |
| `bone-50` | `#FAF8F4` | Light-mode base background |
| `bone-100` | `#F2EFE8` | Light elevated/alternate bands |
| `bone-200` | `#E7E2D8` | Light borders, input fills |

Primary text: `ink-950` on Bone (≈17:1), `bone-50` on Ink (≈16:1) — AAA with headroom.

### 1.2 Accent — "Solar"

One accent. Scarcity is the luxury strategy: Solar appears on **≤5% of any viewport**, reserved for primary actions, the "new path" in illustrations, and earned celebratory moments.

| Token | Hex | Use |
|---|---|---|
| `solar-500` | `#E8A23D` | Accent on dark (glow, hairlines, active states) |
| `solar-600` | `#B4741A` | Accent text/icons on light (AA large; pair with ink text for AAA contexts) |
| `solar-700` | `#8A5810` | Accent text on light where 7:1 needed |
| `solar-glow` | `solar-500 @ 4–12%` | Radial glows, selection washes |

**Rule:** Solar is never used for large text blocks; body-level accent emphasis uses weight/serif shifts instead.

### 1.3 Functional colors (quiet semantics)

| Token | Dark / Light | Use |
|---|---|---|
| `positive` | `#7FB08A` / `#3E6B4A` | Confirmations, kept habits |
| `caution` | `#D9B36A` / `#7A5E1E` | Warnings (rare) |
| `attention` | `#C97B6E` / `#8C3D31` | Errors — desaturated terracotta, **never alarm-red**; error states are kind here |
| `info` | `#7E97AC` / `#3E5468` | Informational notes, science layer |

### 1.4 Gradients

Used only as *atmosphere*, never on text or buttons' fills:
- `gradient-dawn`: radial, `solar-500 @ 8%` → transparent, on `ink-950` — hero glows.
- `gradient-depth`: linear 180°, `ink-950` → `ink-900` — long dark sections' subtle depth.
- `gradient-paper`: linear 165°, `bone-50` → `bone-100` — light section transitions.
- Signature page moment: the dark→light "dawn wipe" between narrative sections (a scroll-linked background crossfade, not a hard seam).

---

## 2. Typography

### 2.1 Families

| Role | Face (primary / fallback) | Character |
|---|---|---|
| **Display** | *Söhne* or *Neue Haas Grotesk Display* (fallback: Inter Tight) | Engineered confidence; headlines, numbers |
| **Serif (Voice)** | *Tiempos Text / Headline* (fallback: Source Serif 4) | The mentor's voice: manifesto lines, quotes, journal, greetings |
| **Body** | *Söhne* / Inter | UI and running text |
| **Mono (Label)** | *Söhne Mono* / JetBrains Mono | Eyebrows, meta, timestamps, section numbers — the "blueprint annotation" voice |

The serif is strategic: it marks every moment the brand speaks *to the heart*; the grotesque marks system and structure. This two-voice typography is the identity's most ownable trait.

### 2.2 Scale (1.25 ratio, fluid via clamp)

| Token | Size (desktop → mobile) | LH | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | 88 → 44 px | 1.02 | −2% | Hero headlines |
| `display-l` | 64 → 36 px | 1.05 | −1.5% | Page titles |
| `display-m` | 44 → 30 px | 1.1 | −1% | Section H2 |
| `heading-s` | 28 → 22 px | 1.25 | −0.5% | H3/H4, card titles |
| `serif-feature` | 32 → 24 px | 1.4 | 0 | Pull quotes, manifesto |
| `body-l` | 20 px | 1.7 | 0 | Editorial reading |
| `body-m` | 17 px | 1.6 | 0 | Default UI text |
| `body-s` | 15 px | 1.55 | 0 | Secondary UI |
| `label-mono` | 13 px | 1.4 | +8%, uppercase | Eyebrows, meta |
| `caption` | 13 px | 1.5 | +1% | Footnotes, timestamps |

Users can raise the base scale (±2 steps) in Settings; layout is tested at 200% zoom (AAA reflow).

---

## 3. Grid & Layout

- **Desktop (≥1200):** 12 columns, 1200 px max content width, 24 px gutters, 80 px outer margins on wide viewports; full-bleed sections extend background only, content stays on grid.
- **Tablet (768–1199):** 8 columns, 24 px gutters, 48 px margins.
- **Mobile (<768):** 4 columns, 16 px gutters, 20 px margins.
- **Vertical rhythm:** narrative sections breathe at 120–160 px padding (desktop) / 72–96 px (mobile); product screens at 32–48 px.
- **Reading column:** 680 px (~66ch at body-l).
- Baseline grid: 8 px; optical adjustments allowed for Display type only.

## 4. Spacing

8-px system with a half-step: `s1` 4 · `s2` 8 · `s3` 12 · `s4` 16 · `s5` 24 · `s6` 32 · `s7` 48 · `s8` 64 · `s9` 96 · `s10` 128 · `s11` 160 · `s12` 240. Component-internal spacing uses s1–s6; layout spacing s6–s12. Never off-scale values.

## 5. Elevation & Shadows

Dark-mode elevation is **luminance-based** (surfaces lighten, shadows minimal); light mode uses soft, warm, large-radius shadows — no harsh drop shadows anywhere.

| Token | Light mode | Dark mode |
|---|---|---|
| `shadow-1` | 0 1px 2px ink@6%, 0 2px 8px ink@4% | surface step +1, hairline border ink-700 |
| `shadow-2` (cards hover) | 0 4px 12px ink@6%, 0 12px 32px ink@6% | surface +1, top hairline bone@6% |
| `shadow-3` (modals) | 0 8px 24px ink@8%, 0 32px 80px ink@10% | surface +2 + backdrop dim ink-950@60% |
| `glow-solar` | — | 0 0 48px solar@10% (celebration moments only) |

## 6. Radius & Borders

- Radius scale: `r1` 6 (inputs, chips) · `r2` 10 (buttons) · `r3` 16 (cards) · `r4` 24 (modals, feature cards) · `r-full` (pills, avatars). Consistent, slightly-soft — engineered, not bubbly.
- Borders: hairline 1 px, `ink-100` on light / `ink-700` on dark; emphasized 1.5 px. Solar hairline (1 px) only for "recommended/active" markers.

---

## 7. Buttons

| Variant | Anatomy | States |
|---|---|---|
| **Primary** | Ink-950 fill on light / Bone-50 fill on dark, label body-m medium, 48 px height (40 px compact), r2, padding 20 px | Hover: a 1 px **Solar hairline traces the perimeter over 400 ms** (the signature button gesture) + lift 1 px. Active: scale 0.985. Focus: 2 px Solar outline, 2 px offset. Loading: label fades, thin arc spinner. Disabled: 40% opacity + not-allowed. |
| **Secondary** | transparent fill, hairline border | Hover: fill one surface step |
| **Ghost** | text + chevron/arrow | Hover: arrow translates 4 px, underline draws in |
| **Destructive** | attention-colored text, secondary shape; destructive confirmations always modal-guarded | — |

Min touch target 44×44 (AAA 24×24 minimum exceeded); icon-only buttons always tooltipped + aria-labeled.

## 8. Cards

Base card: surface (`bone-50`/`ink-900`), r3, hairline border, padding s6, shadow-1. Hover (interactive cards only): translate −4 px, shadow-2, 200 ms ease-out; entire card is the link (with proper focus ring on the card).
Variants: **Content card** (mono type-label, title heading-s, dek, meta row) · **Feature card** (r4, may host gradient-dawn) · **Stat card** (Display number + mono label) · **Program row card** (full-width horizontal, `03 §4`) · **Ledger line** (text-first, hairline-separated list row, no box). Cards never nest shadows.

## 9. Forms & Inputs

- **Text input:** 48 px height, r1, filled style (`bone-200`/`ink-800`) with hairline border; label **always visible above** (never placeholder-as-label), 13 px medium; helper text below; focus: border → ink + 2 px Solar focus ring; error: attention border + icon + message *with recovery guidance* ("That email is missing an @ — e.g. you@domain.com").
- **Textarea:** auto-growing, serif option in Journal contexts.
- **Select:** custom listbox matching input anatomy, full keyboard/ARIA pattern.
- **Choice chips** (Audit, onboarding): large tappable segments, 48 px min, selected = ink fill + bone text, subtle scale 1.02 on select.
- **Toggle:** 44×24, ink track when on (Solar dot indicator), motion 150 ms.
- **Validation philosophy:** validate on blur (never on keystroke), success is quiet (small check), errors are kind and specific. Forms save drafts automatically (visible "Saved" mono whisper).

## 10. Navigation components

- **Header:** 64 px, glass (`backdrop-blur 16px`, surface @ 72%), hairline appears after 8 px scroll; hides on scroll-down / reveals on scroll-up past 600 px (product pages: always visible).
- **Mega-panel dropdowns:** full-width, r0 (edge-to-edge), two link columns + featured card, 200 ms fade+8 px, closes on Esc/outside, arrow-key navigable.
- **Command palette (⌘K):** modal, r4, shadow-3; search + grouped results (Pages / Library / Actions); keyboard-first; recent items memory.
- **Breadcrumbs (deep content):** mono, chevron hairline separators.
- **Bottom tab bar (member mobile):** 5 items, active = filled glyph + label; center Practice tab slightly elevated.
- **Skip link:** first focusable element on every page ("Skip to content"), visible on focus, styled — not hidden shame CSS.

## 11. Iconography (usage)

Per brand spec (`01 §14`): 24 grid, 1.5 px stroke, outline-only, architecture/writing metaphors. Sizes: 16 (inline), 20 (buttons), 24 (nav), 32 (feature). Icons always accompanied by text labels except universally understood glyphs (close, search) — and those still carry aria-labels.

## 12. Illustrations (usage)

Blueprint monoline system (`01 §16`). Placement rules: max one hero illustration per page; line-draw animation on first viewport entry only (1.2 s, ease-in-out, reduced-motion: static final frame); Solar marks exactly one element per illustration. Delivered as layered SVG with named layers for motion.

## 13. Photography (usage)

Direction per `01 §15`. Implementation: duotone-tolerant grade, 3:2 and 4:5 master crops, art-directed `srcset` per breakpoint, LQIP blur-up load (300 ms fade), all meaningful images with real alt text written editorially ("A woman pauses at a bright window before a presentation" — never "image of woman").

---

## 14. Glassmorphism (restrained)

Glass is a *chrome* material, never a content material: header, command palette, sticky player bar, mobile sheet handles. Recipe: surface @ 70–75%, blur 16 px, saturation 120%, hairline top border bone@8% (dark) / ink@6% (light). Never glass-on-glass; never text under 7:1 on glass (add scrim if needed).

## 15. Motion System

**Motion principle: "Breath, not bounce."** Everything eases like breathing — no spring overshoot, no elastic. Motion communicates state and reward; it never decorates idle screens (except the two sanctioned ambient loops: hero glow, Today-card gradient).

### Tokens
- Durations: `fast` 150 ms (state changes) · `base` 250 ms (hovers, fades) · `slow` 400 ms (panels, page pieces) · `narrative` 800–1200 ms (line-draws, count-ups; scroll-linked).
- Easing: `ease-out-quart` (enter), `ease-in-quart` (exit), `ease-in-out-cubic` (ambient loops).
- Stagger: 40–80 ms between siblings, max 6 staggered items.

### Signature moves (the brand's motion identity)
1. **The line-draw:** logo, icons, illustrations draw bottom-to-top / left-to-right — building, always building.
2. **The Solar trace:** primary-button hover perimeter light.
3. **The dawn wipe:** scroll-linked dark→light section transition.
4. **The ledger file-away:** completed rep's sentence slides and settles into the Ledger with a soft settle (no bounce).
5. **Type rise:** headlines enter with 16 px rise + fade, word-staggered.

### Scroll effects
Parallax capped at 24 px depth deltas; sticky-scroll storytelling sections max 3 steps; progress hairline on articles; scroll-linked animations must be scrubbed (tied to position, not triggered timelines) so they never play "at" the user.

### Loading
- **First app load:** logo symbol line-draws (600 ms) on base surface, then content fades in — total budget < 1.5 s perceived.
- **Content loads:** skeletons using surface-step shimmer (no grey boxes on dark; use luminance steps), 400 ms minimum display to avoid flash.
- **Transitions between marketing pages:** 150 ms crossfade, scroll restored logically.

### Reduced motion (non-negotiable parity)
`prefers-reduced-motion`: all translations/scales/parallax/ambient loops off; opacity-only fades ≤200 ms; line-draws render final frame; count-ups render final number; sticky narratives become stacked static sections. The reduced experience must feel equally finished — it is a first-class theme, not a fallback.

## 16. Micro-interactions & Hover

- Links: underline draws left→right 200 ms; visited state preserved in Library (subtle).
- Inputs: label lifts nothing (labels are static-above by design); focus ring animates in 120 ms.
- Checkbox/habit dot: fills with a 150 ms radial wipe + 1 quiet haptic (mobile).
- Rep completion: the one *earned* celebration — Solar glow pulse (600 ms) + serif line "Done is done." No confetti, ever.
- Card hovers reveal one extra affordance (arrow, meta) rather than transforming layout.
- Tooltips: 300 ms delay, r1, mono 13 px, keyboard-triggerable (focus shows them too).

---

## 17. Dark Mode & Light Mode

- **Dark ("Night · default for narrative"):** ink surfaces, luminance elevation, Solar at 500, imagery slightly dimmed (92% brightness) to protect hierarchy.
- **Light ("Day · default for reading/tools"):** bone surfaces, warm shadows, Solar at 600/700 for contrast, hairlines ink-100.
- Both modes are designed simultaneously for every component — no derived afterthought mode. Toggle in header/footer/settings; respects OS default on first visit; per-surface defaults (narrative dark, reading light) only until the user expresses a choice, which then wins globally.
- Additional themes for accessibility: **High-contrast** (true black/white, 1.5 px borders, no glass) and **Calm** (reduced saturation, larger type default) selectable in Settings.

## 18. Accessibility (WCAG 2.2 AAA program)

- **Contrast:** text 7:1 (AAA), large text 4.5:1, UI components/graphics 3:1; automated + manual audit per release; tokens pre-validated in both modes.
- **Keyboard:** every interaction reachable and operable; visible focus (2 px Solar ring, 2 px offset, never removed); logical order; focus trapped correctly in modals and returned on close; ⌘K palette as accelerator, never the only path.
- **Screen readers:** landmarks on all templates; headings strictly hierarchical; live regions for async updates (rep saved, form errors); ARIA per APG patterns for accordion/listbox/tabs/dialog; audio sessions have full text alternatives; podcast fully transcribed; videos captioned + audio-described.
- **Targets & input:** 44×44 min targets; drag interactions have click alternatives (2.5.7); no gesture-only features.
- **Cognition:** plain-language layer on legal + optional "Plain mode" sitewide (shorter sentences, no idioms); consistent nav; no timeouts on exercises (2.2.6: user-controlled pacing); help always one click away (3.2.6 consistent help).
- **Vestibular safety:** parallax/ambient motion behind the reduced-motion flag; no autoplaying video with motion > 5 s without pause control; no flashing content at all.
- **Auth:** magic-link (no password) satisfies accessible-authentication (3.3.8) elegantly.
- Statement page (`03 §24`) publishes audit dates, known issues, and a priority feedback channel.

## 19. Responsive Behavior

- Breakpoints: 480 / 768 / 1200 / 1600 (max content 1200; at 1600+ only whitespace grows).
- Narrative sections: multi-column → stacked with preserved order of meaning (text before its illustration).
- Sticky right rails → bottom-docked CTA bars (56 px, glass) on mobile.
- Tables → sticky-first-column horizontal scroll with edge-fade affordance.
- Type: fluid clamp per §2.2; hero never exceeds 3 lines on mobile (copy variants provided per breakpoint where needed).
- Hover-revealed information always has a touch equivalent (visible by default on touch, or tap-to-toggle).

## 20. Design System Governance

- **Naming:** `component/variant/state` in Figma; tokens mirrored 1:1 to code names above.
- **Structure:** Foundations (this doc) → Components (Figma library with all states incl. focus, RTL, reduced-motion notes) → Templates (T1–T6) → Pages.
- **Every component ships with:** both modes, all states, min/max content stress cases, a11y annotations (role, label, keyboard map), and motion spec link.
- **Contribution:** proposal → design review (taste + a11y) → token check → publish; no page may introduce an untokenized value.
- **Quality bar:** if a screen wouldn't be shortlisted on Awwwards *and* pass an AAA audit, it isn't done.

---

*This system is deliberately quiet, warm, and precise — the interface equivalent of a steady voice. Build nothing that shouts.*
