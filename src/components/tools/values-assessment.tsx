"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VALUES = [
  "Authenticity", "Courage", "Creativity", "Curiosity", "Depth",
  "Excellence", "Fairness", "Freedom", "Growth", "Honesty",
  "Humor", "Impact", "Independence", "Integrity", "Intimacy",
  "Justice", "Kindness", "Leadership", "Learning", "Loyalty",
  "Mastery", "Meaning", "Openness", "Presence", "Purpose",
  "Resilience", "Responsibility", "Security", "Service", "Solitude",
  "Spontaneity", "Stability", "Trust", "Truth", "Vitality",
] as const;

type Value = (typeof VALUES)[number];
type Phase = "pick" | "top5" | "done";

const MAX_FIRST = 10;
const MAX_FINAL = 5;

export function ValuesAssessment() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [first, setFirst] = useState<Set<Value>>(new Set());
  const [final, setFinal] = useState<Set<Value>>(new Set());

  function toggleFirst(v: Value) {
    setFirst((s) => {
      const n = new Set(s);
      if (n.has(v)) { n.delete(v); return n; }
      if (n.size >= MAX_FIRST) return s;
      n.add(v);
      return n;
    });
  }

  function toggleFinal(v: Value) {
    setFinal((s) => {
      const n = new Set(s);
      if (n.has(v)) { n.delete(v); return n; }
      if (n.size >= MAX_FINAL) return s;
      n.add(v);
      return n;
    });
  }

  if (phase === "done") {
    const list = [...final];
    return (
      <div className="space-y-6">
        <div>
          <p className="eyebrow mb-2">Your five core values</p>
          <div className="flex flex-wrap gap-2">
            {list.map((v) => (
              <Badge key={v} variant="solar" className="text-body-s">{v}</Badge>
            ))}
          </div>
        </div>
        <p className="text-body-m text-muted-foreground">
          These are the values that recur when your confidence is lowest — they're both the wound and the compass.
          When a situation feels wrong, one of these is usually being violated.
        </p>
        <div className="rounded-r3 bg-card p-5 text-body-s text-muted-foreground">
          <p className="font-medium text-foreground">What to do with this</p>
          <p className="mt-2">
            Write one sentence per value: the last time it was honored, and the last time it was ignored.
            The gap between those sentences is usually where the confidence work lives.
          </p>
        </div>
        <Button variant="secondary" size="compact" onClick={() => { setPhase("pick"); setFirst(new Set()); setFinal(new Set()); }}>
          Start over
        </Button>
      </div>
    );
  }

  if (phase === "top5") {
    return (
      <div className="space-y-6">
        <div>
          <p className="eyebrow mb-2">Round 2 of 2</p>
          <p className="text-body-m">From your ten, choose the five that feel most <em>like you</em> — not the ones you aspire to, the ones that already govern how you feel when violated.</p>
          <p className="mt-1 font-mono text-label-mono text-muted-foreground">{final.size} / {MAX_FINAL} selected</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...first].map((v) => (
            <button
              key={v}
              onClick={() => toggleFinal(v)}
              className={`rounded-full border px-4 py-2 font-mono text-label-mono uppercase transition-colors ${
                final.has(v)
                  ? "border-solar-500 bg-solar-500/10 text-solar-600 dark:text-solar-400"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              } ${!final.has(v) && final.size >= MAX_FINAL ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
              aria-pressed={final.has(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <Button disabled={final.size < MAX_FINAL} onClick={() => setPhase("done")}>
          {final.size < MAX_FINAL ? `Select ${MAX_FINAL - final.size} more` : "See my values"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Round 1 of 2</p>
        <p className="text-body-m">Choose ten values that resonate — don't overthink, go with the first pull.</p>
        <p className="mt-1 font-mono text-label-mono text-muted-foreground">{first.size} / {MAX_FIRST} selected</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {VALUES.map((v) => (
          <button
            key={v}
            onClick={() => toggleFirst(v)}
            className={`rounded-full border px-4 py-2 font-mono text-label-mono uppercase transition-colors ${
              first.has(v)
                ? "border-solar-500 bg-solar-500/10 text-solar-600 dark:text-solar-400"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            } ${!first.has(v) && first.size >= MAX_FIRST ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
            aria-pressed={first.has(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <Button disabled={first.size < MAX_FIRST} onClick={() => setPhase("top5")}>
        {first.size < MAX_FIRST ? `Select ${MAX_FIRST - first.size} more` : "Next: choose five"}
      </Button>
    </div>
  );
}
