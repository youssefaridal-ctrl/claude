"use client";

import { useOptimistic, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive week row for one habit. Dots, never checkmarks; missed days are
 * hollow, never red (design/03 §28). Optimistic updates with server
 * reconciliation; full keyboard operation (toggle = Enter/Space on each day).
 */

export interface DayState {
  date: string; // ISO yyyy-mm-dd
  label: string; // "Mon"
  kept: boolean;
  isFuture: boolean;
}

export function HabitWeek({
  habitId,
  habitName,
  days,
  target,
}: {
  habitId: string;
  habitName: string;
  days: DayState[];
  target: number;
}) {
  const [serverDays, setServerDays] = useState(days);
  const [optimisticDays, applyOptimistic] = useOptimistic(
    serverDays,
    (state, date: string) => state.map((d) => (d.date === date ? { ...d, kept: !d.kept } : d)),
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const keptCount = optimisticDays.filter((d) => d.kept).length;

  function toggle(day: DayState) {
    if (day.isFuture) return;
    setError(null);
    startTransition(async () => {
      applyOptimistic(day.date);
      try {
        const res = await fetch(`/api/habits/${habitId}/logs`, {
          method: day.kept ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: day.date }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setServerDays((prev) =>
          prev.map((d) => (d.date === day.date ? { ...d, kept: !day.kept } : d)),
        );
      } catch {
        setError("That didn't save — our side, not yours. Try once more.");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-body-m font-medium">{habitName}</h3>
        <p className="font-mono text-label-mono text-muted-foreground" aria-live="polite">
          {keptCount} of {target} this week
        </p>
      </div>
      <div role="group" aria-label={`${habitName} — this week`} className="mt-3 flex gap-2">
        {optimisticDays.map((day) => (
          <button
            key={day.date}
            type="button"
            disabled={day.isFuture}
            aria-pressed={day.kept}
            aria-label={`${day.label} ${day.date}: ${day.kept ? "kept" : "not logged"}`}
            onClick={() => toggle(day)}
            className={cn(
              "flex h-11 w-11 flex-col items-center justify-center rounded-full border transition-all duration-fast",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              day.kept
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:border-foreground",
              day.isFuture && "cursor-default opacity-30",
            )}
          >
            <span className="text-[10px] font-mono uppercase" aria-hidden>
              {day.label}
            </span>
            <span aria-hidden>{day.kept ? "●" : "○"}</span>
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-body-s text-attention">
          {error}
        </p>
      )}
    </div>
  );
}
