import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, InteractiveCard, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "مختبر الثقة — تجارب للصوت الداخلي",
  description: "جرّب الآن — بلا حساب، بلا التزام. ابدأ بتشخيص الحوار الداخلي المجاني.",
  path: "/lab",
});

const EXPERIMENTS = [
  { name: "آلة إعادة الكتابة", time: "5 دقائق", mechanism: "إعادة التقييم", promise: "أحضر جملة قاسية. اغادر بجملة تؤمن بها.", free: true },
  { name: "غرفة التدريب", time: "8 دقائق", mechanism: "التعرض التدريجي", promise: "درّب المحادثة الصعبة قبل أن تكون المخاطر حقيقية.", free: false },
  { name: "سباق الأدلة", time: "3 دقائق", mechanism: "إعادة البناء", promise: "شك واحد في مواجهة خمس حقائق من تاريخك. الشك نادراً ما ينجو.", free: true },
  { name: "خزينة الإطراء", time: "دقيقتان", mechanism: "تسجيل البيانات الإيجابية", promise: "احفظ الثناء لحظة وصوله، ليوم يحذفه فيه ذاكرتك.", free: false },
  { name: "بنّاء نص الحد", time: "10 دقائق", mechanism: "الحزم", promise: "الكلمات لـ'لا'، في لهجتك، جاهزة قبل أن تحتاجها.", free: false },
  { name: "سلّم الخوف", time: "10 دقائق", mechanism: "التعرض التدريجي", promise: "حوّل تجنباً واحداً إلى ثماني خطوات قابلة للتسلق.", free: true },
];

export default function LabPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <p className="eyebrow mb-3">مختبر الثقة</p>
        <h1 className="text-display-l font-medium">تجارب للصوت الداخلي.</h1>
        <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
          جرّب الآن — بلا حساب، بلا التزام.
        </p>
      </Reveal>

      {/* التشخيص — البطاقة المهيمنة */}
      <Reveal delay={0.1}>
        <Card className="mt-10 bg-gradient-to-br from-card to-muted">
          <CardContent className="grid gap-6 p-10 md:grid-cols-[2fr_auto] md:items-center">
            <div>
              <Badge variant="solar">ابدأ هنا · مجاني · بلا تسجيل</Badge>
              <h2 className="mt-4 text-display-m font-medium">تشخيص الحوار الداخلي</h2>
              <p className="mt-3 max-w-lg text-body-m text-muted-foreground">
                اثنا عشر سؤالاً. أربع دقائق. ملفك الشخصي للحوار — أي راوٍ يُشغّل سيناريوك،
                وماذا تفعل حياله — فوراً، قبل أن نطلب منك بريدك الإلكتروني.
              </p>
            </div>
            <Button asChild>
              <Link href="/lab/audit">ابدأ</Link>
            </Button>
          </CardContent>
        </Card>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {EXPERIMENTS.map((e, i) => (
          <Reveal key={e.name} delay={Math.min(i, 5) * 0.05}>
            <InteractiveCard className="h-full">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2">
                  <Badge>{e.time}</Badge>
                  <Badge variant="filled">{e.mechanism}</Badge>
                  {!e.free && <Badge className="mr-auto">أعضاء</Badge>}
                </div>
                <h3 className="mt-4 text-body-l font-medium">{e.name}</h3>
                <p className="mt-2 flex-1 text-body-s text-muted-foreground">{e.promise}</p>
                <p className="mt-4 text-body-s text-accent">قادم إلى المختبر ←</p>
              </CardContent>
            </InteractiveCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
