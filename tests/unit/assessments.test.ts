import { describe, expect, it } from "vitest";
import {
  scoreAudit,
  scoreConfidenceMap,
  scoreMindset,
  AUDIT_WEIGHTS,
} from "@/server/services/assessments";

describe("scoreAudit", () => {
  it("rejects malformed answer sets", () => {
    expect(() => scoreAudit([])).toThrow();
    expect(() => scoreAudit(Array(12).fill(5))).toThrow(); // out of range
  });

  it("identifies the Perfectionist from its signature items", () => {
    // Max out items 2 and 8 (Perfectionist-weighted), floor the rest.
    const answers = Array(12).fill(0);
    answers[1] = 4; // pre-testing sentences
    answers[7] = 4; // "good enough" = failure
    const result = scoreAudit(answers);
    expect(result.dominant).toBe("PERFECTIONIST");
  });

  it("identifies the Prosecutor from post-event review items", () => {
    const answers = Array(12).fill(0);
    answers[2] = 4; // mistake highlight reel
    answers[9] = 4; // old mistakes as witnesses
    expect(scoreAudit(answers).dominant).toBe("PROSECUTOR");
  });

  it("normalizes each narrator to 0–100 with a full-agreement profile", () => {
    const result = scoreAudit(Array(12).fill(4));
    for (const value of Object.values(result.narratorNormalized)) {
      expect(value).toBe(100);
    }
  });

  it("returns distinct dominant and secondary narrators", () => {
    const result = scoreAudit([4, 3, 2, 1, 0, 1, 2, 3, 4, 0, 1, 2]);
    expect(result.dominant).not.toBe(result.secondary);
  });

  it("covers all six narrators across the weight map", () => {
    const covered = new Set(AUDIT_WEIGHTS.flatMap((w) => Object.keys(w)));
    expect(covered.size).toBe(6);
  });
});

describe("scoreConfidenceMap", () => {
  it("scores a neutral profile at 60 across dimensions (3s, with reverses balancing)", () => {
    const scores = scoreConfidenceMap(Array(24).fill(3));
    for (const value of Object.values(scores)) expect(value).toBe(60);
  });

  it("applies reverse scoring — all-5s is NOT a perfect profile", () => {
    const scores = scoreConfidenceMap(Array(24).fill(5));
    // Dimensions containing ★ items must be dragged down by reversed 5s→1s.
    expect(scores.voice).toBeLessThan(100);
    expect(scores.worth).toBeLessThan(100);
  });

  it("rejects out-of-range answers", () => {
    expect(() => scoreConfidenceMap(Array(24).fill(0))).toThrow();
  });
});

describe("scoreMindset", () => {
  it("returns four axes on a 0–100 scale", () => {
    const scores = scoreMindset(Array(16).fill(3));
    expect(Object.keys(scores)).toEqual([
      "malleability",
      "attribution",
      "permission",
      "failureMeaning",
    ]);
    for (const v of Object.values(scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});
