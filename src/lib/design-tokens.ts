/**
 * Blueprint design tokens as typed constants — the JS-side mirror of
 * tailwind.config.ts + globals.css, for contexts CSS can't reach (charts,
 * canvas, SVG illustrations, email templates, OG image generation).
 *
 * Source of truth chain: design/04-ui-design-system.md → this file.
 * FROZEN with blueprint v1.0.0 — changes require a docs/INTEGRATION-REVIEW.md §5 entry.
 */

export const color = {
  ink: {
    100: "#DDD9D1",
    300: "#A9A399",
    500: "#6B665C",
    700: "#33302A",
    800: "#211F1B",
    900: "#161512",
    950: "#0E0D0B",
  },
  bone: { 50: "#FAF8F4", 100: "#F2EFE8", 200: "#E7E2D8" },
  solar: { 500: "#E8A23D", 600: "#B4741A", 700: "#8A5810" },
  functional: {
    positiveDark: "#7FB08A",
    positiveLight: "#3E6B4A",
    cautionDark: "#D9B36A",
    cautionLight: "#7A5E1E",
    attentionDark: "#C97B6E", // desaturated terracotta — never alarm-red
    attentionLight: "#8C3D31",
    infoDark: "#7E97AC",
    infoLight: "#3E5468",
  },
} as const;

/** 8px spacing scale (design/04 §4). Component-internal: s1–s6; layout: s6–s12. */
export const space = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 24, s6: 32,
  s7: 48, s8: 64, s9: 96, s10: 128, s11: 160, s12: 240,
} as const;

/** Radius scale (design/04 §6). */
export const radius = { r1: 6, r2: 10, r3: 16, r4: 24, full: 9999 } as const;

/** Motion tokens (design/04 §15) — "breath, not bounce". */
export const motion = {
  duration: { fast: 150, base: 250, slow: 400, narrativeMin: 800, narrativeMax: 1200 },
  easing: {
    outQuart: [0.25, 1, 0.5, 1],
    inQuart: [0.5, 0, 0.75, 0],
    inOutCubic: [0.65, 0, 0.35, 1],
  },
  staggerMs: 60,
  staggerCap: 6,
} as const;

/** Iconography rules (design/01 §14): sizes + stroke, enforced by <Icon>. */
export const icon = {
  strokeWidth: 1.5,
  sizes: { inline: 16, button: 20, nav: 24, feature: 32 },
} as const;

/** Chart palette for radars/sparklines: current vs previous + accents. */
export const chart = {
  currentDark: color.solar[500],
  currentLight: color.solar[600],
  previousDark: color.ink[500],
  previousLight: color.ink[300],
  gridDark: color.ink[700],
  gridLight: color.bone[200],
} as const;
