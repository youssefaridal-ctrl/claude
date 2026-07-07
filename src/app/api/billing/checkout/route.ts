import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { stripe, priceIdFor } from "@/lib/stripe";
import { appUrl } from "@/env";
import { ValidationError } from "@/lib/errors";
import { track } from "@/lib/analytics";

export const dynamic = "force-static";

const checkoutSchema = z.object({
  tier: z.enum(["PRACTICE", "ACADEMY"]),
  interval: z.enum(["monthly", "annual"]),
});

export const POST = createHandler(
  { auth: "required", bodySchema: checkoutSchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    const priceId = priceIdFor(body.tier, body.interval);
    if (!priceId) throw new ValidationError({ reason: "Unknown plan." });

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId! } });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      // Two steps max (design/03 §21); no coercion on the far side either.
      success_url: `${appUrl}/today?welcome=1`,
      cancel_url: `${appUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: { userId: user.id, tier: body.tier },
    });

    await track("checkout_started", { userId: userId!, props: { tier: body.tier } });
    return Response.json({ url: session.url });
  },
);
