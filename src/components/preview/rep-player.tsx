"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * The rep experience, prototyped (design/03 §27): The Second Draft in four
 * steps, ending in the ledger file-away and "Done is done." In-memory only.
 */

type Phase = "intro" | "quote" | "distance" | "rewrite" | "done";

export function RepPlayer() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [quote, setQuote] = useState("");
  const [rewrite, setRewrite] = useState("");
  const reduced = useReducedMotion();

  const anim = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted">
      <CardHeader>
        <p className="eyebrow">Today&rsquo;s rep · 4 min · reappraisal</p>
        <CardTitle>The Second Draft</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" {...anim}>
              <p className="text-body-m text-muted-foreground">
                Take today&rsquo;s harshest line, get some distance from it, and rewrite it at believability
                seven. Both drafts go to your Ledger — the pair is the progress.
              </p>
              <Button className="mt-6" onClick={() => setPhase("quote")}>Begin rep</Button>
            </motion.div>
          )}

          {phase === "quote" && (
            <motion.div key="quote" {...anim}>
              <p className="eyebrow mb-3">Step 1 of 3 · Quote it</p>
              <Label htmlFor="rep-quote">
                What did the narrator say today? Verbatim — ugly grammar and all.
              </Label>
              <Textarea
                id="rep-quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder='"You're going to…"'
                className="font-serif"
              />
              <Button className="mt-4" disabled={!quote.trim()} onClick={() => setPhase("distance")}>
                Next
              </Button>
            </motion.div>
          )}

          {phase === "distance" && (
            <motion.div key="distance" {...anim} aria-live="polite">
              <p className="eyebrow mb-3">Step 2 of 3 · Distance it</p>
              <p className="text-body-m text-muted-foreground">Read this once, slowly:</p>
              <p className="mt-4 font-serif text-serif-feature">
                "I&rsquo;m having the thought that {quote.trim().replace(/^[""]|[""]$/g, "")}"
              </p>
              <p className="mt-4 text-body-s text-muted-foreground">
                Same words — different altitude. The thought becomes weather, not fact.
              </p>
              <Button className="mt-6" onClick={() => setPhase("rewrite")}>Next</Button>
            </motion.div>
          )}

          {phase === "rewrite" && (
            <motion.div key="rewrite" {...anim}>
              <p className="eyebrow mb-3">Step 3 of 3 · Rewrite it</p>
              <Label htmlFor="rep-rewrite">
                The second draft — in your dialect, anchored in one fact, believability 7 or better.
              </Label>
              <Textarea
                id="rep-rewrite"
                value={rewrite}
                onChange={(e) => setRewrite(e.target.value)}
                placeholder='"I've done hard rooms before…"'
                className="font-serif"
              />
              <Button className="mt-4" disabled={!rewrite.trim()} onClick={() => setPhase("done")}>
                File it in the Ledger
              </Button>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done" {...anim} className="text-center" role="status">
              <motion.div
                initial={reduced ? {} : { scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="rounded-r3 border border-solar-500/40 bg-background p-6 shadow-glow-solar"
              >
                <p className="font-serif text-serif-feature">"{rewrite.trim()}"</p>
                <Badge variant="solar" className="mt-4">Filed · Identity Ledger</Badge>
              </motion.div>
              <p className="mt-8 font-serif text-serif-feature">Done is done.</p>
              <p className="mt-2 text-body-s text-muted-foreground">
                Tomorrow: Evidence Sprint, 3 min. It&rsquo;s already scheduled — nothing to remember.
              </p>
              <Button
                variant="ghost"
                size="compact"
                className="mt-6"
                onClick={() => {
                  setQuote("");
                  setRewrite("");
                  setPhase("intro");
                }}
              >
                Run it again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
