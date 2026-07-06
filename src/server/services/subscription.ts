import { Tier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cached, invalidate } from "@/lib/redis";
import { EntitlementError } from "@/lib/errors";

/**
 * Entitlement layer. Authorization = role (RBAC for admin/editor surfaces)
 * + tier (billing entitlements). This module owns the tier half.
 */

const TIER_ORDER: Record<Tier, number> = {
  FREE: 0,
  PRACTICE: 1,
  ACADEMY: 2,
  INNER_CIRCLE: 3,
};

export async function tierOf(userId: string): Promise<Tier> {
  return cached(`tier:${userId}`, 300, async () => {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub) return Tier.FREE;
    const live = sub.status === "ACTIVE" || sub.status === "TRIALING";
    return live ? sub.tier : Tier.FREE;
  });
}

export async function requireTier(userId: string, required: Tier): Promise<void> {
  const tier = await tierOf(userId);
  if (TIER_ORDER[tier] < TIER_ORDER[required]) {
    throw new EntitlementError(required);
  }
}

export async function invalidateTierCache(userId: string): Promise<void> {
  await invalidate(`tier:${userId}`);
}

/** Free-tier quotas (design/02 §11): 1 guided rep/week, 30 journal entries. */
export const FREE_LIMITS = {
  journalEntries: 30,
  repsPerWeek: 1,
} as const;

export async function assertJournalQuota(userId: string): Promise<void> {
  const tier = await tierOf(userId);
  if (tier !== Tier.FREE) return;
  const count = await prisma.journalEntry.count({ where: { userId, archivedAt: null } });
  if (count >= FREE_LIMITS.journalEntries) {
    throw new EntitlementError(Tier.PRACTICE);
  }
}
