"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * The Inner Dialogue Audit (content/07 §3, design/03 §14a).
 * T4 distraction-free flow: one statement per screen, keyboard 1–5, progress
 * counter, autosave to localStorage, results before any email ask.
 */

const ITEMS = [
  "When something goes well, my first thought is that I got lucky.",
  "Before I speak in a group, I test the sentence for stupidity.",
  "After social events, I run a highlight reel of my mistakes.",
  "I downplay wants so I won't be disappointed.",
  "I feel responsible for the moods of people around me.",
  "Taking up space — time, attention, airtime — feels like a debt I'll owe.",
  "When I imagine trying something new, I picture how it fails first.",
  '"Good enough" feels like a euphemism for failure.',
  "I'd rather not try than try and be seen struggling.",
  "Old mistakes still get called as witnesses against me, years later.",
  "I agree to things mid-sentence and regret them by the end of the sentence.",
  "Compliments feel like errors that will be corrected soon.",
] as const;

const SCALE = ["Never", "Rarely", "Sometimes", "Often", "Always"] as const;

const NARRATOR_COPY: Record<string, { name: string; core: string; work: string }> = {
  PERFECTIONIST: {
    name: "The Perfectionist",
    core: `"If it's not flawless, it's failure."`,
    work: "The work is not lowering your standards — it's writing them down. Undefined standards are unfalsifiable; written ones are meetable, and met standards are how evidence gets in.",
  },
  GUARD: {
    name: "The Guard",
    core: `"Don't try, and you can't lose."`,
    work: "The Guard sells protection and delivers smallness. The work is graded thresholds — doors small enough to walk through today, logged as evidence the danger has expired.",
  },
  GHOST: {
    name: "The Ghost",
    core: `"Take up less space."`,
    work: "Learned invisibility, performed as politeness. The work is the Visibility Ladder: eight rungs from one question in a small meeting to a voice the room can count on.",
  },
  PROSECUTOR: {
    name: "The Prosecutor",
    core: `"Let's review everything you did wrong."`,
    work: "The 2 a.m. tribunal convenes for unprocessed charges. The work is the adjournment protocol: hold court once, on paper, at a decent hour — and file or dismiss every charge.",
  },
  PLEASER: {
    name: "The Pleaser",
    core: `"Keep them happy and you'll be safe."`,
    work: `The work is boundary scripts in your own dialect, rehearsed before you need them — because "no" is a sentence you can prepare.`,
  },
  PROPHET: {
    name: "The Prophet",
    core: `"This will go badly. It always does."`,
    work: `Forecasts of pain, dressed as realism. The work is prediction-vs-actual tracking: write the forecast down, run the moment, score the Prophet's accuracy. It's lower than it sounds.`,
  },
};

const STORAGE_KEY = "selv.audit.v1";

interface AuditResult {
  dominant: string;
  secondary: string;
  narrators: Record<string, number>;
  anonToken: string | null;
}

export function AuditFlow() {
  const reduced = useReducedMotion();
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume an interrupted audit.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as number[];
        if (Array.isArray(parsed) && parsed.length < ITEMS.length) {
          setAnswers(parsed);
          setStep(parsed.length);
        }
      }
    } catch {
      // localStorage unavailable — proceed fresh
    }
  }, []);

  const submit = useCallback(async (finalAnswers: number[]) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/assessments/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as AuditResult;
      setResult(data);
      localStorage.removeItem(STORAGE_KEY);
      if (data.anonToken) localStorage.setItem("selv.audit.token", data.anonToken);
    } catch {
      setError("Something went wrong on our side — not yours. Your answers are safe; try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  const answer = useCallback(
    (value: number) => {
      const next = [...answers];
      next[step] = value;
      setAnswers(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // non-fatal
      }
      if (step + 1 < ITEMS.length) {
        setStep(step + 1);
      } else {
        void submit(next);
      }
    },
    [answers, step, submit],
  );

  // Keyboard 1–5 (design/03 §14a: keyboard-first).
  useEffect(() => {
    if (result) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 5) answer(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, result]);

  if (result) {
    const copy = NARRATOR_COPY[result.dominant];
    const secondaryCopy = NARRATOR_COPY[result.secondary];
    return (
      <div className="mx-auto max-w-2xl py-16">
        <p className="eyebrow mb-4">Your dialogue profile</p>
        <h1 className="text-display-m font-medium">
          Your dominant narrator: <span className="text-accent">{copy?.name}</span>
        </h1>
        <p className="mt-6 font-serif text-serif-feature italic">{copy?.core}</p>
        <p className="mt-6 text-body-l text-muted-foreground">{copy?.work}</p>
        {secondaryCopy && (
          <p className="mt-4 text-body-s text-muted-foreground">
            Supporting cast: {secondaryCopy.name} — they work shifts.
          </p>
        )}
        <div className="mt-10 rounded-r3 border border-border bg-card p-6">
          <h2 className="text-heading-s font-medium">Keep this profile</h2>
          <p className="mt-2 text-body-s text-muted-foreground">
            Save it to an account and get your 7-day First Rep plan — one exercise a day, matched to your
            narrator. Or just screenshot it. Both are allowed.
          </p>
          <Button asChild className="mt-4">
            <a href="/signin?from=audit">Save my profile</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center py-16">
      <p className="eyebrow mb-10 text-center" aria-live="polite">
        {String(step + 1).padStart(2, "0")} / {ITEMS.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.fieldset
          key={step}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
          transition={{ duration: 0.3 }}
          disabled={submitting}
          className="border-0 p-0"
        >
          <legend className="mb-10 text-center font-serif text-serif-feature">{ITEMS[step]}</legend>
          <div className="grid gap-3" role="group" aria-label="Answer scale">
            {SCALE.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => answer(i)}
                className="flex min-h-12 items-center justify-between rounded-r2 border border-border bg-card px-5 text-left text-body-m transition-all duration-fast hover:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span>{label}</span>
                <kbd className="font-mono text-label-mono text-muted-foreground" aria-hidden>
                  {i + 1}
                </kbd>
              </button>
            ))}
          </div>
        </motion.fieldset>
      </AnimatePresence>

      {(step === 3 || step === 8) && (
        <p className="mt-8 text-center text-body-s text-muted-foreground">Honest answers beat impressive ones.</p>
      )}
      {error && (
        <p role="alert" className="mt-8 text-center text-body-s text-attention">
          {error}
        </p>
      )}
      {submitting && (
        <p aria-live="polite" className="mt-8 text-center text-body-s text-muted-foreground">
          Reading your answers…
        </p>
      )}
    </div>
  );
}
