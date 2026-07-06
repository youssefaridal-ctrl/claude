import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { listPublishedArticles } from "@/server/services/content";

export const metadata = buildMetadata({
  title: "المقالات — فكرة واحدة لكل قطعة، الآلية مُسمَّاة",
  description: "كتابة معمّقة عن الثقة، والحديث الذاتي، والهوية. يُنشر أيام الثلاثاء والخميس.",
  path: "/blog",
});

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const all = await listPublishedArticles();
  const essays = all.filter((a) => a.type !== "EXERCISE");
  const [feature, ...rest] = essays;

  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">المقالات</p>
      <h1 className="text-display-l font-medium">فكرة واحدة لكل قطعة.</h1>

      {feature && (
        <Link href={`/blog/${feature.slug}`} className="group mt-12 block border-b border-border pb-10">
          <p className="eyebrow mb-3">{feature.category} · مميّز</p>
          <h2 className="font-serif text-display-m leading-tight group-hover:underline group-hover:underline-offset-4">
            {feature.title}
          </h2>
          <p className="mt-3 text-body-l text-muted-foreground">{feature.dek}</p>
          <p className="mt-4 font-mono text-label-mono uppercase text-muted-foreground">
            {feature.author} · {feature.minutes} دقائق قراءة
          </p>
        </Link>
      )}

      <ul>
        {rest.map((a) => (
          <li key={a.slug} className="border-b border-border">
            <Link href={`/blog/${a.slug}`} className="group block py-8">
              <p className="eyebrow mb-2">{a.category}</p>
              <h2 className="text-heading-s font-medium group-hover:underline group-hover:underline-offset-4">
                {a.title}
              </h2>
              <p className="mt-2 text-body-s text-muted-foreground">{a.dek}</p>
              <p className="mt-3 font-mono text-label-mono uppercase text-muted-foreground">
                {a.author} · {a.minutes} دقائق قراءة
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
