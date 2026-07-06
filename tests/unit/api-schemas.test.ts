import { describe, expect, it } from "vitest";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Inline the schemas under test — avoids importing API routes that pull in
// Next.js internals (which don't run in vitest without a transform shim).
// These schemas must stay in sync with their route files.
// ---------------------------------------------------------------------------

const profileBodySchema = z.object({
  name: z.string().max(80).optional(),
  timezone: z.string().max(64).optional(),
});

const newsletterBodySchema = z.object({
  email: z.string().email(),
});

describe("profileBodySchema", () => {
  it("accepts a full update payload", () => {
    expect(profileBodySchema.safeParse({ name: "Maya T.", timezone: "Europe/London" }).success).toBe(true);
  });

  it("accepts a partial update (name only)", () => {
    expect(profileBodySchema.safeParse({ name: "Jonas" }).success).toBe(true);
  });

  it("accepts a partial update (timezone only)", () => {
    expect(profileBodySchema.safeParse({ timezone: "UTC" }).success).toBe(true);
  });

  it("accepts an empty object (no-op update)", () => {
    expect(profileBodySchema.safeParse({}).success).toBe(true);
  });

  it("rejects a name that exceeds 80 characters", () => {
    expect(profileBodySchema.safeParse({ name: "a".repeat(81) }).success).toBe(false);
  });

  it("rejects a timezone that exceeds 64 characters", () => {
    expect(profileBodySchema.safeParse({ timezone: "x".repeat(65) }).success).toBe(false);
  });
});

describe("newsletterBodySchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterBodySchema.safeParse({ email: "user@example.com" }).success).toBe(true);
  });

  it("rejects a missing email", () => {
    expect(newsletterBodySchema.safeParse({}).success).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(newsletterBodySchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});
