"use client";

import { useState } from "react";
import { previewHabits } from "@/lib/mock";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_INDEX = 4; // prototype fixes "today" mid-week so future days demo the disabled state

/** Local-state Habit Tracker preview: same anatomy as the wired HabitWeek. */
export function TrackerDemo() {
  const [state, setState] = useState(
    previewHabits.map((h) => ({ ...h, keptDays: new Set<number>(h.kept) })),
  );

  function toggle(habitIndex: number, day: number) {
    setState((prev) =>
      prev.map((h, i) => {
        if (i !== habitIndex) return h;
        const next = new Set(h.keptDays);
        if (next.has(day)) next.delete(day);
        else next.add(day);
        return { ...h, keptDays: next };
      }),
    );
  }

  return (
    <div className="space-y-6">
      {state.map((habit, hi) => (
        <Card key={habit.id}>
          <CardContent className="p-6">
            <p className="mb-1 font-serif text-body-s italic text-muted-foreground">{habit.identity}</p>
            <div className="flex items-center justify-between">
              <h2 className="text-body-m font-medium">{habit.name}</h2>
              <p className="font-mono text-label-mono text-muted-foreground" aria-live="polite">
                {habit.keptDays.size} of {habit.target} this week
                {habit.keptDays.size >= habit.target && " · kept ✓"}
              </p>
            </div>
            <div role="group" aria-label={`${habit.name} — this week`} className="mt-3 flex gap-2">
              {DAYS.map((label, day) => {
                const kept = habit.keptDays.has(day);
                const future = day > TODAY_INDEX;
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={future}
                    aria-pressed={kept}
                    aria-label={`${label}: ${kept ? "kept" : "not logged"}`}
                    onClick={() => toggle(hi, day)}
                    className={cn(
                      "flex h-11 w-11 flex-col items-center justify-center rounded-full border transition-all duration-fast",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      kept
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground",
                      future && "cursor-default opacity-30",
                    )}
                  >
                    <span className="font-mono text-[10px] uppercase" aria-hidden>{label}</span>
                    <span aria-hidden>{kept ? "●" : "○"}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      <p className="text-body-s text-muted-foreground">
        Notice: unchecking a day changes a count, never a color. Nothing here can turn red — that's
        structural, not cosmetic.
      </p>
    </div>
  );
}
