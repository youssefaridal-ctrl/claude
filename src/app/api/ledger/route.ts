import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { addLedgerEntry, counterEvidence } from "@/server/services/ledger";

const createSchema = z.object({
  text: z.string().min(1).max(500),
  becauseClause: z.string().max(500).optional(),
  source: z.enum(["REP", "HABIT", "CHALLENGE", "JOURNAL", "MANUAL"]).default("MANUAL"),
  themeTags: z.array(z.string().max(40)).max(8).default([]),
});

export const POST = createHandler(
  { auth: "required", bodySchema: createSchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    const entry = await addLedgerEntry(userId!, body);
    return Response.json({ entry }, { status: 201 });
  },
);

export const GET = createHandler({ auth: "required" }, async ({ userId, req }) => {
  const doubt = req.nextUrl.searchParams.get("counter");
  if (doubt) {
    // "You have N entries that disagree with that thought."
    const { entries, total } = await counterEvidence(userId!, doubt);
    return Response.json({ entries, total });
  }
  const entries = await prisma.ledgerEntry.findMany({
    where: { userId: userId! },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return Response.json({ entries });
});
