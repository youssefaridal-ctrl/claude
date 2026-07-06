import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { track } from "@/lib/analytics";

/** Attach an anonymous Audit result to the freshly created account. */
const claimSchema = z.object({ anonToken: z.string().uuid() });

export const POST = createHandler(
  { auth: "required", bodySchema: claimSchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    const result = await prisma.assessmentResult.updateMany({
      where: { anonToken: body.anonToken, userId: null },
      data: { userId, anonToken: null },
    });
    if (result.count > 0) {
      await track("audit_result_saved", { userId: userId! });
    }
    return Response.json({ claimed: result.count > 0 });
  },
);
