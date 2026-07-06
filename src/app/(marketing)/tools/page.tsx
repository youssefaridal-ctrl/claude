import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "أدوات مجانية وتنزيلات",
  description: "أوراق عمل قابلة للطباعة، وملف PDF لتسجيل الأفكار، والأدوات المجانية. بلا بوابات بريد إلكتروني إجبارية.",
  path: "/tools",
});

const TOOLS = [
  {
    name: "تشخيص الحوار الداخلي",
    format: "تفاعلي · 4 دقائق",
    href: "/lab/audit",
    note: "راويك، مُسمَّى. مجاني للأبد.",
    live: true,
  },
  {
    name: "عجلة الحياة",
    format: "تفاعلي · دقيقتان",
    href: "/tools/life-wheel",
    note: "قيّم ثمانية أبعاد في الحياة. الشكل يُظهر أين تتسرب الطاقة.",
    live: true,
  },
  {
    name: "تقييم القيم",
    format: "تفاعلي · 3 دقائق",
    href: "/tools/values",
    note: "ترتيب البطاقات على جولتين لاستخلاص قيمك الأساسية الخمس.",
    live: true,
  },
  {
    name: "ورقة تدقيق الحوار",
    format: "PDF قابل للطباعة",
    href: "#",
    note: "شبكة النصوص الحرفية لـ7 أيام — النسخة الورقية من الحركة الأولى.",
    live: false,
  },
  {
    name: "سجل المحكمة",
    format: "PDF قابل للطباعة",
    href: "#",
    note: "التهمة، والدليل، والقاضي العادل، والحكم المخفّف. فكرة واحدة لكل صفحة.",
    live: false,
  },
  {
    name: "بنّاء سلّم الخوف",
    format: "PDF قابل للطباعة",
    href: "#",
    note: "تجنّب واحد، وثماني درجات قابلة للتسلق، وأعمدة التوقع مقابل الواقع.",
    live: false,
  },
] as const;

export default function ToolsPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">الأدوات</p>
      <h1 className="text-display-l font-medium">مجاني، وفعلاً مجاني.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        بلا بوابات بريد إلكتروني. الأدوات التفاعلية تعمل هنا؛ والقابلة للطباعة تنزيلات مباشرة. الحقل
        في الأسفل عرض، وليس رسوم عبور.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <InteractiveCard key={t.name} className={!t.live ? "opacity-60" : ""}>
            <Link
              href={t.live ? t.href : "#"}
              className="block h-full focus-visible:outline-none"
              aria-disabled={!t.live}
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2">
                  <Badge className="w-fit">{t.format}</Badge>
                  {!t.live && <Badge variant="filled">قريباً</Badge>}
                </div>
                <h2 className="mt-4 text-body-l font-medium">{t.name}</h2>
                <p className="mt-2 flex-1 text-body-s text-muted-foreground">{t.note}</p>
              </CardContent>
            </Link>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
