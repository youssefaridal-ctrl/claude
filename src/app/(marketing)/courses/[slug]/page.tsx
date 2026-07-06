import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, courseJsonLd } from "@/lib/seo";
import { getCourseBySlug, listPublishedCourses } from "@/server/services/content";

const LESSON_TITLES: Record<string, string[]> = {
  "the-anatomy-of-self-talk": [
    "التوجيه: ما ستمارسه",
    "من أين يأتي الصوت الداخلي",
    "الراوي: تحديده وتسميته",
    "توقيت الصوت: لماذا يظهر حين يظهر",
    "المسافة بين الصوت والحقيقة",
    "أنماط الحوار الداخلي: تشخيصك الشخصي",
  ],
  "the-confidence-equation": [
    "التوجيه: ما ستمارسه",
    "ما الثقة فعلاً — وما ليست",
    "كيف يُقيّم دماغك الأدلة عنك",
    "تحيز التأكيد: كيف يُزوّر ميزانك الداخلي",
    "بناء سجل الأدلة خطوة بخطوة",
  ],
  "practice-architecture": [
    "التوجيه: ما ستمارسه",
    "لماذا تنهار الممارسة — التشخيص الجذري",
    "تصميم الدورة اليومية: الاثنتا عشرة دقيقة",
    "خطط التنفيذ: إذا-ثم",
    "الصيانة: العودة بعد الانقطاع",
  ],
  "emotions-are-data": [
    "التوجيه: ما ستمارسه",
    "فسيولوجيا المشاعر — ما يحدث فعلاً في جسدك",
    "الفجوة بين المحفز والاستجابة",
    "تسمية المشاعر: الأثر العصبي",
    "قراءة الإشارة بدون طاعة الأمر",
    "خريطة أنماطك العاطفية",
  ],
  "the-regulation-toolkit": [
    "التوجيه: ما ستمارسه",
    "التنفس كأداة: الفسيولوجيا والتطبيق الفوري",
    "التسمية اللفظية وأثرها في خفض التنشيط",
    "إعادة التقييم الإدراكي: إطار جديد لنفس الحدث",
    "الأدوات الجسدية: الوضعية والحركة",
    "قبول المشاعر بدون اندماج",
    "بناء مجموعة أدواتك الشخصية",
  ],
  "the-criticism-metabolism": [
    "التوجيه: ما ستمارسه",
    "لماذا التغذية الراجعة تؤلم حتى حين تكون صحيحة",
    "فرز المعلومة عن الحكم: الأداة المحورية",
    "بروتوكول الاستجابة: من الاستقبال إلى القرار",
  ],
  "where-your-story-came-from": [
    "التوجيه: ما ستمارسه",
    "كيف تتشكّل هوية الذات وتتصلّب",
    "علم آثار المعتقدات: تتبع مصدر قصتك",
    "نصوص الأسرة والثقافة في حوارك الداخلي",
    "بطاقة المتحف: تمرين إسناد القصة",
    "من أنت بعيداً عن الرواية الموروثة؟",
  ],
  "the-rewrite-deep": [
    "التوجيه: ما ستمارسه",
    "هندسة المصداقية: لماذا بعض الجمل تنجح وبعضها لا",
    "آلة إعادة الكتابة خطوة بخطوة",
    "الكلمة الصغيرة: أداة تحويل الهوية",
    "الهوية المستقبلية كمرساة للممارسة الحالية",
    "اختبار الضغط: بروفة الجملة في المواقف الحقيقية",
    "الصيانة: تصميم الانتكاسة مسبقاً",
  ],
};

export async function generateStaticParams() {
  const courses = await listPublishedCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return buildMetadata({ title: "غير موجود", noIndex: true });
  return buildMetadata({ title: course.title, description: course.promise, path: `/courses/${slug}` });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const titlesForSlug = LESSON_TITLES[slug] ?? [];

  const lessons = Array.from({ length: course.lessons }, (_, i) => ({
    number: i + 1,
    title: titlesForSlug[i] ?? (i === 0 ? "التوجيه: ما ستمارسه" : `الدرس ${i + 1}`),
    locked: !(course.preview && i === 0),
  }));

  return (
    <div className="container grid gap-12 py-s9 lg:grid-cols-[2fr_1fr]">
      <div>
        <Badge>{course.path}</Badge>
        <h1 className="mt-4 text-display-l font-medium">{course.title}</h1>
        <p className="mt-3 max-w-xl text-body-l text-muted-foreground">{course.promise}</p>

        <h2 className="eyebrow mb-4 mt-12">المنهج</h2>
        <ol className="divide-y divide-border rounded-r3 border border-border">
          {lessons.map((l) => (
            <li key={l.number} className="flex min-h-12 items-center gap-4 p-4">
              <span className="font-mono text-label-mono text-muted-foreground">
                {String(l.number).padStart(2, "0")}
              </span>
              <span className="flex-1 text-body-m">{l.title}</span>
              {l.locked ? (
                <Badge>أعضاء</Badge>
              ) : (
                <Badge variant="solar">معاينة — مجانية</Badge>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-body-s text-muted-foreground">
          كل درس يسير وفق: تعلّم ← شاهده في نفسك ← افعل ← سجّل، وينتهي بمهمة التمرين.
        </p>
      </div>

      <aside>
        <div className="sticky top-24 rounded-r4 border border-border bg-card p-6">
          <p className="font-mono text-label-mono uppercase text-muted-foreground">
            {course.lessons} دروس · {course.hours}
          </p>
          <p className="mt-4 text-body-m">مضمّن مع مستوى الأكاديمية.</p>
          <Button asChild className="mt-5 w-full">
            <Link href="/pricing">عرض العضوية</Link>
          </Button>
          {course.preview && (
            <Button asChild variant="ghost" size="compact" className="mt-3 w-full">
              <Link href="/signin">شاهد المعاينة المجانية</Link>
            </Button>
          )}
        </div>
      </aside>

      <JsonLd data={courseJsonLd({ title: course.title, summary: course.promise, slug: course.slug })} />
    </div>
  );
}
