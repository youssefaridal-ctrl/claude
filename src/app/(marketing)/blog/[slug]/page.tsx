import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { getArticleBySlug, listPublishedArticles } from "@/server/services/content";

// Prototype prose bodies for all six articles.
// Full bodies live in content/02-articles.md and replace these on CMS import.
const PROTOTYPE_BODIES: Record<string, string[]> = {
  "why-affirmations-fail": [
    "There is a moment, described in virtually every popular book on confidence, where the reader is encouraged to stand in front of a mirror and say something kind about themselves. The instruction is well-meaning. The neuroscience is not on its side.",
    "The mind applies something researchers call the credibility filter — a continuous, mostly unconscious check that weighs incoming statements against a body of evidence. Statements that clear the filter are integrated; statements that don't are flagged as suspect and rejected. "I am confident" fails the filter immediately for most people, because the mind holds the receipts. It remembers the meeting where you went quiet, the opportunity you passed, the version of yourself that doesn't quite match the declaration. The mismatch doesn't just fail to help — it briefly worsens the feeling, the same way a compliment you don't believe can land as sarcasm.",
    "This is not a personality problem or a pessimism problem. It is a precision problem. The standard affirmation makes the wrong kind of statement — it asserts a trait ("I am confident") rather than logging an observation ("I stayed in the conversation past the point I would have left last year"). Traits are contested. Observations are not.",
    "The research on values-based self-affirmation, which does work, is instructive: it asks people not to claim to be excellent but to reflect on something they actually value. That's a fundamentally different move. It anchors the statement to something verifiable, which is why the brain doesn't fight it. The same logic extends to self-talk rewrites: a sentence survives if you'd accept it in a court of evidence. "I have handled hard feedback before and absorbed it" survives. "I am unstoppable" does not.",
    "The practical implication is simple and slightly uncomfortable: your new sentences have to be boring enough to be believable. Not "I am brilliant" — but "I prepared thoroughly, and I know this material." Not "I deserve this" — but "I have done the work, and I can see where it led." The magic is not in the poetry of the statement. It is in whether your own mind lets it land.",
    "One test: say the sentence to yourself and wait for the but. If it comes — "but that time you—" — the sentence needs to get more specific or more modest. Keep trimming until the but quiets down. That's not lowering your standards. That's finding the floor your new voice can stand on.",
  ],
  "where-confidence-actually-comes-from": [
    "The most decorated surgeon in her hospital told me she still prepares for every procedure as if she's a resident on her first week. The most cited researcher I know still reads rejection letters with his hands shaking. The pattern is everywhere, once you look: the people who have done the thing most have not, by accumulation of evidence, stopped doubting themselves. If achievement produced confidence, it would show up in the data. It doesn't.",
    "The confusion is understandable. Confidence is supposed to be the reward at the end — the feeling that arrives once you've proven you belong. The cultural shorthand for confidence-building is almost always "do hard things, get confident." But that's a description of how confidence sometimes appears as a byproduct, not an account of where it comes from. The mechanism is different.",
    "What confidence actually is, underneath the folklore, is an appraisal process. Your brain doesn't register your achievements as they happen and tally them into a running confidence score. It appraises each new situation in real time, drawing on an identity narrative — a working model of who you are — and asking whether that person can handle this. The quality of the appraisal depends almost entirely on the quality of the narrative, not the size of the achievement portfolio.",
    "This explains the surgeon. She is appraising each new procedure through a narrative that includes both her extraordinary history and a deeply internalized standard of what "prepared" means. A lesser surgeon might use the same history and appraise more generously. Neither appraisal is strictly wrong; both are functions of the narrator, not the facts.",
    "What this means practically is that confidence work has to happen upstream of achievement. You can wait until the resume grows and hope the feeling follows — that strategy works for some people, most of the time. Or you can work directly on the appraisal process: what identity you hold going into the room, how you narrate your history, what counts as evidence in your internal court. That's not pretending to feel something you don't. It's authoring the infrastructure that will produce the feeling, reliably, without requiring a new achievement first.",
    "The surgeon, for what it's worth, said she had never once finished a procedure and thought: "now I can relax into confidence." She said she had, somewhere in her forties, stopped waiting. She decided to operate from competence and stop auditing the feeling. That distinction — between waiting to feel ready and deciding to work from what's already true — is where most of the practical work lives.",
  ],
  "talk-to-yourself-by-name": [
    "In 2014, researchers at the University of Michigan ran a set of experiments on stressed participants preparing for a job interview. Half were told to think through the situation using first-person language — "Why am I nervous? What do I need to do?" The other half were told to use their own name and third person — "Why is [Name] nervous? What does [Name] need to do?" The second group performed measurably better and felt less distressed afterward. The intervention cost one pronoun.",
    "The effect has since been replicated across social threat, embarrassing recall, and anxiety under scrutiny. What the researchers were measuring is called distanced self-talk — the use of third-person language or self-address by name to create a brief cognitive gap between the experiencer and the observer. That gap is, it turns out, worth a measurable amount of regulation.",
    "Why does it work? The prevailing account draws on a well-established principle in cognitive science: self-distance reduces emotional reactivity. When you're inside the experience — using "I," merged with the feeling — you're activating the same networks that would fire if the threat were immediate. When you address yourself by name, you recruit observer-mode processing: the part of the brain that can contextualize, that remembers other hard things survived, that knows the presentation is twenty minutes and not a life sentence. The shift is real; it's measurable in cortisol and self-reported affect, and it happens quickly.",
    "Using it is simple. Before the meeting you're dreading: "What does [your name] know about this? [Your name] has done the preparation." Mid-spiral at 2 a.m.: "What is [your name] actually afraid of here? Let's look at it." It sounds strange the first few times, which is itself interesting — the strangeness is partly the distance working.",
    "One objection worth naming: this isn't bypassing the feeling or performing detachment. The technique doesn't ask you to pretend the situation doesn't matter. It asks you to bring a slightly wider perspective to something that does. The goal isn't to stop caring; it's to stop being completely merged with the alarm signal, so you can actually think alongside it.",
    "Try it on the next thing you're avoiding. Notice whether you're running the inner dialogue in first person — I can't, I don't know how, I'll embarrass myself — and switch to your name. The feeling won't vanish. But there will be a little room around it. That room is where the work happens.",
  ],
  "evidence-sprint": [
    "This is not an essay. It's a three-minute exercise. Read it once, then do it.",
    "Pick the doubt that's loudest right now. The one that's been running in the background of your week. Write it in one sentence, as specifically as possible. Not "I'm not good enough" — that's a verdict, not a doubt. Try: "I'm going to be out of my depth in that meeting on Thursday." Or: "I'll run out of things to say and look like I'm coasting." Specific fears are workable. Generalized verdicts are not.",
    "Now write five pieces of evidence from your actual history that complicate that doubt. Not wishes, not reassurances from other people, not hypotheticals — facts you lived. A meeting where you found your footing. A project that looked bigger than you and wasn't. A time you were honest about not knowing and it was fine. A decision you made under pressure that held up. A moment someone acknowledged something you'd done and you recognized, even briefly, that it was accurate.",
    "Five is the number because the first two feel easy, the third one requires a moment of looking, and by four and five the brain has started participating. If you can't find five, three counts. If you find eight, write eight.",
    "Look at the original doubt sentence. Look at the evidence column. You don't need to conclude anything or convince yourself of anything. Just notice that the doubt exists alongside a set of facts it wasn't accounting for. That's the whole exercise.",
    "The sprint works because doubt narrows attention — it is a threat signal and threat signals focus the mind on the threat. Evidence doesn't argue with the doubt; it expands the frame. A wider frame produces a more accurate appraisal. That's not optimism. That's information hygiene.",
  ],
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
