import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Commons — do the quiet work in good company",
  description: "Circles of 6–8, a forum where every post declares what it's seeking, and the only reaction is “I see you.”",
  path: "/community",
});

const PANELS = [
  { title: "Circles", body: "Six to eight members, matched by intent and timezone, one structured prompt a week. Small enough that absence is noticed kindly; structured enough that no one has to perform." },
  { title: "The Forum", body: "Every post declares what it's seeking — support, perspectives, or accountability — so you get what you asked for, not advice you didn't. The only reaction is “I see you.” There are no counts to compete over." },
  { title: "Live rituals", body: "Open Practice on Wednesdays: twenty minutes of co-working on yourself, cameras optional. Monthly conversations with researchers. Quarterly Threshold Stories — the true version, relapses included." },
];

const CULTURE = [
  "We witness. We don't fix.",
  "No advice unless asked. (“Seeking” labels are law.)",
  "Wins are evidence, not bragging. Post them.",
  "What's shared here, stays here.",
  "Struggle is on-topic. Crisis deserves more than we are — and we'll always say so, with links, not lectures.",
];

export default function CommunityPage() {
  return (
    <>
      <section className="bg-ink-950 py-s10 text-bone-50">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-4 !text-ink-300">The Commons</p>
            <h1 className="max-w-2xl text-display-l font-medium">Do the quiet work in good company.</h1>
            <p className="mt-6 max-w-xl font-serif text-serif-feature italic text-ink-300">
              The narrator does its best work in isolation — it's much less convincing in a room where six
              other people have the same one.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-s9">
        <div className="container grid gap-6 md:grid-cols-3">
          {PANELS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="p-7">
                  <h2 className="text-heading-s font-medium">{p.title}</h2>
                  <p className="mt-3 text-body-s text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card py-s9">
        <div className="container max-w-2xl">
          <Reveal>
            <h2 className="text-display-m font-medium">The culture, posted.</h2>
            <ul className="mt-8 space-y-4">
              {CULTURE.map((rule) => (
                <li key={rule} className="border-l-2 border-l-foreground pl-5 font-serif text-body-l">
                  {rule}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-s9 text-center">
        <div className="container">
          <p className="text-body-l text-muted-foreground">
            Pseudonyms welcome. No follower counts. No DMs unless both people opt in.
          </p>
          <Button asChild className="mt-6">
            <Link href="/pricing">The Commons opens with the Practice tier →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
