import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "الصوت في رأسك كتبه أشخاص آخرون",
  description:
    "سيلف — منصة قائمة على الأدلة لإعادة بناء الثقة بالنفس: تشخّص حوارك الداخلي، تُعيد كتابته، وتتدرّب اثنتي عشرة دقيقة يومياً.",
  path: "/",
});

const CRITIC_LINES = [
  '"لا ترفع يدك إلا إذا كنت متأكداً تماماً."',
  '"سيكتشفون الحقيقة."',
  '"من تظن نفسك؟"',
  '"قل نعم الآن، واعتذر لنفسك لاحقاً."',
  '"الجميع يجد هذا سهلاً."',
];

const MOVEMENTS = [
  { number: "01 · التشخيص", title: "رسّم الصوت الذي تملكه.", body: "لا يمكنك إعادة كتابة نص لم تقرأه قط. أربع دقائق من الأسئلة الصادقة تكشف لك راويك الداخلي." },
  { number: "02 · إعادة الكتابة", title: "اكتب الصوت الذي تختاره.", body: "ليست تأكيدات — بل جمل دقيقة وموثوقة مبنية بأدوات العلوم المعرفية." },
  { number: "03 · التمرين", title: "تدرّب حتى يصبح صوتك.", body: "اثنتا عشرة دقيقة يومياً. تكرارات صادقة صغيرة، مسجّلة كأدلة، حتى يتوقف الصوت الجديد عن كونه جديداً." },
];

const PROGRAMS = [
  {
    number: "01",
    slug: "foundations",
    name: "الأسس",
    promise: "ثمانية أسابيع لصوت يقف بجانبك.",
    meta: "8 أسابيع · 15 دقيقة/يوم · مجموعة من 40",
    price: "490$",
  },
  {
    number: "02",
    slug: "the-voice",
    name: "الصوت",
    promise: "برنامج مكثف للجملة التي لا تستطيع إيقافها.",
    meta: "6 أسابيع · 15 دقيقة/يوم · مجموعة من 12",
    price: "590$",
  },
  {
    number: "03",
    slug: "unshakeable",
    name: "الراسخ",
    promise: "عندما تكبر الغرفة.",
    meta: "12 أسبوعاً · 20 دقيقة/يوم · بالتقديم",
    price: "1,190$",
  },
];

const EVIDENCE = [
  { stat: "71%", label: "يُفيدون بزيادة المشاركة خلال 8 أسابيع*" },
  { stat: "12 دقيقة", label: "متوسط الممارسة اليومية" },
  { stat: "ن = 1,204", label: "استطلاع الأعضاء 2025" },
  { stat: "30 يوماً", label: "نافذة الاسترداد، بلا استجواب" },
];

const STORIES = [
  {
    quote:
      "لم أكن بحاجة إلى إصلاح. كنت بحاجة إلى لغة لما كان يجري بداخلي. سيلف أعطاني إياها.",
    name: "أمارا أ.",
    detail: "مصممة منتجات · 6 أشهر",
  },
  {
    quote:
      "في الأسبوع الرابع لاحظت أنني توقفت عن التدرب على الاعتذارات قبل إرسال رسائل البريد الإلكتروني. هذا التغيير الصغير وحده قال كل شيء.",
    name: "توم ر.",
    detail: "مؤسس شركة ناشئة · 3 أشهر",
  },
  {
    quote:
      "إكمال التشخيص بصدق كان مُحرجاً. لكنه كان أيضاً أكثر أربع دقائق مفيدة قضيتها منذ سنوات.",
    name: "بريا ك.",
    detail: "باحثة سريرية · 8 أسابيع",
  },
  {
    quote:
      "أعطى التشخيص اسماً للصوت الذي كنت أعتقد دائماً أنه مجرد طريقة تفكيري. تلك الفجوة — بين الصوت وبيني — غيّرت الأمور.",
    name: "ناديا ر.",
    detail: "باحثة تجربة المستخدم · 10 أسابيع",
  },
  {
    quote:
      "كانت معالجتي وأنا ندور حول نفس الشيء منذ عامين. سيلف لم يحل محل ذلك العمل. بل أعطاه مكاناً للهبوط بين الجلسات.",
    name: "سارة ل.",
    detail: "معلمة مدرسة ثانوية · 5 أشهر",
  },
  {
    quote:
      "ألقيت محاضرة الشهر الماضي كنت سألغيها قبل ثلاثة أشهر. لم أستمتع بها — لكنني كنت موجوداً، وبقيت موجوداً. هذا جديد.",
    name: "جيمس ت.",
    detail: "معماري · 7 أشهر",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1.1 Hero */}
      <section className="relative flex min-h-[92vh] items-center bg-ink-950 text-bone-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,162,61,0.06),transparent_60%)]"
        />
        <div className="container relative">
          <Reveal>
            <p className="eyebrow mb-6 !text-ink-300">البنية الداخلية</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-4xl text-display-xl font-medium">
              الصوت في رأسك كتبه أشخاص آخرون.
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-6 font-serif text-serif-feature italic text-ink-100">استعد القلم.</p>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button asChild className="bg-bone-50 text-ink-950 hover:ring-solar-500">
                <Link href="/lab/audit">ابدأ بالتشخيص المجاني</Link>
              </Button>
              <Link href="/method" className="text-body-s text-ink-300 underline-offset-4 hover:text-bone-50 hover:underline">
                استكشف المنهج ←
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.2 Recognition strip */}
      <section aria-label="أصوات الناقد الداخلي" className="border-t border-ink-700 bg-ink-950 py-24 text-bone-50">
        <div className="container">
          <ul className="space-y-6">
            {CRITIC_LINES.map((line, i) => (
              <Reveal key={line} as="li" delay={i * 0.06}>
                <p className="font-serif text-serif-feature text-ink-300">{line}</p>
              </Reveal>
            ))}
            <Reveal as="li" delay={0.35}>
              <p className="font-serif text-serif-feature text-solar-500">
                لا شيء من هذا حقيقة. كل هذا مسوّدات.
              </p>
            </Reveal>
          </ul>
        </div>
      </section>

      {/* 1.3 Thesis */}
      <section className="bg-background py-s10">
        <div className="container grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="text-display-m font-medium">
                الثقة ليست شعوراً. بل هي بنية معمارية.
              </h2>
              <div className="mt-6 space-y-4 text-body-l text-muted-foreground">
                <p>
                  قيل لك أن الثقة شيء يُولد الناس به، أو شيء تجده — في قاع الإنجاز، على الجانب
                  الآخر من الخوف. ليست هذه ولا تلك. الثقة بنية: هوية تتمسك بها، وحوار يقوم عليها،
                  وجسم من الأدلة يُبقيها قائمة.
                </p>
                <p>
                  معظم تطوير الذات يعمل على السلوك ويأمل أن تتبعه الهوية. نادراً ما يحدث ذلك.
                  نحن نعمل في الاتجاه المعاكس — أولاً الهوية، ثم الحوار، ثم التكرارات التي
                  تجعله حقيقياً.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="hidden items-center justify-center lg:flex" aria-hidden>
              <ArchitectureDiagram />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.4 Method preview */}
      <section className="bg-background pb-s10">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {MOVEMENTS.map((m, i) => (
              <Reveal key={m.number} delay={i * 0.08}>
                <article className="h-full rounded-r3 border border-border bg-card p-6 shadow-elev-1 transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-elev-2">
                  <p className="eyebrow mb-4">{m.number}</p>
                  <h3 className="text-heading-s font-medium">{m.title}</h3>
                  <p className="mt-3 text-body-s text-muted-foreground">{m.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mt-8">
              <Link href="/method" className="text-accent underline-offset-4 hover:underline">
                المنهج الكامل ←
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 1.7 Evidence band */}
      <section aria-label="أرقام صادقة" className="border-y border-border bg-card py-16">
        <div className="container">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {EVIDENCE.map((e) => (
              <div key={e.stat} className="border-r border-border pr-6">
                <dt className="sr-only">{e.label}</dt>
                <dd className="text-display-m font-medium">{e.stat}</dd>
                <dd className="mt-1 font-mono text-label-mono uppercase text-muted-foreground">{e.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-body-s text-muted-foreground">
            *نتائج ذاتية التقرير من استطلاعنا السنوي للأعضاء.{" "}
            <Link href="/methodology" className="underline underline-offset-4">المنهجية الكاملة</Link>
          </p>
        </div>
      </section>

      {/* Stories */}
      <section aria-label="قصص الأعضاء" className="bg-background py-s10">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-3 text-center">قصص</p>
            <p className="mb-10 text-center text-body-m text-muted-foreground">بأصواتهم.</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((s, i) => (
              <Reveal key={s.name} delay={Math.min(i, 4) * 0.07}>
                <figure className="flex h-full flex-col rounded-r3 border border-border bg-card p-8 shadow-elev-1">
                  <blockquote className="flex-1 font-serif text-body-l leading-relaxed text-foreground">
                    &ldquo;{s.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-5">
                    <p className="font-mono text-label-mono uppercase text-muted-foreground">
                      {s.name} · {s.detail}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mt-10 text-center">
              <Link href="/stories" className="text-body-s text-accent underline-offset-4 hover:underline">
                اقرأ المزيد من القصص ←
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Programs preview */}
      <section className="border-y border-border bg-card py-s10">
        <div className="container">
          <Reveal>
            <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-2">البرامج</p>
                <h2 className="text-display-s font-medium">عمل منظم، لا مجرد محتوى.</h2>
              </div>
              <Link href="/programs" className="text-body-s text-accent underline-offset-4 hover:underline sm:pb-1">
                جميع البرامج ←
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link
                  href={`/programs/${p.slug}`}
                  className="group flex h-full flex-col rounded-r3 border border-border bg-background p-6 shadow-elev-1 transition-all duration-base ease-out-quart hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elev-2"
                >
                  <p className="eyebrow mb-4">{p.number}</p>
                  <h3 className="text-heading-s font-medium group-hover:underline group-hover:underline-offset-4">
                    {p.name}
                  </h3>
                  <p className="mt-3 flex-1 text-body-s text-muted-foreground">{p.promise}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <p className="font-mono text-label-mono uppercase text-muted-foreground">{p.meta}</p>
                    <p className="font-mono text-label-mono font-medium">{p.price}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 1.10 Final invitation */}
      <section className="bg-ink-950 py-s10 text-center text-bone-50">
        <div className="container">
          <Reveal>
            <h2 className="text-display-m font-medium">ابدأ بأربع دقائق من الصدق.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-body-l text-ink-300">التشخيص مجاني. النتائج لك في كلتا الحالتين.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button asChild className="bg-bone-50 text-ink-950">
                <Link href="/lab/audit">خذ تشخيص الحوار الداخلي</Link>
              </Button>
            </div>
            <p className="mt-4 font-mono text-label-mono uppercase text-ink-500">
              لا تسجيل مطلوب · النتائج فورية · خاص بتصميمه
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** مخطط هندسي بالطبقات الثلاث: الهوية → الحوار → الأدلة. */
function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm opacity-80"
      aria-hidden="true"
    >
      {/* الطبقة السفلى — الأدلة */}
      <g transform="translate(0, 120)">
        <path d="M40 80 L200 20 L360 80 L200 140 Z" stroke="hsl(var(--border))" strokeWidth="1" fill="hsl(var(--card))" />
        <text x="200" y="88" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="monospace" letterSpacing="2">الأدلة</text>
      </g>

      {/* الطبقة الوسطى — الحوار */}
      <g transform="translate(20, 60)">
        <path d="M40 80 L200 20 L360 80 L200 140 Z" stroke="hsl(var(--border))" strokeWidth="1" fill="hsl(var(--card))" fillOpacity="0.85" />
        <text x="200" y="88" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="monospace" letterSpacing="2">الحوار</text>
      </g>

      {/* الطبقة العليا — الهوية */}
      <g transform="translate(40, 0)">
        <path d="M40 80 L200 20 L360 80 L200 140 Z" stroke="hsl(var(--accent))" strokeWidth="1.5" fill="hsl(var(--card))" fillOpacity="0.95" />
        <text x="200" y="88" textAnchor="middle" fill="hsl(var(--accent))" fontSize="10" fontFamily="monospace" letterSpacing="2">الهوية</text>
      </g>

      {/* خطوط الربط */}
      <line x1="80" y1="200" x2="120" y2="140" stroke="hsl(var(--border))" strokeWidth="0.75" strokeDasharray="4 3" />
      <line x1="320" y1="200" x2="360" y2="140" stroke="hsl(var(--border))" strokeWidth="0.75" strokeDasharray="4 3" />
      <line x1="120" y1="140" x2="160" y2="80" stroke="hsl(var(--border))" strokeWidth="0.75" strokeDasharray="4 3" />
      <line x1="360" y1="140" x2="400" y2="80" stroke="hsl(var(--border))" strokeWidth="0.75" strokeDasharray="4 3" />
    </svg>
  );
}
