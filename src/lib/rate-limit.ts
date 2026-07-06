import { redis } from "@/lib/redis";
import { RateLimitError } from "@/lib/errors";

export interface RateLimitPolicy {
  /** Max requests per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
  /** Namespace, e.g. "api:habits". */
  name: string;
}

/** Named policies so limits live in one place, not scattered across handlers. */
export const policies = {
  api: { name: "api", limit: 120, windowSeconds: 60 },
  mutation: { name: "mutation", limit: 30, windowSeconds: 60 },
  auth: { name: "auth", limit: 10, windowSeconds: 600 },
  assessment: { name: "assessment", limit: 10, windowSeconds: 3600 },
  contact: { name: "contact", limit: 5, windowSeconds: 3600 },
  messaging: { name: "messaging", limit: 60, windowSeconds: 60 },
} satisfies Record<string, RateLimitPolicy>;

/**
 * Fixed-window counter with per-window keys (INCR + EXPIRE — atomic enough for
 * abuse control; sliding-window precision isn't worth a Lua script here).
 * Fails OPEN on Redis outage: availability over strictness for a wellbeing app,
 * with an alert expected from the Redis health check instead.
 */
export async function enforceRateLimit(
  identifier: string,
  policy: RateLimitPolicy,
): Promise<void> {
  const window = Math.floor(Date.now() / 1000 / policy.windowSeconds);
  const key = `rl:${policy.name}:${identifier}:${window}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, policy.windowSeconds);
    if (count > policy.limit) {
      const retryAfter =
        policy.windowSeconds - (Math.floor(Date.now() / 1000) % policy.windowSeconds);
      throw new RateLimitError(retryAfter);
    }
  } catch (err) {
    if (err instanceof RateLimitError) throw err;
    // Redis unavailable — fail open (see note above).
  }
}
