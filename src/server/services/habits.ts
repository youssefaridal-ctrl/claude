import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { toDateOnly } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { addLedgerEntry } from "@/server/services/ledger";

/**
 * Habit Tracker service — grace-based streak architecture (design/02 §9):
 * streaks count practice WEEKS (≥ targetPerWeek kept days), never day chains.
 * A missed day zeroes nothing; the vocabulary is "kept / resumed", never "broken".
 */

export interface CreateHabitInput {
  name: string;
  identityStatement: string;
  cue?: string;
  twoMinuteVersion?: string;
  targetPerWeek?: number;
}

const MAX_ACTIVE_HABITS = 12;

export async function createHabit(userId: string, input: CreateHabitInput) {
  const active = await prisma.habit.count({ where: { userId, archivedAt: null } });
  if (active >= MAX_ACTIVE_HABITS) {
    throw new ValidationError({
      reason: `A practice holds at most ${MAX_ACTIVE_HABITS} habits. Archive one to make room — depth beats breadth.`,
    });
  }
  return prisma.habit.create({
    data: {
      userId,
      name: input.name,
      identityStatement: input.identityStatement,
      cue: input.cue,
      twoMinuteVersion: input.twoMinuteVersion,
      targetPerWeek: Math.min(Math.max(input.targetPerWeek ?? 4, 1), 7),
    },
  });
}

export async function listHabits(userId: string) {
  return prisma.habit.findMany({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      logs: {
        where: { date: { gte: weeksAgo(12) } },
        orderBy: { date: "asc" },
      },
    },
  });
}

export async function logHabit(
  userId: string,
  habitId: string,
  opts: { date?: Date; status?: "KEPT" | "GRACE"; timezone?: string } = {},
) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new NotFoundError("Habit");

  const date = toDateOnly(opts.date ?? new Date(), opts.timezone);
  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date } },
    create: { habitId, date, status: opts.status ?? "KEPT" },
    update: { status: opts.status ?? "KEPT" },
  });

  if (log.status === "KEPT") {
    // Every kept habit day is evidence — the Ledger is the reward system.
    await addLedgerEntry(userId, {
      text: `Kept: ${habit.name}`,
      becauseClause: habit.identityStatement,
      source: "HABIT",
      themeTags: ["kept-promise"],
    });
    await track("habit_logged", { userId, props: { habitId } });
  }
  return log;
}

export async function unlogHabit(userId: string, habitId: string, date: Date, timezone?: string) {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw new NotFoundError("Habit");
  await prisma.habitLog.deleteMany({
    where: { habitId, date: toDateOnly(date, timezone) },
  });
}

export interface WeekState {
  weekStart: string; // ISO date (Monday)
  keptDays: number;
  target: number;
  kept: boolean;
}

/** Compute kept-week history for the banner ("2 of 4 kept this week"). */
export function computeWeekStates(
  logs: { date: Date; status: string }[],
  targetPerWeek: number,
  weeks = 12,
): WeekState[] {
  const byWeek = new Map<string, number>();
  for (const log of logs) {
    if (log.status !== "KEPT") continue;
    const monday = mondayOf(log.date);
    byWeek.set(monday, (byWeek.get(monday) ?? 0) + 1);
  }
  const out: WeekState[] = [];
  const thisMonday = mondayOf(new Date());
  for (let w = weeks - 1; w >= 0; w--) {
    const monday = shiftDays(thisMonday, -7 * w);
    const keptDays = byWeek.get(monday) ?? 0;
    out.push({ weekStart: monday, keptDays, target: targetPerWeek, kept: keptDays >= targetPerWeek });
  }
  return out;
}

function mondayOf(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
  return d.toISOString().slice(0, 10);
}

function shiftDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weeksAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n * 7);
  return toDateOnly(d);
}
