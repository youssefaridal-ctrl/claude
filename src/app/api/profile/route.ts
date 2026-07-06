import { z } from "zod";
import { createHandler } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { policies } from "@/lib/rate-limit";

const bodySchema = z.object({
  name: z.string().max(80).optional(),
  timezone: z.string().max(64).optional(),
});

export const PUT = createHandler(
  { auth: "required", bodySchema, rateLimit: policies.mutation },
  async ({ body, userId }) => {
    const { name, timezone } = body;

    await prisma.$transaction([
      ...(name !== undefined
        ? [prisma.user.update({ where: { id: userId! }, data: { name } })]
        : []),
      ...(timezone !== undefined
        ? [prisma.profile.upsert({
            where: { userId: userId! },
            create: { userId: userId!, timezone },
            update: { timezone },
          })]
        : []),
    ]);

    return Response.json({ ok: true });
  },
);
