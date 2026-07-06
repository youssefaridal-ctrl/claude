"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const IDENTITIES = [
  "I'm becoming someone whose voice arrives before the doubt does",
  "I'm becoming someone who keeps small promises to himself",
];

const INITIAL_MOVES = [
  { id: "m1", text: "Ask the first question in Monday's leadership sync", done: true },
  { id: "m2", text: "Draft the conference talk outline (ugly version)", done: true },
  { id: "m3", text: "One boundary script, written before Thursday", done: false },
  { id: "m4", text: "Rehearsal Room: salary conversation, twice", done: false },
];

/** Goal Planner preview: Identity → Season → Moves (design/03 §30). */
export function PlannerDemo() {
  const [moves, setMoves] = useState(INITIAL_MOVES);
  const done = moves.filter((m) => m.done).length;
  const pct = Math.round((done / moves.length) * 100);

  return (
    <div className="space-y-8">
      <section aria-label="Identity statements">
        <h2 className="eyebrow mb-3">Identity · the directions (max 3)</h2>
        <div className="space-y-3">
          {IDENTITIES.map((s) => (
            <p key={s} className="border-l-2 border-l-foreground pl-4 font-serif text-body-l italic">
              {s}
            </p>
          ))}
        </div>
      </section>

      <Card>
        <CardContent className="p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="eyebrow mb-1">Current season · weeks 1–12</h2>
              <p className="text-heading-s font-medium">“Say the true thing sooner.”</p>
            </div>
            <Badge>Week 5 of 12</Badge>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between font-mono text-label-mono text-muted-foreground">
              <span>This week&rsquo;s moves</span>
              <span aria-live="polite">{done} of {moves.length}</span>
            </div>
            <Progress value={pct} aria-label="Weekly moves progress" accent={pct === 100} />
          </div>

          <ul className="mt-6 space-y-1">
            {moves.map((m) => (
              <li key={m.id}>
                <label className="flex cursor-pointer items-center gap-1 rounded-r2 pr-3 transition-colors duration-fast hover:bg-muted">
                  <Checkbox
                    checked={m.done}
                    onChange={() =>
                      setMoves((prev) => prev.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)))
                    }
                  />
                  <span className={m.done ? "text-body-m text-muted-foreground line-through decoration-1" : "text-body-m"}>
                    {m.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {pct === 100 && (
            <p role="status" className="mt-5 font-serif text-body-l">
              Week&rsquo;s moves complete. Done is done — the rest of the week is allowed to be ordinary.
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-body-s text-muted-foreground">
        Two or three goals per season — the UI physically limits it. Every yes to a fourth goal is a no to
        the first three.
      </p>
    </div>
  );
}
