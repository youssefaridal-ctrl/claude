import Link from "next/link";
import { InteractiveCard, CardContent } from "@/components/ui/card";

const SCREENS = [
  { href: "/preview/today", name: "اليوم", blurb: "الصفحة اليومية: تمرين واحد، ثلاث بطاقات، لا شيء آخر. أجرِ التمرين — هو نبضة المنتج." },
  { href: "/preview/tracker", name: "متتبع العادات", blurb: "أسابيع مبنية على اللطف. بدّل نقاط الأيام؛ ستلاحظ ألا شيء يتحول إلى الأحمر أبداً." },
  { href: "/preview/journal", name: "المجلة", blurb: "كتابة بجزئين مع شارة التشفير وتسجيل المزاج." },
  { href: "/preview/planner", name: "مخطط الأهداف", blurb: "الهوية ← الموسم ← الخطوات. أنجز الخطوات؛ قوس الموسم يستجيب." },
  { href: "/preview/progress", name: "التقدم", blurb: "سجل الهوية، والبحث عن الأدلة المضادة، وراداري دلتا الفصلي." },
  { href: "/preview/commons", name: "المنتدى", blurb: 'منشورات بعلامات طلب ورد الفعل "أراك" — لا أعداد في أي مكان.' },
] as const;

export default function PreviewIndexPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">تطبيق الأعضاء · نموذج أولي تفاعلي</p>
      <h1 className="text-display-l font-medium">جوّل في المنتج كله.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        كل شاشة للأعضاء، تفاعلية، ببيانات نموذجية — بلا حساب، ولا شيء يُحفظ. الموقع العام
        و<Link href="/lab/audit" className="underline underline-offset-4">التشخيص الحقيقي</Link> حيّان من حوله؛
        هذا القسم يجلس عادةً خلف تسجيل الدخول.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SCREENS.map((s) => (
          <InteractiveCard key={s.href}>
            <Link href={s.href} className="block h-full focus-visible:outline-none">
              <CardContent className="p-6">
                <h2 className="text-body-l font-medium">{s.name}</h2>
                <p className="mt-2 text-body-s text-muted-foreground">{s.blurb}</p>
              </CardContent>
            </Link>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
