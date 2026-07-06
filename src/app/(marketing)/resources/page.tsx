import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "الموارد — مساعدة حقيقية، وكتب صادقة، ومتى تطلب العلاج",
  description: "خطوط الأزمات أولاً. ثم قائمة القراءة، مع ملاحظات صادقة على كل توصية.",
  path: "/resources",
});

const BOOKS = [
  { title: "Chatter — إيثان كروس", note: "أبحاث الحديث عن الذات بالمسافة، من الباحث نفسه. من هنا جاء تمرين التحويل بالاسم." },
  { title: "Feeling Good — ديفيد بيرنز", note: "الكلاسيكية في العلاج المعرفي السلوكي. نبرة قديمة، أدوات راسخة." },
  { title: "Self-Compassion — كريستين نيف", note: "الحجة البحثية للتخلي عن السوط." },
  { title: "Atomic Habits — جيمس كلير", note: "العادة المبنية على الهوية، مُقدَّمة بشكل جيد." },
  { title: "Science Fictions — ستيوارت ريتشي", note: "كيف تُبالغ الأبحاث في ادعاءاتها — حتى تقرأ الجميع، بمن فيهم نحن، بحدة أكبر." },
];

export default function ResourcesPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">الموارد</p>
      <h1 className="text-display-l font-medium">أبواب تتخطى بابنا.</h1>

      {/* شريط الأزمات — دائماً أولاً، هادئ بصرياً لكن لا يُغفَل */}
      <Card className="mt-10 border-r-2 bg-card" style={{ borderRightColor: "hsl(210 25% 45%)" }}>
        <CardContent className="p-8">
          <h2 className="text-heading-s font-medium">إذا كنت في أزمة، ابدأ هنا — اليوم، مجاناً.</h2>
          <ul className="mt-4 space-y-2 text-body-m text-muted-foreground">
            <li>· <strong className="text-foreground">988</strong> — خط الانتحار والأزمات (الولايات المتحدة)، اتصل أو أرسل رسالة، على مدار الساعة</li>
            <li>· <strong className="text-foreground">findahelpline.com</strong> — خطوط موثّقة في معظم دول العالم</li>
            <li>· رقم الطوارئ المحلي، إذا كنت في خطر فوري</li>
          </ul>
          <p className="mt-4 text-body-s text-muted-foreground">
            سيلف تعليم وممارسة، وليس علاجاً. طلب مساعدة أكبر مما يُقدمه تطبيق ليس فشلاً في الممارسة —
            قد يكون أشجع تمرين فيها.
          </p>
        </CardContent>
      </Card>

      <section className="mt-14">
        <h2 className="eyebrow mb-4">متى تطلب العلاج — الدليل الصادق</h2>
        <p className="text-body-m text-muted-foreground">
          إذا لم يكن صوتك الداخلي راوياً قاسياً بل انعدام قيمة أو يأس مستمر؛ إذا كان القلق يُعطّل
          النوم أو العمل أو العلاقات لأسابيع؛ إذا كان هناك صدمة تحت السيناريوهات — يعمل المعالج الجيد
          على عمق أدواتنا لا تصله. كثير من الأعضاء يستخدمون الاثنين. كثير من المعالجين يُفضّلون ذلك.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="eyebrow mb-4">رف القراءة — مع ملاحظات صادقة</h2>
        <ul className="divide-y divide-border">
          {BOOKS.map((b) => (
            <li key={b.title} className="py-4">
              <p className="text-body-m font-medium">{b.title}</p>
              <p className="mt-1 text-body-s text-muted-foreground">{b.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
