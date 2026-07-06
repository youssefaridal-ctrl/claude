import Link from "next/link";
import { courses } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mindset Academy — the science of self, taught properly",
  description: "Self-paced deep education: Confidence Fundamentals, Emotional Mastery, Identity & Narrative.",
  path: "/academy",
});

const PATHS = [
  { name: "Confidence Fundamentals", blurb: "Where confidence actually comes from, why yours wobbles when it does, and the practice architecture that steadies it." },
  { name: "Emotional Mastery", blurb: "Regulation, not suppression: the physiology of feeling, and the skills that widen the space between trigger and response." },
  { name: "Identity & Narrative", blurb: "The deepest layer: how a self-story forms, hardens, and — with the right tools — gets rewritten." },
];

export default function AcademyPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <p className="eyebrow mb-3">Mindset Academy</p>
        <h1 className="text-display-l font-medium">The science of self, taught properly.</h1>
        <p className="mt-3 max-w-2xl text-body-l text-muted-foreground">
          Programs change you on a schedule. The Academy is the other thing: deep, self-paced understanding,
          for people who trust ideas more once they've seen the machinery.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PATHS.map((p, i) => {
          const pathCourses = courses.filter((c) => c.path === p.name);
          return (
            <Reveal key={p.name} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="p-7">
                  <p className="eyebrow mb-3">Path {String(i + 1).padStart(2, "0")}</p>
                  <h2 className="text-heading-s font-medium">{p.name}</h2>
                  <p className="mt-3 text-body-s text-muted-foreground">{p.blurb}</p>
                  <p className="mt-5 font-mono text-label-mono uppercase text-muted-foreground">
                    {pathCourses.length} courses
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 text-center">
          <Button asChild variant="secondary">
            <Link href="/courses">Browse all courses →</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
