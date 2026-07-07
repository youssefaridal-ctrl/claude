import type Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { stripe, tierFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import { invalidateTierCache } from "@/server/services/subscription";
import { track } from "@/lib/analytics";

export const dynamic = "force-static";

/**
 * Stripe webhook. Signature-verified, idempotent (WebhookEvent ledger),
 * and the single source of truth for subscription state — the app never
 * mutates Subscription rows outside this handler.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const signature = req.headers.get("stripe-signature");
  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.warn({ err }, "stripe_webhook_bad_signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // Idempotency: first write wins; replays are acknowledged and skipped.
  try {
    await prisma.webhookEvent.create({ data: { id: event.id, type: event.type } });
  } catch {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break; // unhandled event types are fine — we only own subscription state
    }
  } catch (err) {
    logger.error({ err, eventType: event.type }, "stripe_webhook_processing_failed");
    // Return 500 so Stripe retries; the idempotency row is removed to allow reprocessing.
    await prisma.webhookEvent.delete({ where: { id: event.id } }).catch(() => undefined);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) {
    logger.warn({ customerId }, "stripe_webhook_unknown_customer");
    return;
  }

  const priceId = sub.items.data[0]?.price.id ?? "";
  const tier = tierFromPriceId(priceId) ?? "PRACTICE";
  const statusMap: Record<string, "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "PAUSED" | "INCOMPLETE"> = {
    active: "ACTIVE",
    trialing: "TRIALING",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    paused: "PAUSED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "CANCELED",
    unpaid: "PAST_DUE",
  };
  const status = statusMap[sub.status] ?? "INCOMPLETE";
  const periodEnd = sub.items.data[0]?.current_period_end;

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: sub.id,
      tier,
      status,
      currentPeriodEnd: new Date((periodEnd ?? Math.floor(Date.now() / 1000)) * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    update: {
      stripeSubscriptionId: sub.id,
      tier,
      status,
      currentPeriodEnd: new Date((periodEnd ?? Math.floor(Date.now() / 1000)) * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });

  await invalidateTierCache(user.id);
  await track(status === "ACTIVE" ? "subscription_activated" : "subscription_canceled", {
    userId: user.id,
    props: { tier, status },
  });
}
