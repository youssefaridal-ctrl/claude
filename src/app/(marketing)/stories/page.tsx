import Link from "next/link";
import { stories } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "القصص — النسخة الحقيقية، بما فيها الانتكاسات",
  description: "قصص توثيقية من الأعضاء: الجملة الأولى، والممارسة، والانتكاسة، والصوت الذي يملكونه الآن.",
  path: "/stories",
});

export default function StoriesPage() {
  return (
    <div className="bg-ink-950 text-bone-50">
      <div className="container py-s9">
        <p className="eyebrow mb-3 !text-ink-300">القصص</p>
        <h1 className="max-w-2xl text-display-l font-medium">النسخة الحقيقية، بما فيها الانتكاسات.</h1>
        <p className="mt-4 max-w-xl text-body-l text-ink-300">
          بلا دراما قبل/بعد، ولا ادعاءات مالية. مشاركة بموافقة، تُروى مع الأجزاء الصعبة كاملةً.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stories.map((s) => (
            <InteractiveCard key={s.slug} className="border-ink-700 bg-ink-900">
              <Link href={`/stories/${s.slug}`} className="block h-full focus-visible:outline-none">
                <CardContent className="p-8">
                  <Badge className="border-ink-700 !text-ink-300">{s.situation}</Badge>
                  <p className="mt-6 font-serif text-serif-feature text-ink-500 line-through decoration-1">
                    &ldquo;{s.before}&rdquo;
                  </p>
                  <p className="mt-4 font-serif text-serif-feature text-bone-50">&ldquo;{s.after}&rdquo;</p>
                  <p className="mt-8 font-mono text-label-mono uppercase text-ink-300">
                    {s.name}، {s.age} · {s.role}
                  </p>
                </CardContent>
              </Link>
            </InteractiveCard>
          ))}
        </div>

        <p className="mt-10 text-body-s text-ink-500">
          قصص الإطلاق عبارة عن مركّبات مستخلصة من أنماط شائعة بين الأعضاء، وتفاصيل مُغيَّرة — ومُوسَمة كذلك.
          القصص الحقيقية بموافقة تحل محلها كلما تطوّع الأعضاء. النتائج تتفاوت؛ إليك منهجيتنا.
        </p>
      </div>
    </div>
  );
}
