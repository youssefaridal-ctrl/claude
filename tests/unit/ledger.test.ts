import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock Prisma before any imports that use it
vi.mock("@/lib/prisma", () => ({
  prisma: {
    ledgerEntry: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    chapter: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

import { prisma } from "@/lib/prisma";
import { addLedgerEntry, counterEvidence } from "@/server/services/ledger";

const userId = "user_test_123";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("addLedgerEntry", () => {
  it("creates an entry with the provided fields", async () => {
    const entry = {
      id: "entry_1",
      userId,
      text: "Spoke up despite the nerves",
      becauseClause: "I'm someone who uses their voice",
      source: "MANUAL",
      themeTags: ["voice"],
      createdAt: new Date(),
    };
    vi.mocked(prisma.ledgerEntry.create).mockResolvedValue(entry as never);
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(1);

    const result = await addLedgerEntry(userId, {
      text: entry.text,
      becauseClause: entry.becauseClause,
      source: "MANUAL",
      themeTags: ["voice"],
    });

    expect(prisma.ledgerEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId,
          text: "Spoke up despite the nerves",
          source: "MANUAL",
        }),
      }),
    );
    expect(result.text).toBe("Spoke up despite the nerves");
  });

  it("defaults source to MANUAL when not provided", async () => {
    const entry = { id: "e1", userId, text: "t", source: "MANUAL", themeTags: [], createdAt: new Date() };
    vi.mocked(prisma.ledgerEntry.create).mockResolvedValue(entry as never);
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(1);

    await addLedgerEntry(userId, { text: "t" });

    expect(prisma.ledgerEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ source: "MANUAL" }) }),
    );
  });

  it("closes a chapter when REP count hits a multiple of 30", async () => {
    const entry = { id: "e1", userId, text: "rep done", source: "REP", themeTags: [], createdAt: new Date() };
    vi.mocked(prisma.ledgerEntry.create).mockResolvedValue(entry as never);
    // repCount = 30 → chapter should close
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(30);
    vi.mocked(prisma.chapter.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.ledgerEntry.findMany).mockResolvedValue(
      Array.from({ length: 30 }, (_, i) => ({
        text: `rep ${i}`,
        becauseClause: null,
        createdAt: new Date(),
      })) as never,
    );
    vi.mocked(prisma.chapter.create).mockResolvedValue({} as never);
    vi.mocked(prisma.notification.create).mockResolvedValue({} as never);

    await addLedgerEntry(userId, { text: "rep done", source: "REP" });

    expect(prisma.chapter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId, number: 1 }),
      }),
    );
    expect(prisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: "CHAPTER_CLOSED" }),
      }),
    );
  });

  it("does not create a duplicate chapter if one already exists for that number", async () => {
    const entry = { id: "e1", userId, text: "rep", source: "REP", themeTags: [], createdAt: new Date() };
    vi.mocked(prisma.ledgerEntry.create).mockResolvedValue(entry as never);
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(60);
    vi.mocked(prisma.chapter.findUnique).mockResolvedValue({ id: "ch_existing" } as never);

    await addLedgerEntry(userId, { text: "rep", source: "REP" });

    expect(prisma.chapter.create).not.toHaveBeenCalled();
  });
});

describe("counterEvidence", () => {
  it("returns entries matching the doubt terms", async () => {
    const mockEntries = [
      { id: "e1", text: "I spoke up in the meeting", source: "REP", themeTags: [] },
    ];
    vi.mocked(prisma.ledgerEntry.findMany).mockResolvedValue(mockEntries as never);
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(42);

    const { entries, total } = await counterEvidence(userId, "speaking up");

    expect(prisma.ledgerEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
    expect(entries).toEqual(mockEntries);
    expect(total).toBe(42);
  });

  it("filters out short tokens (≤3 chars) from the doubt", async () => {
    vi.mocked(prisma.ledgerEntry.findMany).mockResolvedValue([]);
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(0);

    // "perform" (7) and "badly" (5) survive; "i" (1) and "am" (2) are dropped.
    // "bad" (3) is also dropped — the condition is strictly > 3.
    await counterEvidence(userId, "I perform badly");

    const call = vi.mocked(prisma.ledgerEntry.findMany).mock.calls[0]![0] as {
      where: { OR: unknown[] };
    };
    const or = call.where.OR as Array<{ text?: { contains: string } }>;
    const terms = or.filter((c) => c.text).map((c) => c.text!.contains);
    expect(terms).toContain("perform");
    expect(terms).toContain("badly");
    expect(terms).not.toContain("am");
    expect(terms).not.toContain("i");
  });

  it("respects the limit parameter", async () => {
    vi.mocked(prisma.ledgerEntry.findMany).mockResolvedValue([]);
    vi.mocked(prisma.ledgerEntry.count).mockResolvedValue(0);

    await counterEvidence(userId, "doubt about performance", 5);

    expect(prisma.ledgerEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });
});
