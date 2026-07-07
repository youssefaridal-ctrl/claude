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
  { title: "Self-Compassion — كريستين نيف", note: "الحجة البحثية للتخلي عن السوط. أصعب قراءةً مما يبدو." },
  { title: "Atomic Habits — جيمس كلير", note: "العادة المبنية على الهوية، مُقدَّمة بشكل جيد." },
  { title: "The Body Keeps the Score — بيسيل فان در كولك", note: "ليس لكل شخص، لكن لمن يحسّ أن الصوت الداخلي له ثقل جسدي لا يتجاوبه التفكير وحده." },
  { title: "Mindset — كارول دويك", note: "التمييز بين عقلية النمو والثبات — مفيد لكنه يُبسّط. اقرأه مع المصادر الأولية." },
  { title: "The Gifts of Imperfection — بريني براون", note: "الكمالية كدرع لا كفضيلة. لهجة دافئة، حجة قوية." },
  { title: "Science Fictions — ستيوارت ريتشي", note: "كيف تُبالغ الأبحاث في ادعاءاتها — حتى تقرأ الجميع، بمن فيهم نحن، بحدة أكبر." },
];

const ARABIC_RESOURCES = [
  { title: "قوة اللحظة الحاضرة — إيكهارت تول (ترجمة)", note: "الصوت الداخلي من زاوية الحضور لا الإصلاح. مدخل مختلف لنفس المشكلة." },
  { title: "العادات الذرية — جيمس كلير (ترجمة خضر الآغا)", note: "الترجمة العربية الأكثر انتشاراً، قراءة أيسر من الإنجليزية للكثيرين." },
  { title: "التفكير السريع والبطيء — دانيال كانيمان (ترجمة)", note: "الأساس المعرفي لكثير مما نبنيه عليه — نظام واحد واثنين، وكيف تُضلّلنا اختصاراتنا الذهنية." },
  { title: "ثلاثية التغيير — بروناء موريتزي (بالعربية)", note: "كتاب عربي أصيل في علم النفس الإيجابي التطبيقي. نادر في هذه الفئة." },
];

const PODCASTS = [
  { title: "Hidden Brain — شانكار فيدانتام", note: "علم النفس الاجتماعي بسرد ممتاز. حلقات عن الحديث الداخلي والتحيزات المعرفية." },
  { title: "Therapist Uncensored", note: "علم الأعصاب والارتباط، شرح مُيسَّر للأبحاث. مفيد لفهم لماذا الممارسة تعمل." },
  { title: "The Happiness Lab — لوري سانتوس", note: "الفجوة بين ما نظن أنه يُسعدنا وما يُسعدنا فعلاً — بأدلة." },
  { title: "We Can Do Hard Things — غلينون دويل", note: "محادثات صادقة عن العيش رغم الضعف. ليست كلينيكية، لكنها صادقة." },
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
        <h2 className="eyebrow mb-4">رف القراءة — بالإنجليزية</h2>
        <ul className="divide-y divide-border">
          {BOOKS.map((b) => (
            <li key={b.title} className="py-4">
              <p className="text-body-m font-medium">{b.title}</p>
              <p className="mt-1 text-body-s text-muted-foreground">{b.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="eyebrow mb-4">بالعربية</h2>
        <p className="mb-4 text-body-s text-muted-foreground">
          المحتوى العلمي في علم النفس التطبيقي لا يزال شحيحاً بالعربية. هذه أفضل ما وجدناه — ترجمات وكتب أصيلة.
        </p>
        <ul className="divide-y divide-border">
          {ARABIC_RESOURCES.map((r) => (
            <li key={r.title} className="py-4">
              <p className="text-body-m font-medium">{r.title}</p>
              <p className="mt-1 text-body-s text-muted-foreground">{r.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="eyebrow mb-4">بودكاست يستحق وقتك</h2>
        <ul className="divide-y divide-border">
          {PODCASTS.map((p) => (
            <li key={p.title} className="py-4">
              <p className="text-body-m font-medium">{p.title}</p>
              <p className="mt-1 text-body-s text-muted-foreground">{p.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-r3 border border-border bg-card p-6">
        <h2 className="text-heading-s font-medium">ملاحظة في الشفافية</h2>
        <p className="mt-2 text-body-s text-muted-foreground">
          لا توجد روابط تابعة في هذه الصفحة. لا نُكسب من أي كتاب أو بودكاست أو خدمة مُدرجة هنا.
          التوصية مبنية على الفائدة الفعلية أو الأساس البحثي فحسب.
        </p>
      </section>
    </div>
  );
}
