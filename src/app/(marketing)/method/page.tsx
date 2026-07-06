import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { RewriteDemo } from "@/components/method/rewrite-demo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Selv Method — a system for rewriting the voice you think with",
  description:
    "Three movements — Audit, Rewrite, Rep. Twelve minutes a day, grounded in how the brain actually changes.",
  path: "/method",
});

const NARRATORS = [
  { name: "The Perfectionist", line: "“If it's not flawless, it's failure.”", note: "Confuses standards with safety." },
  { name: "The Guard", line: "“Don't try, and you can't lose.”", note: "Sells protection, delivers smallness." },
  { name: "The Ghost", line: "“Take up less space.”", note: "Learned invisibility, performed as politeness." },
  { name: "The Prosecutor", line: "“Let's review everything you did wrong.”", note: "Runs the 2 a.m. tribunal." },
  { name: "The Pleaser", line: "“Keep them happy and you'll be safe.”", note: "Trades self for approval, daily." },
  { name: "The Prophet", line: "“This will go badly. It always does.”", note: "Forecasts pain and calls it realism." },
];

const SCIENCE = [
  { claim: "Naming emotions calms the brain.", detail: "Affect labeling dampens amygdala reactivity while engaging regulatory prefrontal regions. The narrator is quieter the moment it's named." },
  { claim: "Reframing changes feeling, not just thought.", detail: "Cognitive reappraisal is among the best-studied emotion-regulation strategies, with reliable effects on negative affect." },
  { claim: "Talking to yourself by name creates useful distance.", detail: "Distanced self-talk reduces reactivity, even under social stress, at remarkably low cognitive cost." },
  { claim: "Affirming values — not traits — lowers defensiveness.", detail: "Values-based self-affirmation buffers threat and improves receptivity to hard feedback. “I am amazing” does not." },
  { claim: "Identity drives habit more than willpower does.", detail: "Habits anchored to identity statements and if-then plans outlast motivation by design." },
  { claim: "The brain remains plastic.", detail: "Self-directed practice physically changes networks at every adult age. Slower at 50 than 15 — and entirely available." },
];

export default function MethodPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink-950 py-s10 text-bone-50">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6 !text-ink-300">The Selv Method</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-3xl text-display-l font-medium">
              A system for rewriting the voice you think with.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-body-l text-ink-300">
              Three movements. Twelve minutes a day. Grounded in how the brain actually changes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The problem, precisely */}
      <section className="bg-ink-950 pb-s10 text-bone-50">
        <div className="container grid gap-8 md:grid-cols-3">
          {[
            "Your inner dialogue runs constant commentary — prediction, verdict, replay. You don't hear most of it. You just live inside its conclusions.",
            "Most of that script was drafted early, by other people: a parent's sigh, a teacher's margin note, a room that laughed at the wrong moment. Never updated since.",
            "You've been editing your behavior — more preparation, more achievement, more armor — while the script writes the behavior. Work upstream.",
          ].map((text, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border-l border-ink-700 pl-6">
                <p className="eyebrow mb-3 !text-solar-500">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-body-m text-ink-100">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Movement I — Audit + narrators */}
      <section className="bg-background py-s10">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-3">01 / Audit</p>
            <h2 className="text-display-m font-medium">You can't rewrite a script you've never read.</h2>
            <p className="mt-4 max-w-2xl text-body-l text-muted-foreground">
              The Audit makes the invisible voice visible. Most people meet their dominant narrator inside
              four minutes — and the recognition is physical, a small cold shock of <em>oh, that's been
              running my life.</em>
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NARRATORS.map((n, i) => (
              <Reveal key={n.name} delay={Math.min(i, 5) * 0.06}>
                <article className="h-full rounded-r3 border border-border bg-card p-6">
                  <h3 className="text-body-m font-medium">{n.name}</h3>
                  <p className="mt-2 font-serif italic text-muted-foreground">{n.line}</p>
                  <p className="mt-2 text-body-s text-muted-foreground">{n.note}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/lab/audit">Meet yours — 4 minutes, free</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Movement II — Rewrite + live demo */}
      <section className="border-t border-border bg-background py-s10">
        <div className="container grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow mb-3">02 / Rewrite</p>
              <h2 className="text-display-m font-medium">Not affirmations. Authorship.</h2>
              <p className="mt-4 text-body-l text-muted-foreground">
                Standing at a mirror shouting “I am confident” fails for a reason: the mind rejects
                statements it can't verify. The Rewrite builds sentences that survive your own
                cross-examination — using three operations from cognitive science.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <RewriteDemo />
          </Reveal>
        </div>
      </section>

      {/* Movement III — Rep */}
      <section className="border-t border-border bg-background py-s10">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-3">03 / Rep</p>
            <h2 className="max-w-2xl text-display-m font-medium">
              A voice becomes yours the way an accent does: repetition.
            </h2>
            <p className="mt-4 max-w-2xl text-body-l text-muted-foreground">
              Insight fades in about seventy-two hours unless it's practiced. The Rep movement turns your
              rewritten sentences into daily practice — brief structured sessions, rehearsals before hard
              moments, and the Identity Ledger, where every brave act is logged as evidence. Twelve minutes
              a day, most days. That's the whole ask.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Science layer */}
      <section className="bg-card py-s10">
        <div className="container">
          <Reveal>
            <h2 className="text-display-m font-medium">The machinery, named.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SCIENCE.map((s, i) => (
              <Reveal key={s.claim} delay={Math.min(i, 5) * 0.05}>
                <details className="group rounded-r3 border border-border bg-background p-6">
                  <summary className="cursor-pointer list-none text-body-m font-medium marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    {s.claim}
                    <span aria-hidden className="float-right text-muted-foreground transition-transform duration-fast group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-3 text-body-s text-muted-foreground">{s.detail}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What it isn't */}
      <section className="bg-background py-s10">
        <div className="container max-w-3xl">
          <Reveal>
            <h2 className="text-display-m font-medium">What it isn't.</h2>
            <ul className="mt-6 space-y-3 text-body-l text-muted-foreground">
              <li>— Not affirmations shouted at mirrors.</li>
              <li>— Not toxic positivity. Some thoughts are accurate and deserve action, not reframing.</li>
              <li>— Not a personality transplant. Introverts stay introverts, with a steadier voice.</li>
              <li>
                — <strong className="text-foreground">Not therapy</strong> — and we'll say so clearly
                whenever therapy is the right door. <Link href="/resources" className="underline underline-offset-4">Resources →</Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-950 py-s10 text-center text-bone-50">
        <div className="container">
          <Badge variant="solar" className="mb-6">Start where everyone starts</Badge>
          <h2 className="text-display-m font-medium">Four minutes of honesty.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-bone-50 text-ink-950">
              <Link href="/lab/audit">Take the Audit</Link>
            </Button>
            <Button asChild variant="ghost" className="text-bone-50 hover:bg-ink-900">
              <Link href="/programs">See Programs →</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
