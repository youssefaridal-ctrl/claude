import { z } from "zod";
import { createHandler } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { policies } from "@/lib/rate-limit";

const bodySchema = z.object({ email: z.string().email() });

export const POST = createHandler({ bodySchema, rateLimit: policies.mutation }, async ({ body }) => {
  await prisma.newsletterSubscriber.upsert({
    where: { email: body.email },
    create: { email: body.email },
    update: {},
  });

  return Response.json({ ok: true });
});
