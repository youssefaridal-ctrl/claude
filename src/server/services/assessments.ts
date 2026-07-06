import { Narrator } from "@prisma/client";

/**
 * Scoring engines for the interactive assessments.
 * Item text, weights, dimensions, and tiebreak rules are the canonical spec in
 * content/07-interactive-tools.md — this file is that spec, executable.
 * Scoring is transparent by product rule: results always include the raw
 * totals so the UI can show "How this is computed".
 */

// ---------------------------------------------------------------------------
// Internal Dialogue Audit (12 items, answers 0–4 = Never..Always)
// ---------------------------------------------------------------------------

type WeightMap = Partial<Record<Narrator, number>>;

/** Item index (0-based) → narrator weights, per content/07 §3. */
export const AUDIT_WEIGHTS: WeightMap[] = [
  { PROPHET: 2, PERFECTIONIST: 1 }, // 1. wins feel like luck
  { PERFECTIONIST: 2, GHOST: 1 }, // 2. pre-testing sentences for stupidity
  { PROSECUTOR: 2 }, // 3. post-event mistake reel
  { GUARD: 2, PROPHET: 1 }, // 4. downplaying wants
  { PLEASER: 2 }, // 5. responsible for others' moods
  { GHOST: 2, PLEASER: 1 }, // 6. taking up space = debt
  { PROPHET: 2, GUARD: 1 }, // 7. picturing failure first
  { PERFECTIONIST: 2 }, // 8. "good enough" = failure
  { GUARD: 2, GHOST: 1 }, // 9. rather not try than be seen struggling
  { PROSECUTOR: 2 }, // 10. old mistakes as witnesses
  { PLEASER: 2 }, // 11. mid-sentence yeses
  { PROSECUTOR: 1, PROPHET: 1, GHOST: 1 }, // 12. compliments feel like errors
];

/** Tiebreak marker item per narrator (content/07: items 8/9/6/3/11/7, 1-based). */
const TIEBREAK_ITEM: Record<Narrator, number> = {
  PERFECTIONIST: 7,
  GUARD: 8,
  GHOST: 5,
  PROSECUTOR: 2,
  PLEASER: 10,
  PROPHET: 6,
};

/** Radar dimensions from item groupings (0-based item indices). */
const AUDIT_DIMENSIONS: Record<string, number[]> = {
  harshness: [1, 2, 7],
  forecasting: [0, 6, 3],
  visibilityComfort: [5, 8, 1],
  approvalDependence: [4, 10, 5],
  evidenceAcceptance: [0, 11, 9],
  selfPermission: [3, 8, 10],
};

export interface AuditScores {
  narratorTotals: Record<Narrator, number>;
  /** 0–100 per narrator, normalized against that narrator's max possible. */
  narratorNormalized: Record<Narrator, number>;
  dominant: Narrator;
  secondary: Narrator;
  /** 0–100 radar; higher = more of the pattern (visibilityComfort/evidenceAcceptance inverted so higher = healthier). */
  dimensions: Record<string, number>;
}

export function scoreAudit(answers: number[]): AuditScores {
  if (answers.length !== AUDIT_WEIGHTS.length || answers.some((a) => a < 0 || a > 4)) {
    throw new Error(`Audit expects ${AUDIT_WEIGHTS.length} answers in range 0–4.`);
  }

  const totals = Object.fromEntries(
    Object.values(Narrator).map((n) => [n, 0]),
  ) as Record<Narrator, number>;
  const maxima = Object.fromEntries(
    Object.values(Narrator).map((n) => [n, 0]),
  ) as Record<Narrator, number>;

  AUDIT_WEIGHTS.forEach((weights, i) => {
    for (const [narrator, weight] of Object.entries(weights) as [Narrator, number][]) {
      totals[narrator] += (answers[i] ?? 0) * weight;
      maxima[narrator] += 4 * weight;
    }
  });

  const normalized = Object.fromEntries(
    Object.values(Narrator).map((n) => [
      n,
      maxima[n] === 0 ? 0 : Math.round((totals[n] / maxima[n]) * 100),
    ]),
  ) as Record<Narrator, number>;

  const ranked = [...Object.values(Narrator)].sort((a, b) => {
    if (normalized[b] !== normalized[a]) return normalized[b] - normalized[a];
    // Tiebreak: higher answer on the narrator's marker item wins.
    return (answers[TIEBREAK_ITEM[b]] ?? 0) - (answers[TIEBREAK_ITEM[a]] ?? 0);
  });

  const dimensions = Object.fromEntries(
    Object.entries(AUDIT_DIMENSIONS).map(([name, items]) => {
      const raw = items.reduce((sum, i) => sum + (answers[i] ?? 0), 0) / (items.length * 4);
      const inverted = name === "visibilityComfort" || name === "evidenceAcceptance";
      return [name, Math.round((inverted ? 1 - raw : raw) * 100)];
    }),
  );

  return {
    narratorTotals: totals,
    narratorNormalized: normalized,
    dominant: ranked[0]!,
    secondary: ranked[1]!,
    dimensions,
  };
}

// ---------------------------------------------------------------------------
// Confidence Map (24 items, 1–5, six dimensions × 4 items, ★ reverse-scored)
// ---------------------------------------------------------------------------

export const CONFIDENCE_DIMENSIONS = [
  "voice",
  "worth",
  "boundaries",
  "recovery",
  "actionUnderDoubt",
  "selfTrust",
] as const;
export type ConfidenceDimension = (typeof CONFIDENCE_DIMENSIONS)[number];

/** 1-based reverse-scored items per content/07 §1. */
const REVERSE_ITEMS = new Set([3, 6, 8, 10, 14, 18, 22]);

export type ConfidenceScores = Record<ConfidenceDimension, number>;

export function scoreConfidenceMap(answers: number[]): ConfidenceScores {
  if (answers.length !== 24 || answers.some((a) => a < 1 || a > 5)) {
    throw new Error("Confidence Map expects 24 answers in range 1–5.");
  }
  const adjusted = answers.map((v, i) => (REVERSE_ITEMS.has(i + 1) ? 6 - v : v));
  const result = {} as ConfidenceScores;
  CONFIDENCE_DIMENSIONS.forEach((dim, d) => {
    const slice = adjusted.slice(d * 4, d * 4 + 4);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    result[dim] = Math.round(mean * 20); // 0–100
  });
  return result;
}

// ---------------------------------------------------------------------------
// Mindset Assessment (16 scored items, 4 axes, ★ reverse + one +1 offset item
// per axis per content/07 §2 — normalized to a 0–100 slider per axis)
// ---------------------------------------------------------------------------

export const MINDSET_AXES = ["malleability", "attribution", "permission", "failureMeaning"] as const;

/** Per axis: 4 item indices (0-based) and which of them are reverse-scored. */
const MINDSET_LAYOUT = MINDSET_AXES.map((_, axis) => ({
  items: [axis * 4, axis * 4 + 1, axis * 4 + 2, axis * 4 + 3],
  reverse: [axis * 4, axis * 4 + 2], // items 1 and 3 of each axis are ★
}));

export function scoreMindset(answers: number[]): Record<string, number> {
  if (answers.length !== 16 || answers.some((a) => a < 1 || a > 5)) {
    throw new Error("Mindset assessment expects 16 answers in range 1–5.");
  }
  const out: Record<string, number> = {};
  MINDSET_LAYOUT.forEach(({ items, reverse }, axis) => {
    const values = items.map((i) => (reverse.includes(i) ? 6 - (answers[i] ?? 3) : (answers[i] ?? 3)));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    out[MINDSET_AXES[axis]!] = Math.round(((mean - 1) / 4) * 100);
  });
  return out;
}
