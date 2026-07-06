import Link from "next/link";
import { courses } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "أكاديمية العقلية — علم الذات، مُعلَّم بشكل صحيح",
  description: "تعليم عميق ذاتي الإيقاع: أسس الثقة، إتقان المشاعر، الهوية والسرد.",
  path: "/academy",
});

const PATHS = [
  { name: "أسس الثقة", blurb: "من أين تأتي الثقة فعلاً، ولماذا تتذبذب حين تتذبذب، وبنية الممارسة التي تُثبّتها." },
  { name: "إتقان المشاعر", blurb: "التنظيم لا الكبت: فسيولوجيا الشعور، والمهارات التي توسّع الفجوة بين المحفز والاستجابة." },
  { name: "الهوية والسرد", blurb: "الطبقة الأعمق: كيف تتشكّل قصة الذات وتتصلّب — وبالأدوات الصحيحة، تُعاد كتابتها." },
];

export default function AcademyPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <p className="eyebrow mb-3">أكاديمية العقلية</p>
        <h1 className="text-display-l font-medium">علم الذات، مُعلَّم بشكل صحيح.</h1>
        <p className="mt-3 max-w-2xl text-body-l text-muted-foreground">
          البرامج تُغيّرك على جدول زمني. الأكاديمية هي الشيء الآخر: فهم عميق ذاتي الإيقاع،
          للأشخاص الذين يثقون بالأفكار أكثر حين يرون الآلية.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PATHS.map((p, i) => {
          const pathCourses = courses.filter((c) => c.path === p.name);
          return (
            <Reveal key={p.name} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="p-7">
                  <p className="eyebrow mb-3">المسار {String(i + 1).padStart(2, "0")}</p>
                  <h2 className="text-heading-s font-medium">{p.name}</h2>
                  <p className="mt-3 text-body-s text-muted-foreground">{p.blurb}</p>
                  <p className="mt-5 font-mono text-label-mono uppercase text-muted-foreground">
                    {pathCourses.length} دورات
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 text-center">
          <Button asChild variant="secondary">
            <Link href="/courses">استعرض جميع الدورات ←</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
