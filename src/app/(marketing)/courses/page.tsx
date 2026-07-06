import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { listPublishedCourses } from "@/server/services/content";

export const metadata = buildMetadata({
  title: "Courses — the Academy catalog",
  description: "Self-paced courses on self-talk, regulation, and identity. Every lesson ends in a rep.",
  path: "/courses",
});

export const revalidate = 3600;

export default async function CoursesPage() {
  const courses = await listPublishedCourses();

  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">Courses</p>
      <h1 className="text-display-l font-medium">The catalog.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <InteractiveCard key={c.slug}>
            <Link href={`/courses/${c.slug}`} className="block h-full focus-visible:outline-none">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex gap-2">
                  <Badge>{c.path}</Badge>
                  {c.preview && <Badge variant="solar">Free preview</Badge>}
                </div>
                <h2 className="mt-4 text-body-l font-medium">{c.title}</h2>
                <p className="mt-2 flex-1 text-body-s text-muted-foreground">{c.promise}</p>
                <p className="mt-4 font-mono text-label-mono uppercase text-muted-foreground">
                  {c.lessons} lessons · {c.hours}
                </p>
              </CardContent>
            </Link>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
