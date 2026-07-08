import Link from "next/link";
import { programs, trackingPrograms } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "البرامج — مواسم منظمة من العمل على الهوية",
  description: "تركيز واحد، ومجموعة واحدة، وتحوّل واحد في كل مرة. من ثمانية إلى اثني عشر أسبوعاً، خمس عشرة دقيقة يومياً.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <p className="eyebrow mb-3">البرامج</p>
        <h1 className="text-display-l font-medium">مواسم منظمة من العمل على الهوية.</h1>
        <p className="mt-4 max-w-2xl text-body-l text-muted-foreground">
          تركيز واحد، ومجموعة واحدة، وتحوّل واحد في كل مرة. لست متأكداً من أين تبدأ؟ خمسة
          أسئلة صادقة ستُخبرك — بما في ذلك ما إذا كان الآن ليس الوقت المناسب.
        </p>
      </Reveal>

      <div className="mt-12 space-y-6">
        {programs.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <InteractiveCard>
              <Link href={`/programs/${p.slug}`} className="block focus-visible:outline-none">
                <CardContent className="grid gap-6 p-8 md:grid-cols-[1fr_2fr_auto] md:items-center">
                  <div>
                    <p className="eyebrow mb-2">برنامج {p.number}</p>
                    <h2 className="text-display-m font-medium">{p.name}</h2>
                    <Badge className="mt-3">الدفعة القادمة: {p.meta.nextCohort}</Badge>
                  </div>
                  <div>
                    <p className="font-serif text-serif-feature italic">{p.promise}</p>
                    <p className="mt-3 font-mono text-label-mono uppercase text-muted-foreground">
                      {p.meta.weeks} أسابيع · {p.meta.minutesPerDay} دقيقة/يوم · مجموعة من {p.meta.cohort}
                    </p>
                  </div>
                  <span className="text-accent underline-offset-4 group-hover:underline" aria-hidden>
                    استكشف ←
                  </span>
                </CardContent>
              </Link>
            </InteractiveCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-20">
          <p className="eyebrow mb-3">برامج التتبع اليومي</p>
          <h2 className="text-display-m font-medium">ممارسة يومية، بنيّة واضحة.</h2>
          <p className="mt-3 max-w-2xl text-body-m text-muted-foreground">
            برامج مستقلة تعمل بجانب المواسم الجماعية أو بمفردها. مدد أقصر، عادات يومية مُحددة،
            وهوية واضحة لكل خطوة.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trackingPrograms.map((prog, i) => (
          <Reveal key={prog.slug} delay={0.15 + i * 0.07}>
            <InteractiveCard className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <Badge>{prog.level}</Badge>
                  <span className="font-mono text-label-mono text-muted-foreground">
                    {prog.duration} يوماً
                  </span>
                </div>
                <h3 className="mt-4 text-heading-s font-medium">{prog.name}</h3>
                <p className="mt-2 font-serif italic text-muted-foreground">{prog.tagline}</p>
                <p className="mt-3 flex-1 text-body-s text-muted-foreground">{prog.description}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="eyebrow mb-3">العادات اليومية</p>
                  <ul className="space-y-2">
                    {prog.habits.map((h) => (
                      <li key={h.name} className="flex items-start gap-2 text-body-s">
                        <span className="mt-0.5 shrink-0 font-mono text-label-mono text-accent">
                          {h.target}×
                        </span>
                        <span>{h.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 font-mono text-label-mono text-muted-foreground">
                  {prog.minutesPerDay} دقائق / اليوم
                </div>
              </CardContent>
            </InteractiveCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-14 rounded-r4 border border-border bg-card p-8 text-center">
          <h2 className="text-heading-s font-medium">سنُخبرك إذا لم يكن هذا مناسباً لك.</h2>
          <p className="mx-auto mt-2 max-w-xl text-body-s text-muted-foreground">
            فحص الملاءمة يُعيد توجيه الأشخاص غير المناسبين فعلاً — إلى الأدوات المجانية،
            أو إلى العلاج عندما يكون هو الباب الصحيح. هذا هو الهدف منه.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/lab/audit">ابدأ بالتشخيص المجاني</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
