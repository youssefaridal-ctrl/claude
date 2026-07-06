import Link from "next/link";
import { programs } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Programs — structured seasons of identity work",
  description: "One focus, one cohort, one transformation at a time. Eight to twelve weeks, fifteen minutes a day.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <p className="eyebrow mb-3">Programs</p>
        <h1 className="text-display-l font-medium">Structured seasons of identity work.</h1>
        <p className="mt-4 max-w-2xl text-body-l text-muted-foreground">
          One focus, one cohort, one transformation at a time. Not sure where to start? Five honest
          questions will tell you — including whether now isn't the time.
        </p>
      </Reveal>

      <div className="mt-12 space-y-6">
        {programs.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <InteractiveCard>
              <Link href={`/programs/${p.slug}`} className="block focus-visible:outline-none">
                <CardContent className="grid gap-6 p-8 md:grid-cols-[1fr_2fr_auto] md:items-center">
                  <div>
                    <p className="eyebrow mb-2">Program {p.number}</p>
                    <h2 className="text-display-m font-medium">{p.name}</h2>
                    <Badge className="mt-3">Next cohort: {p.meta.nextCohort}</Badge>
                  </div>
                  <div>
                    <p className="font-serif text-serif-feature italic">{p.promise}</p>
                    <p className="mt-3 font-mono text-label-mono uppercase text-muted-foreground">
                      {p.meta.weeks} weeks · {p.meta.minutesPerDay} min/day · cohort of {p.meta.cohort}
                    </p>
                  </div>
                  <span className="text-accent underline-offset-4 group-hover:underline" aria-hidden>
                    Explore →
                  </span>
                </CardContent>
              </Link>
            </InteractiveCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-14 rounded-r4 border border-border bg-card p-8 text-center">
          <h2 className="text-heading-s font-medium">We'll tell you if this isn't for you.</h2>
          <p className="mx-auto mt-2 max-w-xl text-body-s text-muted-foreground">
            The fit check genuinely redirects mismatched people — to the free tools, or to therapy when
            that's the right door. That's the point of it.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/lab/audit">Start with the free Audit</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
