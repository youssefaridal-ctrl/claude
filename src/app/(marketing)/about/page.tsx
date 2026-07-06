import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "من نحن — بُني من قِبَل أناس احتاجوه",
  description: "بدأ سيلف بسؤال في الثانية صباحاً: إذا كان الصوت الداخلي مُكتسَباً، فلماذا لا يُعلّم أحد إعادة كتابته؟",
  path: "/about",
});

const CHAPTERS = [
  { title: "I. الدفتر.", body: "النسخة الأولى من المنهج كانت نظاماً خاصاً: بطاقات فهرسة للأفكار القاسية على وجه، وجمل معاد بناؤها على الوجه الآخر، وقاعدة واحدة — لا تُعاد كتابة جملة بكذبة. يجب أن تكون موثوقة وإلا رفضها العقل. تلك القاعدة نجت من كل شيء جاء بعدها." },
  { title: "II. القراءة.", body: "ذهبنا نبحث عن إذن للأمل، ووجدنا ما هو أفضل: الآليات. عقود من الأبحاث حول إعادة التقييم، والمسافة الذاتية، والكتابة التعبيرية، والعادات القائمة على الهوية — صارمة، ومكررة، وغائبة تقريباً عن رف المساعدة الذاتية. العلم كان موجوداً. الترجمة لم تكن." },
  { title: "III. الآخرون.", body: "شاركنا النظام مع أصدقاء 'يمتلكون الأمور بيدهم'. كل واحد منهم كان لديه راوٍ. الكفاءة، كما تعلمنا، لا تُسكت الناقد. بل تُعطيه مادة أفضل." },
  { title: "IV. البناء.", body: "جمعنا الفريق الذي يستحقه هذا العمل: أطباء للحفاظ على الصدق، وباحثون للحفاظ على الدقة، وكتّاب للحفاظ على الإنسانية. كتبنا ثلاثة محظورات في وثائق التأسيس: لا مبالغة، ولا خزي، ولا ادعاء أن هذا يحل محل العلاج." },
  { title: "V. الهدف.", body: "نقيس النجاح بطريقة غريبة لشركة اشتراك: نصمم للتخرج. الهدف أن تلاحظ ذات يوم أنك توقفت عن الحاجة إلينا — وأن الصوت الذي تُفكّر به، أخيراً، هو صوتك." },
];

const VALUES = [
  { name: "العمق على المبالغة", receipt: "مقالاتنا تستشهد بمصادر أو تقول بصراحة متى تكون الأدلة شحيحة. تحقق من أي حاشية." },
  { name: "الدقة", receipt: "كل تمرين يُسمّي آليته وتكلفته الزمنية. لا 'افعل هذا، اشعر بتحسن' غامض." },
  { name: "الاستقلالية", receipt: "لا شيء يعمل تلقائياً، ولا شيء إلزامي، وكل تذكير يمكن إسكاته بنقرة واحدة." },
  { name: "الصرامة الدافئة", receipt: "رسائل الخطأ لدينا لن تُلومك أبداً. ولا رسائلنا الإلكترونية." },
  { name: "إمكانية الوصول الجذرية", receipt: "هدف WCAG 2.2 AAA، مُدقَّق مرتين سنوياً، المشكلات المعروفة منشورة." },
  { name: "الخصوصية ككرامة", receipt: "مذكرتك مشفّرة في التخزين، والمفاتيح محفوظة بعيداً عن الكلمات — والتشفير الكامل من طرف إلى طرف في خريطة الطريق العامة." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-background py-s9">
        <div className="container max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-4">عن سيلف</p>
            <h1 className="text-display-l font-medium">بُني من قِبَل أناس احتاجوه.</h1>
            <p className="mt-6 text-body-l text-muted-foreground">
              لم يبدأ سيلف كشركة. بدأ بسؤال كتبه أحدنا في دفتر في الثانية صباحاً، بعد يوم آخر
              من أداء الثقة التي لم نملكها: <em>إذا كان الصوت الداخلي مُكتسَباً، فلماذا لا يُعلّم
              أحد إعادة كتابته؟</em>
            </p>
          </Reveal>

          <div className="mt-14 space-y-10">
            {CHAPTERS.map((c, i) => (
              <Reveal key={c.title} delay={Math.min(i, 5) * 0.05}>
                <div>
                  <h2 className="font-serif text-serif-feature">{c.title}</h2>
                  <p className="mt-3 text-body-l leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* البيان */}
      <section className="bg-ink-950 py-s10 text-center text-bone-50">
        <div className="container max-w-2xl space-y-6">
          <Reveal><p className="font-serif text-serif-feature">نحن نؤمن بأن الصوت الداخلي ليس قدراً. إنه مسوّدة.</p></Reveal>
          <Reveal delay={0.1}>
            <p className="text-body-l text-ink-300">
              نختار البنية على الأدرينالين. والأدلة على الإلهام. والممارسة على الأداء.
              والعمق على الضوضاء.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-serif text-serif-feature text-solar-500">أنت الكاتب الآن. ابدأ.</p>
          </Reveal>
        </div>
      </section>

      {/* القيم بالأدلة */}
      <section className="bg-background py-s9">
        <div className="container max-w-3xl">
          <Reveal><h2 className="text-display-m font-medium">القيم، بالأدلة.</h2></Reveal>
          <div className="mt-8">
            {VALUES.map((v) => (
              <details key={v.name} className="group border-b border-border py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-body-m font-medium marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  {v.name}
                  <span aria-hidden className="text-muted-foreground transition-transform duration-fast group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-2 pb-2 text-body-s text-muted-foreground">{v.receipt}</p>
              </details>
            ))}
          </div>
          <Separator className="mt-10" />
          <div className="mt-10 text-center">
            <p className="text-body-l text-muted-foreground">
              الإيمان مكان جيد للبداية. الآلية مكان أفضل للوقوف.
            </p>
            <Button asChild className="mt-6">
              <Link href="/method">اقرأ كيف يعمل المنهج</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
