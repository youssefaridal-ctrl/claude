import { describe, expect, it } from "vitest";

/**
 * Schema-level security tests: validates that API input schemas reject
 * obviously malicious or out-of-bounds input at the boundary.
 * These don't require a running server — they test the Zod definitions inline.
 */

import { z } from "zod";

// Inline schema mirrors — avoids importing Next.js route files into vitest
const habitSchema = z.object({
  name: z.string().min(1).max(120),
  identityStatement: z.string().min(8).max(300),
  cue: z.string().max(300).optional(),
  twoMinuteVersion: z.string().max(300).optional(),
  targetPerWeek: z.number().int().min(1).max(7).optional(),
});

const ledgerSchema = z.object({
  text: z.string().min(1).max(500),
  becauseClause: z.string().max(500).optional(),
  source: z.enum(["REP", "HABIT", "CHALLENGE", "JOURNAL", "MANUAL"]).default("MANUAL"),
  themeTags: z.array(z.string().max(40)).max(8).default([]),
});

const moodSchema = z.object({
  weather: z.enum([
    "CLEAR", "BREEZY", "OVERCAST", "LOW_FOG",
    "CHARGED", "RAINING", "COLD_SNAP", "AFTER_RAIN",
  ]),
  bodyAreas: z
    .array(z.enum(["head", "jaw", "chest", "stomach", "shoulders", "everywhere", "unsure"]))
    .max(7)
    .default([]),
  need: z.enum(["rest", "food", "movement", "people", "quiet", "to-say-something"]).optional(),
  note: z.string().max(500).optional(),
});

describe("Habit schema", () => {
  it("accepts a valid habit", () => {
    expect(() =>
      habitSchema.parse({
        name: "Morning run",
        identityStatement: "I'm someone who moves every day",
        targetPerWeek: 5,
      }),
    ).not.toThrow();
  });

  it("rejects an empty name", () => {
    expect(() => habitSchema.parse({ name: "", identityStatement: "valid long enough text" })).toThrow();
  });

  it("rejects a name longer than 120 chars", () => {
    expect(() =>
      habitSchema.parse({ name: "x".repeat(121), identityStatement: "valid long enough text" }),
    ).toThrow();
  });

  it("rejects identity statement shorter than 8 chars", () => {
    expect(() => habitSchema.parse({ name: "Run", identityStatement: "short" })).toThrow();
  });

  it("rejects targetPerWeek of 0", () => {
    expect(() =>
      habitSchema.parse({ name: "Run", identityStatement: "valid long enough text", targetPerWeek: 0 }),
    ).toThrow();
  });

  it("rejects targetPerWeek greater than 7", () => {
    expect(() =>
      habitSchema.parse({ name: "Run", identityStatement: "valid long enough text", targetPerWeek: 8 }),
    ).toThrow();
  });
});

describe("Ledger schema", () => {
  it("accepts a minimal valid entry", () => {
    expect(() => ledgerSchema.parse({ text: "Spoke up in the meeting." })).not.toThrow();
  });

  it("rejects entries exceeding 500 chars", () => {
    expect(() => ledgerSchema.parse({ text: "x".repeat(501) })).toThrow();
  });

  it("rejects more than 8 theme tags", () => {
    expect(() =>
      ledgerSchema.parse({ text: "ok", themeTags: Array.from({ length: 9 }, (_, i) => `tag${i}`) }),
    ).toThrow();
  });

  it("rejects unknown source values", () => {
    expect(() => ledgerSchema.parse({ text: "ok", source: "XSS_PAYLOAD" })).toThrow();
  });

  it("defaults source to MANUAL", () => {
    const result = ledgerSchema.parse({ text: "ok" });
    expect(result.source).toBe("MANUAL");
  });
});

describe("Mood schema", () => {
  it("accepts a minimal valid check-in", () => {
    expect(() => moodSchema.parse({ weather: "CLEAR" })).not.toThrow();
  });

  it("rejects an unknown weather value", () => {
    expect(() => moodSchema.parse({ weather: "SUNNY" })).toThrow();
  });

  it("rejects notes longer than 500 chars", () => {
    expect(() => moodSchema.parse({ weather: "CLEAR", note: "x".repeat(501) })).toThrow();
  });

  it("rejects more than 7 body areas", () => {
    expect(() =>
      moodSchema.parse({
        weather: "RAINING",
        bodyAreas: ["head", "jaw", "chest", "stomach", "shoulders", "everywhere", "unsure", "head"],
      }),
    ).toThrow();
  });
});
