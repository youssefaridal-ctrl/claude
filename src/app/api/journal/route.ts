import { z } from "zod";
import { createHandler } from "@/lib/api";
import { policies } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { encryptForUser, decryptForUser } from "@/lib/crypto";
import { assertJournalQuota } from "@/server/services/subscription";
import { Weather } from "@prisma/client";

const createEntrySchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(50_000),
  mood: z.nativeEnum(Weather).optional(),
  tags: z.array(z.string().max(40)).max(10).default([]),
});

export const POST = createHandler(
  { auth: "required", bodySchema: createEntrySchema, rateLimit: policies.mutation },
  async ({ userId, body }) => {
    await assertJournalQuota(userId!);
    // Plaintext exists only in this request scope — encrypted before persistence,
    // redacted from logs (src/lib/logger.ts), never cached.
    const envelope = encryptForUser(userId!, body.content);
    const entry = await prisma.journalEntry.create({
      data: {
        userId: userId!,
        ciphertext: new Uint8Array(envelope.ciphertext),
        iv: new Uint8Array(envelope.iv),
        authTag: new Uint8Array(envelope.authTag),
        keyVersion: envelope.keyVersion,
        title: body.title,
        mood: body.mood,
        tags: body.tags,
        wordCount: body.content.trim().split(/\s+/).length,
      },
      select: { id: true, title: true, mood: true, tags: true, wordCount: true, createdAt: true },
    });
    return Response.json({ entry }, { status: 201 });
  },
);

export const GET = createHandler({ auth: "required" }, async ({ userId, req }) => {
  const includeContent = req.nextUrl.searchParams.get("id");
  if (includeContent) {
    const row = await prisma.journalEntry.findFirst({
      where: { id: includeContent, userId: userId!, archivedAt: null },
    });
    if (!row) return Response.json({ entry: null }, { status: 404 });
    const content = decryptForUser(userId!, {
      ciphertext: Buffer.from(row.ciphertext),
      iv: Buffer.from(row.iv),
      authTag: Buffer.from(row.authTag),
      keyVersion: row.keyVersion,
    });
    return Response.json({
      entry: {
        id: row.id,
        title: row.title,
        content,
        mood: row.mood,
        tags: row.tags,
        createdAt: row.createdAt,
      },
    });
  }
  const entries = await prisma.journalEntry.findMany({
    where: { userId: userId!, archivedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, title: true, mood: true, tags: true, wordCount: true, createdAt: true },
  });
  return Response.json({ entries });
});
