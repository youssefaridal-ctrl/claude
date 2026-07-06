import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { scoreAudit, AUDIT_WEIGHTS } from "@/server/services/assessments";
import { track } from "@/lib/analytics";

/**
 * The Inner Dialogue Audit — deliberately UNGATED (flow A, design/02 §7):
 * anonymous submissions are scored and stored under a one-time token so the
 * result can attach to an account created later. Value first, ask second.
 */
const submitSchema = z.object({
  answers: z.array(z.number().int().min(0).max(4)).length(AUDIT_WEIGHTS.length),
});

export const POST = createHandler(
  { auth: "optional", bodySchema: submitSchema, rateLimit: policies.assessment },
  async ({ userId, body }) => {
    const scores = scoreAudit(body.answers);
    const anonToken = userId ? null : crypto.randomUUID();

    const result = await prisma.assessmentResult.create({
      data: {
        userId,
        anonToken,
        type: "DIALOGUE_AUDIT",
        answers: body.answers,
        scores: {
          narrators: scores.narratorNormalized,
          dimensions: scores.dimensions,
        },
        dominantNarrator: scores.dominant,
        secondaryNarrator: scores.secondary,
      },
    });

    await track("audit_completed", {
      userId: userId ?? undefined,
      anonId: anonToken ?? undefined,
      props: { dominant: scores.dominant },
    });

    return Response.json(
      {
        resultId: result.id,
        anonToken, // client stores this; claimed on signup via /api/assessments/claim
        dominant: scores.dominant,
        secondary: scores.secondary,
        narrators: scores.narratorNormalized,
        dimensions: scores.dimensions,
      },
      { status: 201 },
    );
  },
);
