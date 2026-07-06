import Link from "next/link";
import { stories } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Success Stories — the true version, relapses included",
  description: "Documentary stories from members: the before-sentence, the practice, the relapse, and the voice they have now.",
  path: "/stories",
});

export default function StoriesPage() {
  return (
    <div className="bg-ink-950 text-bone-50">
      <div className="container py-s9">
        <p className="eyebrow mb-3 !text-ink-300">Stories</p>
        <h1 className="max-w-2xl text-display-l font-medium">The true version, relapses included.</h1>
        <p className="mt-4 max-w-xl text-body-l text-ink-300">
          No before/after theatrics, no income claims. Shared with consent, told with the hard parts left in.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stories.map((s) => (
            <InteractiveCard key={s.slug} className="border-ink-700 bg-ink-900">
              <Link href={`/stories/${s.slug}`} className="block h-full focus-visible:outline-none">
                <CardContent className="p-8">
                  <Badge className="border-ink-700 !text-ink-300">{s.situation}</Badge>
                  <p className="mt-6 font-serif text-serif-feature text-ink-500 line-through decoration-1">
                    “{s.before}”
                  </p>
                  <p className="mt-4 font-serif text-serif-feature text-bone-50">“{s.after}”</p>
                  <p className="mt-8 font-mono text-label-mono uppercase text-ink-300">
                    {s.name}, {s.age} · {s.role}
                  </p>
                </CardContent>
              </Link>
            </InteractiveCard>
          ))}
        </div>

        <p className="mt-10 text-body-s text-ink-500">
          Launch stories are composites drawn from common member patterns, details changed — and labeled so.
          Real consented stories replace them as members volunteer. Results vary; here's our methodology.
        </p>
      </div>
    </div>
  );
}
