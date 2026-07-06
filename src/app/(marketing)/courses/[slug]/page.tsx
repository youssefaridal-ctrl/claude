import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, courseJsonLd } from "@/lib/seo";
import { getCourseBySlug, listPublishedCourses } from "@/server/services/content";

const LESSON_TITLES: Record<string, string[]> = {
  "confidence-fundamentals": [
    "التوجيه: ما ستمارسه",
    "من أين تأتي الثقة فعلاً",
    "الدليل مقابل الشعور: كيف يُقيّم دماغك",
    "تحيز التأكيد وكيفية معادلته",
    "بناء سجل الأدلة",
    "الراوي: تحديده وتسميته",
    "بروتوكول المراجعة اليومية",
    "حين تنهار الثقة: استعادة البناء",
  ],
  "emotional-mastery": [
    "التوجيه: ما ستمارسه",
    "فسيولوجيا المشاعر — ما الذي يحدث فعلاً",
    "الفجوة بين المحفز والاستجابة",
    "إعادة التقييم الإدراكي",
    "تنظيم التنشيط: الأدوات الجسدية",
    "قبول المشاعر بدون اندماج",
    "خريطة أنماطك العاطفية",
    "بناء المرونة العاطفية على المدى البعيد",
  ],
  "identity-and-narrative": [
    "التوجيه: ما ستمارسه",
    "كيف تتشكّل هوية الذات وتتصلّب",
    "أثر الكتابة في علم الأعصاب",
    "علم آثار المعتقدات: تتبع مصدر قصتك",
    "إعادة كتابة السرد",
    "الكلمة الصغيرة: أداة تحويل الهوية",
    "الهوية المستقبلية كمرساة للممارسة",
    "صياغة قصتك القادمة",
  ],
  "self-talk-rewire": [
    "التوجيه: ما ستمارسه",
    "تشريح الحوار الداخلي",
    "الناقد كحارس أمني: فهم الوظيفة",
    "تقنيات المسافة: الاسم، والضمير، والمكان",
    "آلة إعادة الكتابة خطوة بخطوة",
    "التحقق من الموثوقية: لماذا بعض الجمل تنجح وبعضها لا",
    "تسلسل الممارسة اليومية",
    "الصيانة: إبقاء التغيير في مكانه",
  ],
  "boundary-architecture": [
    "التوجيه: ما ستمارسه",
    "الحدود كبنية تحتية، لا كعقاب",
    "تحديد ما تحميه فعلاً",
    "الحد الصغير: كيفية الممارسة بأمان",
    "الصياغة: الكلمات التي تعمل في لهجتك",
    "استجابة الطرف الآخر: تأهيل نفسك لها",
    "الحدود في الأماكن عالية المخاطر",
    "حين لا تُمسك الحدود: ما تعلمته",
  ],
  "perfectionism-protocol": [
    "التوجيه: ما ستمارسه",
    "الكمالية كآلية حماية",
    "تحديد ما الذي يُطلقها",
    "فخ المعايير العالية: التمييز بين الجودة والكمالية",
    "تمرين المسودة المعيبة",
    "الإنجاز مقابل التحسين: قرار التوقف",
    "الفشل كبيانات: بروتوكول المراجعة",
    "بناء كافٍ على قدر الكفاية",
  ],
  "impostor-pattern": [
    "التوجيه: ما ستمارسه",
    "متلازمة المحتال: ما تقوله الأبحاث",
    "الشبح في المرآة: التعرف على نمطك",
    "أدلة مقابل أداء: إعادة معايرة النجاح",
    "محاسبة الكفاءة: الأداة الأساسية",
    "العلاقة بالنجاح الأول: من يملكه؟",
    "مشاركة العمل بدون اعتذار مسبق",
    "البقاء في الغرفة: بناء الانتماء",
  ],
  "social-confidence": [
    "التوجيه: ما ستمارسه",
    "لماذا يحفّز التفاعل الاجتماعي الحذر والتهديد",
    "أدوات اللحظة الاجتماعية: الأساسيات",
    "التعرف على الصمت القلق",
    "بروتوكول الحضور اللفظي",
    "المشاركة الانفعالية بدون ادعاء الاهتمام",
    "المواقف عالية الكثافة: الإعداد والمراجعة",
    "بناء عادة الثقة الاجتماعية",
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
