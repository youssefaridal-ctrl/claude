# `components/ui` — the Blueprint component kit

> Implementation of `design/04-ui-design-system.md`, frozen with blueprint v1.0.0.
> **Every page is built from these primitives.** Living reference: `/styleguide`.
> Changing a primitive's look = changing the design system → needs a
> `docs/INTEGRATION-REVIEW.md §5` entry. Adding a new primitive that follows
> the tokens is normal work.

## The rules

1. **Tokens only.** No hex values, no arbitrary px in feature code. Colors come
   from semantic classes (`bg-background`, `text-muted-foreground`, brand scales
   `ink/bone/solar`); spacing from the 8px scale (`p-6`, `gap-4`, layout `py-s10`);
   radii from `rounded-r1..r4`; shadows from `shadow-elev-1..3`; type from the
   named scale (`text-display-m`, `text-body-s`, `.eyebrow`). JS contexts
   (charts, SVG, emails) import `@/lib/design-tokens`.
2. **Solar ≤ 5% of any viewport.** Primary-action hover trace, one earned
   moment per screen, "recommended" hairlines. Never body text, never large fills.
3. **Fonts:** `font-sans` (structure/UI) · `font-serif` (the mentor's voice:
   greetings, quotes, manifesto, journal) · `font-mono` (eyebrows, meta,
   counters — always with `.eyebrow` or `text-label-mono`). Never introduce a face.
4. **Buttons:** `<Button>` variants only — `primary` (one per viewport),
   `secondary`, `ghost`, `link`, `destructive` (always confirm via `<Dialog>`).
   Default size is the 48px spec; `icon` size is the 44px floor. `asChild` for links.
5. **Cards:** `<Card>` for static surfaces, `<InteractiveCard>` when the whole
   card is a link (it carries hover lift + focus-within ring). Never nest shadows.
6. **Forms:** every input sits inside `<Field>` — it wires label/help/error ids
   and enforces label-above. Validate on blur; error copy is kind and specific,
   with recovery guidance. Drafts autosave with a quiet mono "Saved".
7. **Icons:** only via `<Icon>` (1.5px stroke, 16/20/24/32 sizes, forced
   decorative-vs-labeled decision). Lucide only; no mixed sets, no filled icons.
8. **Motion:** entrances via `<Reveal>/<RevealGroup>` (they own reduced-motion
   parity); durations/easings from tokens; no springs, no bounce, no ambient
   loops outside the two sanctioned ones (hero glow, Today gradient).
9. **A11y floor per component:** visible focus (never remove), 44×44 targets,
   `aria-live` for async status, real labels on icon-only controls, AAA-checked
   token pairs in both themes.
10. **Empty/error states are content.** Use the voice: "Nothing here yet.
    That's not a gap — it's a beginning." Errors never blame the user.

## Kit inventory

`button` · `card` (+Interactive/Header/Title/Content/Footer) · `input`
(+Textarea/Label/FieldError) · `field` · `badge` · `progress` · `tabs` ·
`dialog` · `switch` · `checkbox` · `skeleton` · `separator` · `icon` —
plus `motion/reveal` and the `.eyebrow`/`.glass`/`.skip-link`/`.hairline`
utilities in `globals.css`.
