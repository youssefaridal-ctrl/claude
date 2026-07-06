import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The voice in your head was written by other people",
  description:
    "SELV is an evidence-based platform for rebuilding self-confidence: audit your inner dialogue, rewrite it, and practice 12 minutes a day.",
  path: "/",
});

const CRITIC_LINES = [
  "“Don't raise your hand unless you're sure.”",
  "“They're going to find out.”",
  "“Who do you think you are?”",
  "“Say yes now, apologize to yourself later.”",
  "“Everyone else finds this easy.”",
];

const MOVEMENTS = [
  { number: "01 · AUDIT", title: "Map the voice you have.", body: "You can't rewrite a script you've never read. Four minutes of honest questions shows you your narrator." },
  { number: "02 · REWRITE", title: "Author the voice you choose.", body: "Not affirmations — precise, believable sentences built with tools from cognitive science." },
  { number: "03 · REP", title: "Practice until it's simply yours.", body: "Twelve minutes a day. Small honest reps, logged as evidence, until the new voice stops feeling new." },
];

const EVIDENCE = [
  { stat: "71%", label: "report speaking up more within 8 weeks*" },
  { stat: "12 min", label: "median daily practice" },
  { stat: "n = 1,204", label: "2025 member survey" },
  { stat: "30 days", label: "refund window, no interrogation" },
];

export default function HomePage() {
  return (
    <>
      {/* 1.1 Hero — "The Mirror" (design/03 §1.1) */}
      <section className="relative flex min-h-[92vh] items-center bg-ink-950 text-bone-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,162,61,0.06),transparent_60%)]"
        />
        <div className="container relative">
          <Reveal>
            <p className="eyebrow mb-6 !text-ink-300">Inner architecture</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-4xl text-display-xl font-medium">
              The voice in your head was written by other people.
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-6 font-serif text-serif-feature italic text-ink-100">Take the pen back.</p>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button asChild className="bg-bone-50 text-ink-950 hover:ring-solar-500">
                <Link href="/lab/audit">Begin with the free Audit</Link>
              </Button>
              <Link href="/method" className="text-body-s text-ink-300 underline-offset-4 hover:text-bone-50 hover:underline">
                Explore the Method →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.2 Recognition strip */}
      <section aria-label="The inner critic's lines" className="border-t border-ink-700 bg-ink-950 py-24 text-bone-50">
        <div className="container">
          <ul className="space-y-6">
            {CRITIC_LINES.map((line, i) => (
              <Reveal key={line} as="li" delay={i * 0.06}>
                <p className="font-serif text-serif-feature text-ink-300">{line}</p>
              </Reveal>
            ))}
            <Reveal as="li" delay={0.35}>
              <p className="font-serif text-serif-feature text-solar-500">
                None of these are facts. All of them are drafts.
              </p>
            </Reveal>
          </ul>
        </div>
      </section>

      {/* 1.3 Thesis — the "dawn" transition to light */}
      <section className="bg-background py-s10">
        <div className="container grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-display-m font-medium">
                Confidence is not a feeling. It&rsquo;s an architecture.
              </h2>
              <div className="mt-6 space-y-4 text-body-l text-muted-foreground">
                <p>
                  You&rsquo;ve been told confidence is something people are born with, or something you find — at
                  the bottom of an achievement, on the far side of a fear. It&rsquo;s neither. Confidence is a
                  structure: an identity you hold, a dialogue that runs on it, and a body of evidence that keeps
                  it standing.
                </p>
                <p>
                  Most self-improvement works on behavior and hopes identity follows. It rarely does. We work in
                  the other direction — first the identity, then the dialogue, then the reps that make it real.
                </p>
              </div>
            </div>
          </Reveal>
          <div aria-hidden className="hidden items-center justify-center lg:flex">
            {/* Blueprint illustration slot (design/01 §16) — layered SVG, line-draw on scroll. */}
            <div className="h-80 w-full rounded-r4 border border-dashed border-border" />
          </div>
        </div>
      </section>

      {/* 1.4 Method preview */}
      <section className="bg-background pb-s10">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {MOVEMENTS.map((m, i) => (
              <Reveal key={m.number} delay={i * 0.08}>
                <article className="h-full rounded-r3 border border-border bg-card p-6 shadow-elev-1 transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-elev-2">
                  <p className="eyebrow mb-4">{m.number}</p>
                  <h3 className="text-heading-s font-medium">{m.title}</h3>
                  <p className="mt-3 text-body-s text-muted-foreground">{m.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mt-8">
              <Link href="/method" className="text-accent underline-offset-4 hover:underline">
                The full Method →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 1.7 Evidence band — honest numbers */}
      <section aria-label="Honest numbers" className="border-y border-border bg-card py-16">
        <div className="container">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {EVIDENCE.map((e) => (
              <div key={e.stat} className="border-l border-border pl-6">
                <dt className="sr-only">{e.label}</dt>
                <dd className="text-display-m font-medium">{e.stat}</dd>
                <dd className="mt-1 font-mono text-label-mono uppercase text-muted-foreground">{e.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-body-s text-muted-foreground">
            *Self-reported outcomes from our annual member survey.{" "}
            <Link href="/methodology" className="underline underline-offset-4">Full methodology</Link>
          </p>
        </div>
      </section>

      {/* 1.10 Final invitation */}
      <section className="bg-ink-950 py-s10 text-center text-bone-50">
        <div className="container">
          <Reveal>
            <h2 className="text-display-m font-medium">Begin with four minutes of honesty.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-body-l text-ink-300">The Audit is free. The results are yours either way.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button asChild className="bg-bone-50 text-ink-950">
                <Link href="/lab/audit">Take the Inner Dialogue Audit</Link>
              </Button>
            </div>
            <p className="mt-4 font-mono text-label-mono uppercase text-ink-500">
              No signup required · Results immediately · Private by design
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
