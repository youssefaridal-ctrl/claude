import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { getArticleBySlug, listPublishedArticles } from "@/server/services/content";

// Prototype prose bodies for the two showcase articles.
// Full bodies for all articles live in content/02-articles.md and arrive with the CMS import.
const PROTOTYPE_BODIES: Record<string, string[]> = {
  "the-2am-tribunal": [
    "The lights are off. The day is over. And somewhere in your head, a courtroom comes to order.",
    "Exhibit A: the joke that landed wrong. Exhibit B: the email you should have worded differently. Exhibit C — the tribunal has been waiting all day for this one — the moment in the meeting when you said the thing, and there was a pause, and someone changed the subject.",
    "You know this court. It convenes at 2 a.m., accepts no defense counsel, and has never once returned a verdict of innocent. And here is the fact about it that changes everything: it isn't malfunctioning. It's a review process — running with the wrong settings, at the wrong hour, with no adjournment protocol.",
    "Your brain reviews social experience for the same reason it reviews near-misses in traffic: the stakes used to be existence-level. The process has a name in the clinical literature — post-event processing — and the research on it converges on an uncomfortable finding: the replay doesn't do what it promises. It feels like learning. Measured, it isn't.",
    "What closes a review process is not victory. It's a closure signal: evidence, in a form the brain accepts, that the event has been processed and filed. That's what the adjournment protocol builds — write the charges, one observable fact per charge, extract one action or stamp it dismissed, and adjourn on paper before bed.",
  ],
  "the-inner-critic-is-a-bodyguard": [
    "There's a sentence your inner voice says that you'd never say to anyone you love. You know the one.",
    "Here's the question almost nobody asks about that sentence: what is it for? Because psychological habits don't persist for decades unless they're doing a job. And the inner critic, for all its cruelty, has one of the oldest jobs there is. It's trying to keep you safe.",
    "Watch the critic's timing and the pattern appears. It speaks loudest at thresholds — before you raise your hand, submit the application, say the honest thing. It goes quiet when you play small. That's not a coincidence. That's a security system.",
    `Every critic line is a warning about something you care about, delivered in the worst possible dialect. “You’re going to embarrass yourself” translates to: this matters to you, and you want to do it well. Translation strips the packaging and keeps the signal — and precision, unlike insult, calms the brain’s alarm.`,
    "The critic does not disappear. What changes — for most people, noticeably inside two to three weeks — is your relationship to the voice: it becomes a character you recognize rather than a narrator you obey. In that gap, choice lives.",
  ],
};

export async function generateStaticParams() {
  const articles = await listPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({ title: article.title, description: article.dek, path: `/blog/${slug}`, type: "article" });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // Prefer DB body (MDX stored as plain paragraphs for now); fall back to prototype prose.
  const bodyParagraphs: string[] = article.bodyMdx
    ? article.bodyMdx.split("\n\n").filter(Boolean)
    : (PROTOTYPE_BODIES[slug] ?? [
        article.dek,
        "The full essay is written and ships with the content import (see content/02-articles.md). This page demonstrates the reading experience: the 680px measure, the serif voice, the science layer, and the rep block.",
      ]);

  const mid = Math.ceil(bodyParagraphs.length / 2);

  return (
    <article className="container max-w-[680px] py-s9">
      <header>
        <div className="flex gap-2">
          <Badge>{article.category}</Badge>
          <Badge variant="filled">{article.minutes} min read</Badge>
        </div>
        <h1 className="mt-5 font-serif text-display-m leading-tight">{article.title}</h1>
        <p className="mt-4 text-body-l text-muted-foreground">{article.dek}</p>
        <p className="mt-5 font-mono text-label-mono uppercase text-muted-foreground">By {article.author}</p>
      </header>

      <div className="mt-10 space-y-6">
        {bodyParagraphs.slice(0, mid).map((p, i) => (
          <p key={i} className="font-serif text-body-l leading-[1.75]">{p}</p>
        ))}

        <aside className="rounded-r3 border-l-2 border-l-solar-600 bg-card p-6 dark:border-l-solar-500">
          <p className="eyebrow mb-2">Do the rep</p>
          <p className="text-body-m">
            Reading is the start, not the practice. The matching exercise takes minutes and needs no account.
          </p>
          <Button asChild variant="secondary" size="compact" className="mt-4">
            <Link href="/lab">Open the Confidence Lab</Link>
          </Button>
        </aside>

        {bodyParagraphs.slice(mid).map((p, i) => (
          <p key={i} className="font-serif text-body-l leading-[1.75]">{p}</p>
        ))}
      </div>

      <footer className="mt-14 border-t border-border pt-8">
        <p className="text-body-s text-muted-foreground">
          SELV teaches evidence-informed practices for everyday confidence and self-talk. It isn't therapy,
          and it isn't a substitute for it. If you're carrying more than an essay should hold, our{" "}
          <Link href="/resources" className="underline underline-offset-4">Resources page</Link> lists
          where real help starts, including free options.
        </p>
      </footer>

      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.dek,
          slug: article.slug,
          authorName: article.author,
          publishedAt: article.publishedAt ?? new Date("2026-06-01"),
          updatedAt: article.publishedAt ?? new Date("2026-06-01"),
        })}
      />
    </article>
  );
}
