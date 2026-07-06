import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "المشاع — افعل العمل الهادئ في صحبة طيبة",
  description: "دوائر من 6 إلى 8، ومنتدى حيث كل منشور يُعلن ما يسعى إليه، وردود الفعل الوحيدة هي 'أراك'.",
  path: "/community",
});

const PANELS = [
  { title: "الدوائر", body: "ستة إلى ثمانية أعضاء، مُتطابقون حسب النية والتوقيت الزمني، وسؤال موجَّه واحد في الأسبوع. صغير بما يكفي لأن يُلاحَظ الغياب بلطف؛ ومنظم بما يكفي لأن لا أحد يحتاج إلى الأداء." },
  { title: "المنتدى", body: "كل منشور يُعلن ما يسعى إليه — دعم، أو وجهات نظر، أو مساءلة — لتحصل على ما طلبته، لا على نصيحة لم تطلبها. ردود الفعل الوحيدة هي 'أراك'. لا أعداد للتنافس عليها." },
  { title: "الطقوس المباشرة", body: "الممارسة المفتوحة أيام الأربعاء: عشرون دقيقة من العمل المشترك على نفسك، الكاميرات اختيارية. محادثات شهرية مع الباحثين. قصص الحافة الفصلية — النسخة الحقيقية، مع الانتكاسات." },
];

const CULTURE = [
  "نشهد. لا نُصلح.",
  "لا نصيحة إلا إذا طُلبت. (تسميات 'أسعى إلى' قانون.)",
  "الإنجازات أدلة، ليست افتخاراً. انشرها.",
  "ما يُشارَك هنا، يبقى هنا.",
  "الصراع موضوع مطروح. الأزمة تستحق أكثر مما نستطيع — وسنقول ذلك دائماً، مع روابط لا محاضرات.",
];

export default function CommunityPage() {
  return (
    <>
      <section className="bg-ink-950 py-s10 text-bone-50">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-4 !text-ink-300">المشاع</p>
            <h1 className="max-w-2xl text-display-l font-medium">افعل العمل الهادئ في صحبة طيبة.</h1>
            <p className="mt-6 max-w-xl font-serif text-serif-feature italic text-ink-300">
              الراوي يعمل بشكل أفضل في العزلة — فهو أقل إقناعاً بكثير في غرفة يمتلك فيها ستة
              أشخاص آخرون الراوي ذاته.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-s9">
        <div className="container grid gap-6 md:grid-cols-3">
          {PANELS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="p-7">
                  <h2 className="text-heading-s font-medium">{p.title}</h2>
                  <p className="mt-3 text-body-s text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card py-s9">
        <div className="container max-w-2xl">
          <Reveal>
            <h2 className="text-display-m font-medium">الثقافة، مُعلَنةً.</h2>
            <ul className="mt-8 space-y-4">
              {CULTURE.map((rule) => (
                <li key={rule} className="border-r-2 border-r-foreground pr-5 font-serif text-body-l">
                  {rule}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-s9 text-center">
        <div className="container">
          <p className="text-body-l text-muted-foreground">
            الأسماء المستعارة مرحّب بها. لا أعداد متابعين. لا رسائل مباشرة إلا إذا وافق الطرفان.
          </p>
          <Button asChild className="mt-6">
            <Link href="/pricing">المشاع يبدأ مع مستوى الممارسة ←</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
