import { LedgerSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { track } from "@/lib/analytics";

/**
 * The Identity Ledger — the platform's core gamification mechanic:
 * evidence, not points (design/02 §9). Chapters close every 30 REP-sourced
 * entries with a generated recap; there are no XP totals and no leaderboards,
 * by explicit product rule.
 */

const CHAPTER_SIZE = 30;

export interface LedgerInput {
  text: string;
  becauseClause?: string;
  source?: LedgerSource;
  themeTags?: string[];
}

export async function addLedgerEntry(userId: string, input: LedgerInput) {
  const entry = await prisma.ledgerEntry.create({
    data: {
      userId,
      text: input.text,
      becauseClause: input.becauseClause,
      source: input.source ?? "MANUAL",
      themeTags: input.themeTags ?? [],
    },
  });
  await track("ledger_entry_created", { userId, props: { source: entry.source } });

  if (entry.source === "REP") await maybeCloseChapter(userId);
  return entry;
}

/**
 * "Counter-evidence search": given a doubt, return the member's own entries
 * that complicate it. Simple keyword match at launch; the tsvector column on a
 * dedicated migration upgrades this to ranked FTS without an API change.
 */
export async function counterEvidence(userId: string, doubt: string, limit = 10) {
  const terms = doubt
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 3);
  const entries = await prisma.ledgerEntry.findMany({
    where: {
      userId,
      OR: [
        ...terms.map((t) => ({ text: { contains: t, mode: "insensitive" as const } })),
        { themeTags: { hasSome: terms } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  const total = await prisma.ledgerEntry.count({ where: { userId } });
  return { entries, total };
}

async function maybeCloseChapter(userId: string): Promise<void> {
  const repCount = await prisma.ledgerEntry.count({ where: { userId, source: "REP" } });
  if (repCount === 0 || repCount % CHAPTER_SIZE !== 0) return;

  const number = repCount / CHAPTER_SIZE;
  const existing = await prisma.chapter.findUnique({
    where: { userId_number: { userId, number } },
  });
  if (existing) return;

  const recentEntries = await prisma.ledgerEntry.findMany({
    where: { userId, source: "REP" },
    orderBy: { createdAt: "desc" },
    take: CHAPTER_SIZE,
    select: { text: true, becauseClause: true, createdAt: true },
  });

  await prisma.chapter.create({
    data: {
      userId,
      number,
      recap: {
        title: `Chapter ${number}`,
        period: {
          from: recentEntries.at(-1)?.createdAt,
          to: recentEntries[0]?.createdAt,
        },
        // The recap page typesets the member's own words (design/02 §9).
        highlights: recentEntries.slice(0, 6).map((e) => e.text),
      },
    },
  });
  await prisma.notification.create({
    data: {
      userId,
      type: "CHAPTER_CLOSED",
      title: `Chapter ${number} is closed.`,
      body: "Thirty reps, in your own words. The recap is ready when you are.",
      href: "/progress",
    },
  });
  await track("chapter_closed", { userId, props: { number } });
}
