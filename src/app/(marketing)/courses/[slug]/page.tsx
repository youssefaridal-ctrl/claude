import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, courseJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return buildMetadata({ title: "Not found", noIndex: true });
  return buildMetadata({ title: course.title, description: course.promise, path: `/courses/${slug}` });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const lessons = Array.from({ length: course.lessons }, (_, i) => ({
    number: i + 1,
    title: i === 0 ? "Orientation: what you'll practice" : `Lesson ${i + 1}`,
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
