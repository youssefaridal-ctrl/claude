import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { Weather } from "@prisma/client";

const BODY_AREAS = ["head", "jaw", "chest", "stomach", "shoulders", "everywhere", "unsure"] as const;
const NEEDS = ["rest", "food", "movement", "people", "quiet", "to-say-something"] as const;

const createMoodSchema = z.object({
  weather: z.nativeEnum(Weather),
  bodyAreas: z.array(z.enum(BODY_AREAS)).max(7).default([]),
  need: z.enum(NEEDS).optional(),
  note: z.string().max(500).optional(),
});

export const POST = createHandler(
  { auth: "required", bodySchema: createMoodSchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    const entry = await prisma.moodEntry.create({
      data: { userId: userId!, ...body },
    });
    return Response.json({ entry }, { status: 201 });
  },
);

export const GET = createHandler({ auth: "required" }, async ({ userId, req }) => {
  const days = Math.min(Number(req.nextUrl.searchParams.get("days") ?? 30), 90);
  const since = new Date(Date.now() - days * 86_400_000);
  const entries = await prisma.moodEntry.findMany({
    where: { userId: userId!, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });
  // Honest-caveat flag mirrors the product copy: patterns need a month.
  return Response.json({ entries, patternConfidence: days >= 28 ? "pattern" : "weather" });
});
