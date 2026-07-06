import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, courseJsonLd } from "@/lib/seo";
import { getCourseBySlug, listPublishedCourses } from "@/server/services/content";

export async function generateStaticParams() {
  const courses = await listPublishedCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({ title: course.title, description: course.promise, path: `/courses/${slug}` });
}

const LESSON_TITLES: Record<string, string[]> = {
  "the-anatomy-of-self-talk": [
    "Orientation: what you'll practice",
    "Where the inner voice came from",
    "The narrator's formats: prediction, verdict, replay",
    "Why the critic sounds like that — and whose voice it borrowed",
    "Naming the voice: the anatomy of a label",
    "From narrator to author: what changes",
  ],
  "the-confidence-equation": [
    "Orientation: what you'll practice",
    "The achievement paradox — why doing more doesn't settle it",
    "The appraisal process: how your brain runs its confidence check",
    "Evidence, not achievement: what actually moves the dial",
    "The equation, assembled",
  ],
  "practice-architecture": [
    "Orientation: what you'll practice",
    "Why motivation is a terrible foundation",
    "Designing your twelve minutes",
    "Identity anchors: habits that stick to who you're becoming",
    "The maintenance practice: what happens after week eight",
  ],
  "emotions-are-data": [
    "Orientation: what you'll practice",
    "The signal-versus-noise problem",
    "Reading the feeling before obeying it",
    "Affect labeling: why naming it calms it",
    "Reactivity windows and the ninety-second rule",
    "Your emotional vocabulary, expanded",
  ],
  "the-regulation-toolkit": [
    "Orientation: what you'll practice",
    "Breath: what works, what doesn't, and why",
    "Labeling: precision over venting",
    "Reappraisal: the surgeon's technique",
    "Movement and the body-first approach",
    "Situation selection — the underrated tool",
    "Building your personal stack",
  ],
  "the-criticism-metabolism": [
    "Orientation: what you'll practice",
    "Why feedback hits differently than we expect",
    "Separating information from verdict",
    "The intake protocol: three steps from receipt to response",
  ],
  "where-your-story-came-from": [
    "Orientation: what you'll practice",
    "Family scripts: the sentences you were handed",
    "Cultural scripts: the ones you didn't choose either",
    "Archaeology: tracing a belief back to its author",
    "The museum label: understanding without obeying",
    "Writing your own biography forward",
  ],
  "the-rewrite-deep": [
    "Orientation: what you'll practice",
    "Believability engineering: the science of what your mind accepts",
    "Advanced distancing techniques",
    "Values anchoring: the difference between traits and convictions",
    "Testing under load: rehearsals at rising stakes",
    "Relapse design — planning for the old voice's return",
    "Your author's voice: the final assembly",
  ],
};

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const titlesForCourse = LESSON_TITLES[slug] ?? [];
  const lessons = Array.from({ length: course.lessons }, (_, i) => ({
    number: i + 1,
    title: titlesForCourse[i] ?? (i === 0 ? "Orientation: what you'll practice" : `Lesson ${i + 1}`),
    locked: !(course.preview && i === 0),
  }));

  return (
    <div className="container grid gap-12 py-s9 lg:grid-cols-[2fr_1fr]">
      <div>
        <Badge>{course.path}</Badge>
        <h1 className="mt-4 text-display-l font-medium">{course.title}</h1>
        <p className="mt-3 max-w-xl text-body-l text-muted-foreground">{course.promise}</p>

        <h2 className="eyebrow mb-4 mt-12">Syllabus</h2>
        <ol className="divide-y divide-border rounded-r3 border border-border">
          {lessons.map((l) => (
            <li key={l.number} className="flex min-h-12 items-center gap-4 p-4">
              <span className="font-mono text-label-mono text-muted-foreground">
                {String(l.number).padStart(2, "0")}
              </span>
              <span className="flex-1 text-body-m">{l.title}</span>
              {l.locked ? (
                <Badge>Members</Badge>
              ) : (
                <Badge variant="solar">Preview — free</Badge>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-body-s text-muted-foreground">
          Every lesson runs Learn → Watch it in yourself → Do → Log, and ends with its rep assignment.
        </p>
      </div>

      <aside>
        <div className="sticky top-24 rounded-r4 border border-border bg-card p-6">
          <p className="font-mono text-label-mono uppercase text-muted-foreground">
            {course.lessons} lessons · {course.hours}
          </p>
          <p className="mt-4 text-body-m">Included with the Academy tier.</p>
          <Button asChild className="mt-5 w-full">
            <Link href="/pricing">See membership</Link>
          </Button>
          {course.preview && (
            <Button asChild variant="ghost" size="compact" className="mt-3 w-full">
              <Link href="/signin">Watch the free preview</Link>
            </Button>
          )}
        </div>
      </aside>

      <JsonLd data={courseJsonLd({ title: course.title, summary: course.promise, slug: course.slug })} />
    </div>
  );
}
