import Stripe from "stripe";
import { env } from "@/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

import type { Tier } from "@prisma/client";

export type BillingInterval = "monthly" | "annual";

/** Price lookup — env-driven so price changes never require a deploy of logic. */
export function priceIdFor(tier: Tier, interval: BillingInterval): string | null {
  const map: Partial<Record<Tier, Record<BillingInterval, string | undefined>>> = {
    PRACTICE: {
      monthly: env.STRIPE_PRICE_PRACTICE_MONTHLY,
      annual: env.STRIPE_PRICE_PRACTICE_ANNUAL,
    },
    ACADEMY: {
      monthly: env.STRIPE_PRICE_ACADEMY_MONTHLY,
      annual: env.STRIPE_PRICE_ACADEMY_ANNUAL,
    },
  };
  return map[tier]?.[interval] ?? null;
}

export function tierFromPriceId(priceId: string): Tier | null {
  if (priceId === env.STRIPE_PRICE_PRACTICE_MONTHLY) return "PRACTICE";
  if (priceId === env.STRIPE_PRICE_PRACTICE_ANNUAL) return "PRACTICE";
  if (priceId === env.STRIPE_PRICE_ACADEMY_MONTHLY) return "ACADEMY";
  if (priceId === env.STRIPE_PRICE_ACADEMY_ANNUAL) return "ACADEMY";
  return null;
}
