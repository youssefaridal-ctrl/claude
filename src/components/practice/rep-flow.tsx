"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";

type Phase = "intro" | "quote" | "distance" | "rewrite" | "done";

const DISTANCE_PREAMBLE = "I'm having the thought that";

export function RepFlow() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [quote, setQuote] = useState("");
  const [rewrite, setRewrite] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anim = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: 0.28 },
  };

  const saveToLedger = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const normalised = quote.trim().replace(/^[""""]|[""""]$/g, "");
      // Two entries: the rewrite is the evidence; the original is the context.
      await Promise.all([
        fetch("/api/ledger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: rewrite.trim(),
            becauseClause: `Rewrite of: "${normalised}"`,
            source: "REP",
            themeTags: ["reappraisal", "second-draft"],
          }),
        }),
      ]);
      setPhase("done");
    } catch {
      setError("That didn't save — our side, not yours. Your words are worth keeping. Try once more.");
    } finally {
      setSaving(false);
    }
  }, [quote, rewrite]);

  return (
    <div className="mx-auto max-w-xl">
      <AnimatePresence mode="wait">

        {phase === "intro" && (
          <motion.div key="intro" {...anim} className="text-center">
            <p className="eyebrow mb-4">Today&rsquo;s rep</p>
            <h1 className="font-serif text-display-m font-medium">The Second Draft</h1>
            <p className="mt-6 text-body-l text-muted-foreground">
              Take today&rsquo;s harshest inner line, get some distance from it,
              then rewrite it at believability seven. Both go to your Ledger.
              The pair is the progress.
            </p>
            <p className="mt-4 text-body-s text-muted-foreground">~4 minutes</p>
            <Button className="mt-8" onClick={() => setPhase("quote")}>
              Begin rep
            </Button>
          </motion.div>
        )}

        {phase === "quote" && (
          <motion.div key="quote" {...anim}>
            <p className="eyebrow mb-6">Step 1 of 3 · Quote it</p>
            <Label htmlFor="rep-quote" className="text-heading-s font-medium">
              What did the narrator say today?
            </Label>
            <p className="mb-4 mt-2 text-body-m text-muted-foreground">
              Verbatim — ugly grammar and all. You can&rsquo;t rewrite a line you haven&rsquo;t named.
            </p>
            <Textarea
              id="rep-quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="&quot;You're going to embarrass yourself.&quot;"
              rows={4}
              className="font-serif text-body-l"
              aria-describedby="quote-hint"
            />
            <p id="quote-hint" className="mt-2 text-body-s text-muted-foreground">
              Honest answers beat impressive ones.
            </p>
            <Button
              className="mt-6"
              disabled={!quote.trim()}
              onClick={() => setPhase("distance")}
            >
              Next
            </Button>
          </motion.div>
        )}

        {phase === "distance" && (
          <motion.div key="distance" {...anim}>
            <p className="eyebrow mb-6">Step 2 of 3 · Distance it</p>
            <p className="text-body-m text-muted-foreground">Read this once, out loud if you can:</p>
            <blockquote
              aria-live="polite"
              className="mt-6 rounded-r3 border border-border bg-card p-6 font-serif text-serif-feature"
            >
              &ldquo;{DISTANCE_PREAMBLE}{" "}
              {quote.trim().replace(/^[""""]|[""""]$/g, "")}&rdquo;
            </blockquote>
            <p className="mt-6 text-body-m text-muted-foreground">
              Same words — different altitude. The thought is weather now, not fact. It&rsquo;s yours
              to carry or put down.
            </p>
            <Button className="mt-8" onClick={() => setPhase("rewrite")}>
              Next
            </Button>
          </motion.div>
        )}

        {phase === "rewrite" && (
          <motion.div key="rewrite" {...anim}>
            <p className="eyebrow mb-6">Step 3 of 3 · Rewrite it</p>
            <Label htmlFor="rep-rewrite" className="text-heading-s font-medium">
              Write the second draft.
            </Label>
            <p className="mb-4 mt-2 text-body-m text-muted-foreground">
              Not the affirmation you wish were true — the version you can believe at seven out of ten.
              Honest beats perfect.
            </p>
            <Textarea
              id="rep-rewrite"
              value={rewrite}
              onChange={(e) => setRewrite(e.target.value)}
              placeholder="I'm nervous, and nervous means I care. That's not evidence of failure."
              rows={4}
              className="font-serif text-body-l"
            />
            {error && (
              <p role="alert" className="mt-3 text-body-s text-attention">{error}</p>
            )}
            <Button
              className="mt-6"
              disabled={!rewrite.trim() || saving}
              onClick={saveToLedger}
            >
              {saving ? "Saving to Ledger…" : "File it — done is done"}
            </Button>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" {...anim} className="text-center">
            <p className="font-mono text-label-mono uppercase text-muted-foreground">Rep complete</p>
            <p className="mt-6 font-serif text-display-m">Done is done.</p>
            <div className="mt-6 rounded-r3 border border-border bg-card p-6 text-left">
              <p className="eyebrow mb-3">Filed to your Ledger</p>
              <p className="font-serif text-body-l text-muted-foreground">&ldquo;{rewrite.trim()}&rdquo;</p>
            </div>
            <p className="mt-6 text-body-m text-muted-foreground">
              The second draft is evidence. Thirty reps and a Chapter closes — your words, typeset.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setPhase("intro");
                  setQuote("");
                  setRewrite("");
                  setError(null);
                }}
              >
                Another rep
              </Button>
              <a href="/ledger" className="text-body-s text-accent underline-offset-4 hover:underline">
                View your Ledger →
              </a>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
