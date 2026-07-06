"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

/**
 * The live rewrite demo (design/03 §3.4) — the Method page's signature
 * interaction. A harsh sentence transformed by the three Rewrite operations,
 * each naming its mechanism. "This demo IS the product pitch."
 */

const STEPS = [
  {
    op: "Start",
    mechanism: "the raw thought",
    sentence: "“I always freeze in meetings.”",
    note: "The narrator serves this as a fact. Watch what three operations do to it.",
  },
  {
    op: "Distance",
    mechanism: "self-distancing · Kross et al.",
    sentence: "“I'm having the thought that I'll freeze in meetings.”",
    note: "The thought becomes weather, not fact. Naming it as a thought is already regulation.",
  },
  {
    op: "Evidence",
    mechanism: "cognitive restructuring",
    sentence: "“I froze twice last quarter — and spoke up in eleven other meetings, including the hard one on Tuesday.”",
    note: "Not positive thinking — accurate thinking. The critic hates accuracy.",
  },
  {
    op: "Author",
    mechanism: "believability 7+ · your dialect",
    sentence: "“I've done hard rooms before. I can do this one at 80% — and 80% is enough.”",
    note: "A sentence that survives your own cross-examination. That's the voice you practice.",
  },
] as const;

export function RewriteDemo() {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  const current = STEPS[step]!;

  return (
    <div className="rounded-r4 border border-border bg-card p-8 shadow-elev-1">
      <p className="eyebrow mb-6">Try the Rewrite — live</p>

      <div className="min-h-28" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-serif text-serif-feature">{current.sentence}</p>
            <p className="mt-3 text-body-s text-muted-foreground">{current.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3" role="group" aria-label="Rewrite operations">
        {STEPS.map((s, i) => (
          <button
            key={s.op}
            type="button"
            onClick={() => setStep(i)}
            aria-pressed={step === i}
            className={`min-h-11 rounded-r2 border px-4 text-body-s transition-all duration-fast
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
              ${step === i ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
          >
            {i === 0 ? "Reset" : `${i} · ${s.op}`}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Badge>{current.mechanism}</Badge>
      </div>
    </div>
  );
}
