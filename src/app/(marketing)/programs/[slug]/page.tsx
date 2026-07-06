import Link from "next/link";
import { notFound } from "next/navigation";
import { programs } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return buildMetadata({ title: "Program not found", noIndex: true });
  return buildMetadata({
    title: `${program.name} — ${program.promise}`,
    description: program.whoFor[0],
    path: `/programs/${slug}`,
  });
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  return (
    <>
      {/* Emotional hero */}
      <section className="bg-ink-950 py-s9 text-bone-50">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-4 !text-ink-300">Program {program.number}</p>
            <h1 className="text-display-l font-medium">{program.name}.</h1>
            <p className="mt-4 font-serif text-serif-feature italic text-ink-100">{program.promise}</p>
            <p className="mt-6 font-mono text-label-mono uppercase text-ink-300">
              {program.meta.weeks} weeks · {program.meta.minutesPerDay} min/day · cohort of {program.meta.cohort} · next: {program.meta.nextCohort}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-bone-50 text-ink-950">
                <Link href="/pricing">Check your fit</Link>
              </Button>
              <Button asChild variant="ghost" className="text-bone-50 hover:bg-ink-900">
                <a href="#curriculum">Curriculum ↓</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Honest columns */}
      <section className="bg-background py-s9">
        <div className="container grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-heading-s font-medium">Who it's for</h2>
              <ul className="mt-4 space-y-3">
                {program.whoFor.map((w) => (
                  <li key={w} className="flex gap-3 text-body-m text-muted-foreground">
                    <span aria-hidden className="text-positive">✓</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <h2 className="text-heading-s font-medium">Who it's not for</h2>
              <ul className="mt-4 space-y-3">
                {program.whoNotFor.map((w) => (
                  <li key={w} className="flex gap-3 text-body-m text-muted-foreground">
                    <span aria-hidden>—</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-y border-border bg-card py-s9">
        <div className="container">
          <Reveal>
            <h2 className="text-display-m font-medium">By week {program.meta.weeks}, you will —</h2>
          </Reveal>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {program.outcomes.map((o, i) => (
              <Reveal key={o} delay={i * 0.06}>
                <li className="rounded-r3 border border-border bg-background p-6 text-body-m">{o}</li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="bg-background py-s9">
        <div className="container max-w-3xl">
          <Reveal>
            <h2 className="text-display-m font-medium">The curriculum.</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {program.curriculum.map((week) => (
              <details key={week.week} className="group rounded-r3 border border-border bg-card">
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-5 p-5 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  <span className="font-mono text-heading-s text-muted-foreground/60" aria-hidden>
                    {String(week.week).padStart(2, "0")}
                  </span>
                  <span className="text-body-m font-medium">{week.theme}</span>
                  <span aria-hidden className="ml-auto text-muted-foreground transition-transform duration-fast group-open:rotate-45">＋</span>
                </summary>
                <p className="px-5 pb-5 pl-[4.5rem] text-body-s text-muted-foreground">{week.detail}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing block */}
      <section className="border-t border-border bg-background pb-s10">
        <div className="container max-w-3xl">
          <div className="rounded-r4 border border-border bg-card p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="text-display-m font-medium">${program.price}</p>
                <p className="text-body-s text-muted-foreground">
                  Everything included · 30-day refund, no interrogation · true seat counts only
                </p>
              </div>
              <Button asChild>
                <Link href="/pricing">Check your fit</Link>
              </Button>
            </div>
            <Badge className="mt-4">Included with the Academy tier</Badge>
          </div>
        </div>
      </section>
    </>
  );
}
