import Link from "next/link";
import { notFound } from "next/navigation";
import { stories } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

const CHAPTERS: Record<string, { heading: string; body: string }[]> = {
  elena: [
    { heading: "Before", body: "I had a habit of watching the moment pass. Someone else would say the thing I'd been about to say, and I'd feel two things: relief that I didn't have to, and a particular hollowness when it landed well. My narrator had a name I didn't know yet — the Guard — and its deal was: if you wait long enough, the risk goes away." },
    { heading: "The turn", body: "The Audit called it almost exactly: "You don't have a speaking problem. You have a timing problem manufactured by a threat system." I'd been treating the silence as a data point about my ideas. It was a data point about a thirty-year-old protection strategy." },
    { heading: "The practice — and the relapse", body: "I built a rule: one idea out loud per meeting, unfinished, framed as a question. Week three felt like trying to speak in a second language. Week five, a half-formed architecture suggestion I nearly swallowed became the direction for the sprint. My lead asked where it had been. I had no good answer. The relapse came at a board review I wasn't ready for — the Guard had the floor for a week. I restarted on a Thursday with one sentence out loud on a Slack thread. Small is still real." },
    { heading: "Now", body: "Ten months. I still feel the pause before I speak — that half-second where the Guard does its check. I've stopped arguing with it. I just go before it finishes." },
  ],
  james: [
    { heading: "Before", body: "Teaching is a performance measured in real time, by thirty people who can see everything. I'd built a system for managing that: know the material cold, control the room, read every small signal as data. By year eight, I was good at it. I was also exhausted by my own vigilance. My narrator was a mix of the Perfectionist and the Prophet, and they worked shifts." },
    { heading: "The turn", body: "My wife heard me replay a parent meeting for the third time on a Tuesday night. She said, quietly: "You won. The meeting is over." The essay on the 2 a.m. tribunal was forwarded to me that Friday by a colleague who'd read it differently. That night I did the adjournment protocol for the first time, at midnight, half-convinced it wouldn't work. It didn't close the tribunal. It adjourned it. That was enough." },
    { heading: "The practice — and the relapse", body: "The Belief Archaeology on "you care too much about what people think" led somewhere unexpected — to a specific teacher I had at fifteen who used peer approval as a classroom management tool. I'd been running his system ever since. Rewriting "I care what people think" to "I care how this lands because I care about them" took four drafts before it held under cross-examination. The relapse came mid-autumn with a parent complaint I genuinely hadn't seen coming. I took myself off practice for two weeks. My Circle noticed and didn't push, just checked in. That was the whole intervention." },
    { heading: "Now", body: "Eighteen months. The classroom is the same classroom. What changed is the distance between me and the audience's running verdict. I check in, note it, and put it down. A colleague asked last term why I seemed different. I said: I stopped taking the audience's notes home with me." },
  ],
  maya: [
    { heading: "Before", body: "There was a meeting every Thursday, and a version of me who spent Wednesday night preparing to be adequate in it. My performance reviews said “more executive presence.” My inner voice translated: they can tell." },
    { heading: "The turn", body: "I took the Audit on a Tuesday at 1 a.m., expecting a horoscope. What I got was a name — the Perfectionist — and one sentence I screenshotted: “You don't have a speaking problem. You have a pre-trial problem.”" },
    { heading: "The practice — and the relapse", body: "Two weeks of verbatim transcripts. My first working sentence failed at believability 4. The one that held was smaller. Week six, a director cut me off mid-sentence and I skipped practice for nine days. Restarting turned out to be the actual skill. Nobody tells you that." },
    { heading: "Now", body: "Eight months in: I rehearse a sentence once, out of respect for the room, not fear of it. I still meet the Perfectionist most Thursdays. I let her check my badge, and then I go in." },
  ],
  david: [
    { heading: "Before", body: "The divorce paperwork listed the assets, and I remember thinking: there's no line item for the part of me that just left. My narrator was a Prophet, and it was calm: the good part is over now. Delivered like a weather report." },
    { heading: "The turn", body: "My sister sent me the essay about the 2 a.m. tribunal with the message “this is you.” I did the evening protocol for a week — just a notebook. The night sessions got shorter. I run operations; I respect things that work." },
    { heading: "The practice — and the relapse", body: "The Belief Archaeology on “the good part is over” found its author. It wasn't mine — it was my father's sentence about his life, installed at our kitchen table around 1989. First holidays alone, I stopped everything for three weeks. My Circle got me back with four words: “chair's still there, David.”" },
    { heading: "Now", body: "Fourteen months. Last month my daughter asked what I'm always writing in the mornings. I told her: “Evidence.” She said “of what?” and I said “that the good part isn't over.” The Prophet had no comment." },
  ],
};

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({ title: `${story.name} — a story in drafts`, description: story.after, path: `/stories/${slug}` });
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();
  const chapters = CHAPTERS[slug] ?? [];

  return (
    <article className="bg-ink-950 text-bone-50">
      <div className="container max-w-[680px] py-s9">
        <Badge className="border-ink-700 !text-ink-300">{story.situation}</Badge>
        <h1 className="mt-5 font-serif text-display-m leading-tight">
          {story.name}, {story.age}. {story.role}.
        </h1>
        <p className="mt-4 font-serif text-serif-feature italic text-ink-300 line-through decoration-1">
          “{story.before}”
        </p>

        <div className="mt-12 space-y-10">
          {chapters.map((c) => (
            <section key={c.heading}>
              <h2 className="eyebrow mb-3 !text-solar-500">{c.heading}</h2>
              <p className="font-serif text-body-l leading-[1.75] text-ink-100">{c.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-r3 border border-ink-700 bg-ink-900 p-6 text-center">
          <p className="text-body-m text-ink-100">Their first step was the Audit.</p>
          <Button asChild className="mt-4 bg-bone-50 text-ink-950">
            <Link href="/lab/audit">Take yours — free, 4 minutes</Link>
          </Button>
        </div>

        <p className="mt-10 text-body-s text-ink-500">
          A composite story drawn from common member patterns, details changed, labeled per our editorial
          standard. Results vary — methodology available.
        </p>
      </div>
    </article>
  );
}
