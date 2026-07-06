import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, InteractiveCard, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Confidence Lab — experiments for the inner voice",
  description: "Try one now — no account, no catch. Start with the free Inner Dialogue Audit.",
  path: "/lab",
});

const EXPERIMENTS = [
  { name: "The Rewrite Machine", time: "5 min", mechanism: "reappraisal", promise: "Bring one harsh sentence. Leave with one you believe.", free: true },
  { name: "Rehearsal Room", time: "8 min", mechanism: "graded exposure", promise: "Rehearse the hard conversation before the stakes are real.", free: false },
  { name: "Evidence Sprint", time: "3 min", mechanism: "restructuring", promise: "One doubt versus five facts from your own history. The doubt rarely survives.", free: true },
  { name: "The Compliment Vault", time: "2 min", mechanism: "positive data logging", promise: "Store praise the moment it lands, for the days your memory edits it out.", free: false },
  { name: "Boundary Script Builder", time: "10 min", mechanism: "assertiveness", promise: "The words for “no,” in your dialect, ready before you need them.", free: false },
  { name: "Fear Ladder", time: "10 min", mechanism: "graded exposure", promise: "Turn one avoidance into eight climbable steps.", free: true },
];

export default function LabPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <p className="eyebrow mb-3">The Confidence Lab</p>
        <h1 className="text-display-l font-medium">Experiments for the inner voice.</h1>
        <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
          Try one now — no account, no catch.
        </p>
      </Reveal>

      {/* The Audit — dominant card */}
      <Reveal delay={0.1}>
        <Card className="mt-10 bg-gradient-to-br from-card to-muted">
          <CardContent className="grid gap-6 p-10 md:grid-cols-[2fr_auto] md:items-center">
            <div>
              <Badge variant="solar">Start here · free · no signup</Badge>
              <h2 className="mt-4 text-display-m font-medium">The Inner Dialogue Audit</h2>
              <p className="mt-3 max-w-lg text-body-m text-muted-foreground">
                Twelve questions. Four minutes. Your Dialogue Profile — which narrator runs your script,
                and what to do about it — immediately, before we ever ask for an email.
              </p>
            </div>
            <Button asChild>
              <Link href="/lab/audit">Begin</Link>
            </Button>
          </CardContent>
        </Card>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {EXPERIMENTS.map((e, i) => (
          <Reveal key={e.name} delay={Math.min(i, 5) * 0.05}>
            <InteractiveCard className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2">
                  <Badge>{e.time}</Badge>
                  <Badge variant="filled">{e.mechanism}</Badge>
                  {!e.free && <Badge className="ml-auto">members</Badge>}
                </div>
                <h3 className="mt-4 text-body-l font-medium">{e.name}</h3>
                <p className="mt-2 flex-1 text-body-s text-muted-foreground">{e.promise}</p>
                <p className="mt-4 text-body-s text-accent">Coming to the Lab →</p>
              </CardContent>
            </InteractiveCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
