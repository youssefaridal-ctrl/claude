import { describe, expect, it } from "vitest";
import { computeWeekStates } from "@/server/services/habits";

describe("computeWeekStates — grace-based streaks", () => {
  it("marks a week kept at >= target days, regardless of which days", () => {
    // 4 kept days scattered across this week (Mon/Tue/Thu/Sat pattern).
    const monday = currentMonday();
    const logs = [0, 1, 3, 5].map((offset) => ({
      date: addDays(monday, offset),
      status: "KEPT",
    }));
    const weeks = computeWeekStates(logs, 4, 1);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]!.keptDays).toBe(4);
    expect(weeks[0]!.kept).toBe(true);
  });

  it("a missed day never zeroes anything — 3 of 4 is 3 of 4, not failure", () => {
    const monday = currentMonday();
    const logs = [0, 1, 2].map((offset) => ({ date: addDays(monday, offset), status: "KEPT" }));
    const weeks = computeWeekStates(logs, 4, 1);
    expect(weeks[0]!.keptDays).toBe(3);
    expect(weeks[0]!.kept).toBe(false);
  });

  it("GRACE days do not count toward kept totals", () => {
    const monday = currentMonday();
    const logs = [
      { date: addDays(monday, 0), status: "KEPT" },
      { date: addDays(monday, 1), status: "GRACE" },
    ];
    expect(computeWeekStates(logs, 4, 1)[0]!.keptDays).toBe(1);
  });

  it("returns the requested number of weeks, oldest first", () => {
    const weeks = computeWeekStates([], 4, 12);
    expect(weeks).toHaveLength(12);
    expect(weeks[0]!.weekStart < weeks[11]!.weekStart).toBe(true);
  });
});

function currentMonday(): Date {
  const d = new Date();
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  utc.setUTCDate(utc.getUTCDate() - ((utc.getUTCDay() + 6) % 7));
  return utc;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}
