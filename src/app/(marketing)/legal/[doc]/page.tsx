import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

/**
 * Legal template with the Plain-Language Layer (design/03 §23): every section
 * opens with a plain-words card; counsel-reviewed full text replaces the
 * placeholders before launch.
 */

const DOCS: Record<string, { title: string; sections: { heading: string; plain: string }[] }> = {
  privacy: {
    title: "سياسة الخصوصية",
    sections: [
      {
        heading: "ما الذي نجمعه",
        plain: "بريدك الإلكتروني، وبيانات ممارستك، وما تختار كتابته. تحليلات الطرف الأول فقط — لا متتبعات إعلانية، أبداً.",
      },
      {
        heading: "مجلتك الخاصة",
        plain: "تُشفَّر قبل تخزينها، والمفاتيح تُحفظ بمعزل عن كلماتك. لو سُرّبت قاعدة بياناتنا، لن تسرّب كلماتك. التشفير الكامل من طرف إلى طرف موجود في خارطة طريقنا العامة.",
      },
      {
        heading: "حقوقك",
        plain: "صدّر كل شيء من الإعدادات. الحذف يعني الحذف — يختفي خلال 30 يوماً، لا مجرد تعطيل.",
      },
      {
        heading: "لن نفعل",
        plain: "لن نبيع بياناتك. لن نشاركها مع معلنين. لن نستخدمها لتدريب نماذج الذكاء الاصطناعي الخارجية. هذا وعد بالنص، لا مجرد سياسة.",
      },
    ],
  },
  terms: {
    title: "شروط الخدمة",
    sections: [
      {
        heading: "الاتفاق",
        plain: "تحصل على الأدوات والمحتوى للمستوى الذي تدفع مقابله. إلغاء بنقرتين. استرداد خلال 30 يوماً بلا أسئلة.",
      },
      {
        heading: "ما ليس سيلف",
        plain: "تعليم وممارسة، لا علاجاً نفسياً ولا رعاية طبية — ونقول ذلك في كل مكان يهم.",
      },
      {
        heading: "محتواك",
        plain: "كلماتك تبقى لك. لا نبيع البيانات أبداً، وقاعدة المنتدى 'ما يُشارَك هنا يبقى هنا' تُلزمنا أيضاً.",
      },
      {
        heading: "التوقعات المتبادلة",
        plain: "نلتزم بتحسين المنتج وصون بياناتك والتواصل معك عند حدوث تغييرات مهمة. نطلب منك استخدام المنصة بنية صادقة واحترام خصوصية أعضاء المنتدى الآخرين.",
      },
    ],
  },
  cookies: {
    title: "سياسة ملفات تعريف الارتباط",
    sections: [
      {
        heading: "ما نضعه",
        plain: "ملف ارتباط للجلسة يُبقيك متصلاً، وتفضيل للمظهر. هذا هو القائمة.",
      },
      {
        heading: "ما لا نضعه",
        plain: "لا ملفات ارتباط إعلانية، ولا متتبعات عبر المواقع، ولا بصمات رقمية. يعمل الموقع بالكامل إذا رفضت كل اختياري.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) return buildMetadata({ title: "غير موجود", noIndex: true });
  return buildMetadata({ title: d.title, path: `/legal/${doc}` });
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();

  return (
    <div className="container max-w-[680px] py-s9">
      <p className="eyebrow mb-3">قانوني</p>
      <h1 className="text-display-l font-medium">{d.title}</h1>
      <p className="mt-3 font-mono text-label-mono text-muted-foreground">آخر تحديث: مسودة نموذج أولي · ن٠</p>

      <div className="mt-12 space-y-10">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-heading-s font-medium">{s.heading}</h2>
            <div className="mt-3 rounded-r3 bg-card p-5">
              <p className="eyebrow mb-2">بكلمات بسيطة</p>
              <p className="text-body-m">{s.plain}</p>
            </div>
            <p className="mt-3 text-body-s text-muted-foreground">
              [النص القانوني الكامل لهذا القسم يصل مع مراجعة المستشار القانوني — البطاقة أعلاه ملزِمة لسلوكنا في غضون ذلك.]
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
