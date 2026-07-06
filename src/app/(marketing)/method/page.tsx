import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { RewriteDemo } from "@/components/method/rewrite-demo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "منهج سيلف — نظام لإعادة كتابة الصوت الذي تُفكّر به",
  description:
    "ثلاث حركات — التشخيص، وإعادة الكتابة، والتمرين. اثنتا عشرة دقيقة يومياً، مؤسَّسة على كيفية تغيّر الدماغ فعلاً.",
  path: "/method",
});

const NARRATORS = [
  { name: "الكمالي", line: '"إذا لم يكن عديم العيوب، فهو فشل."', note: "يخلط بين المعايير والأمان." },
  { name: "الحارس", line: '"لا تحاول، ولن تخسر."', note: "يبيع الحماية، ويُوصّل الضآلة." },
  { name: "الشبح", line: '"خذ مساحة أقل."', note: "تعلّم الاختفاء وأدّاه كلياقة." },
  { name: "المدّعي", line: '"دعنا نراجع كل ما أخطأت فيه."', note: "يُدير محكمة الثانية صباحاً." },
  { name: "المُرضي", line: '"أسعِدهم وستكون في أمان."', note: "يتاجر بالذات مقابل الموافقة، يومياً." },
  { name: "المتنبئ", line: '"ستسوء الأمور. دائماً ما يحدث هذا."', note: "يتنبأ بالألم ويُسمّيه واقعية." },
];

const SCIENCE = [
  { claim: "تسمية المشاعر يهدّئ الدماغ.", detail: "تسمية المشاعر تُخمد نشاط اللوزة الدماغية مع تفعيل مناطق المعالجة الأمامية التنظيمية. الراوي يصبت في اللحظة التي يُسمَّى فيها." },
  { claim: "إعادة التأطير تُغيّر المشاعر، لا مجرد الأفكار.", detail: "إعادة التقييم المعرفي من بين استراتيجيات تنظيم المشاعر الأكثر دراسةً، مع تأثيرات موثوقة على المشاعر السلبية." },
  { claim: "مخاطبة نفسك باسمك يُنشئ مسافة نافعة.", detail: "الحوار الذاتي البعيد يُخفّض التفاعلية، حتى في ظل الضغط الاجتماعي، بتكلفة معرفية منخفضة بشكل لافت." },
  { claim: "تأكيد القيم — لا الصفات — يُخفّض الدفاعية.", detail: "التأكيد الذاتي القائم على القيم يُخفّف التهديد ويُحسّن تقبّل التغذية الراجعة الصعبة. 'أنا رائع' لا يفعل ذلك." },
  { claim: "الهوية تُقوّد العادات أكثر من الإرادة.", detail: "العادات المرتبطة ببيانات الهوية وخطط 'إذا-ثم' تتجاوز الدافعية في مداها بتصميم." },
  { claim: "الدماغ يبقى قابلاً للتشكّل.", detail: "الممارسة الموجّهة ذاتياً تُغيّر الشبكات الدماغية فيزيائياً في كل الأعمار. أبطأ عند الخمسين مقارنة بالخامسة عشرة — ومتاح تماماً." },
];

export default function MethodPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink-950 py-s10 text-bone-50">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6 !text-ink-300">منهج سيلف</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-3xl text-display-l font-medium">
              نظام لإعادة كتابة الصوت الذي تُفكّر به.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-body-l text-ink-300">
              ثلاث حركات. اثنتا عشرة دقيقة يومياً. مؤسَّسة على كيفية تغيّر الدماغ فعلاً.
            </p>
          </Reveal>
        </div>
      </section>

      {/* المشكلة بدقة */}
      <section className="bg-ink-950 pb-s10 text-bone-50">
        <div className="container grid gap-8 md:grid-cols-3">
          {[
            "حوارك الداخلي يُدير تعليقاً مستمراً — توقعات، وأحكام، وإعادة تشغيل. معظمه لا تسمعه. أنت فقط تعيش داخل استنتاجاته.",
            "معظم تلك النصوص صِيغت في وقت مبكر، من قِبَل أشخاص آخرين: تنهيدة أحد الوالدين، ملاحظة معلم في الهامش، غرفة ضحكت في اللحظة الخطأ. لم تُحدَّث منذ ذلك الحين.",
            "لقد كنت تُحرّر سلوكك — مزيد من التحضير، مزيد من الإنجاز، مزيد من الدروع — بينما النص هو من يكتب السلوك. اعمل في المنبع.",
          ].map((text, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border-r border-ink-700 pr-6">
                <p className="eyebrow mb-3 !text-solar-500">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-body-m text-ink-100">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* الحركة الأولى — التشخيص */}
      <section className="bg-background py-s10">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-3">01 / التشخيص</p>
            <h2 className="text-display-m font-medium">لا يمكنك إعادة كتابة نص لم تقرأه قط.</h2>
            <p className="mt-4 max-w-2xl text-body-l text-muted-foreground">
              يجعل التشخيص الصوت غير المرئي مرئياً. يلتقي معظم الناس براويهم المهيمن خلال
              أربع دقائق — والتعرف جسدي، صدمة باردة صغيرة من <em>آه، هذا يُدير حياتي.</em>
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NARRATORS.map((n, i) => (
              <Reveal key={n.name} delay={Math.min(i, 5) * 0.06}>
                <article className="h-full rounded-r3 border border-border bg-card p-6">
                  <h3 className="text-body-m font-medium">{n.name}</h3>
                  <p className="mt-2 font-serif italic text-muted-foreground">{n.line}</p>
                  <p className="mt-2 text-body-s text-muted-foreground">{n.note}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/lab/audit">تعرّف على راويك — 4 دقائق، مجاناً</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* الحركة الثانية — إعادة الكتابة */}
      <section className="border-t border-border bg-background py-s10">
        <div className="container grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow mb-3">02 / إعادة الكتابة</p>
              <h2 className="text-display-m font-medium">ليست تأكيدات. بل تأليف.</h2>
              <p className="mt-4 text-body-l text-muted-foreground">
                الوقوف أمام مرآة والصراخ "أنا واثق" يفشل لسبب: العقل يرفض العبارات
                التي لا يستطيع التحقق منها. إعادة الكتابة تبني جملاً تصمد أمام
                استجوابك الخاص — باستخدام ثلاث عمليات من العلوم المعرفية.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <RewriteDemo />
          </Reveal>
        </div>
      </section>

      {/* الحركة الثالثة — التمرين */}
      <section className="border-t border-border bg-background py-s10">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-3">03 / التمرين</p>
            <h2 className="max-w-2xl text-display-m font-medium">
              يصبح الصوت صوتك بالطريقة ذاتها التي يصبح بها اللهجة: التكرار.
            </h2>
            <p className="mt-4 max-w-2xl text-body-l text-muted-foreground">
              الفهم يتلاشى في اثنتين وسبعين ساعة تقريباً دون ممارسة. حركة التمرين تحوّل
              جملك المعاد كتابتها إلى ممارسة يومية — جلسات منظمة قصيرة، وبروفات قبل اللحظات
              الصعبة، وسجل الهوية، حيث يُسجَّل كل فعل شجاع كدليل. اثنتا عشرة دقيقة
              يومياً، في معظم الأيام. هذا كل الطلب.
            </p>
          </Reveal>
        </div>
      </section>

      {/* الطبقة العلمية */}
      <section className="bg-card py-s10">
        <div className="container">
          <Reveal>
            <h2 className="text-display-m font-medium">الآليات، مُسمَّاةً.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SCIENCE.map((s, i) => (
              <Reveal key={s.claim} delay={Math.min(i, 5) * 0.05}>
                <details className="group rounded-r3 border border-border bg-background p-6">
                  <summary className="cursor-pointer list-none text-body-m font-medium marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    {s.claim}
                    <span aria-hidden className="float-left text-muted-foreground transition-transform duration-fast group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-3 text-body-s text-muted-foreground">{s.detail}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ما ليس هذا */}
      <section className="bg-background py-s10">
        <div className="container max-w-3xl">
          <Reveal>
            <h2 className="text-display-m font-medium">ما ليس هذا.</h2>
            <ul className="mt-6 space-y-3 text-body-l text-muted-foreground">
              <li>— ليس تأكيدات يُصرخ بها أمام المرايا.</li>
              <li>— ليس إيجابية سامة. بعض الأفكار دقيقة وتستحق الفعل، لا إعادة التأطير.</li>
              <li>— ليس زرع شخصية. الانطوائيون يبقون انطوائيين، بصوت أكثر ثباتاً.</li>
              <li>
                — <strong className="text-foreground">ليس علاجاً نفسياً</strong> — وسنقوله بوضوح
                كلما كان العلاج هو الباب الصحيح. <Link href="/resources" className="underline underline-offset-4">الموارد ←</Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="bg-ink-950 py-s10 text-center text-bone-50">
        <div className="container">
          <Badge variant="solar" className="mb-6">ابدأ من حيث يبدأ الجميع</Badge>
          <h2 className="text-display-m font-medium">أربع دقائق من الصدق.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-bone-50 text-ink-950">
              <Link href="/lab/audit">خذ التشخيص</Link>
            </Button>
            <Button asChild variant="ghost" className="text-bone-50 hover:bg-ink-900">
              <Link href="/programs">انظر البرامج ←</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
