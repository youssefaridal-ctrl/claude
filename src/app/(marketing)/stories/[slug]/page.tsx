import Link from "next/link";
import { notFound } from "next/navigation";
import { stories } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

const CHAPTERS: Record<string, { heading: string; body: string }[]> = {
  maya: [
    { heading: "قبل", body: "كان هناك اجتماع كل يوم خميس، ونسخة مني أمضي ليلة الأربعاء أستعد فيها لأكون كافية فيه. كانت تقييمات أدائي تقول 'الحضور التنفيذي أكثر'. صوتي الداخلي ترجم: هم يلاحظون." },
    { heading: "التحوّل", body: "أجريت التشخيص يوم الثلاثاء الساعة الواحدة صباحاً، متوقعة طالعاً فلكياً. ما حصلت عليه كان اسماً — الكمالية — وجملة واحدة أخذت لها لقطة شاشة: 'ليس لديك مشكلة في الكلام. لديك مشكلة في المحاكمة المسبقة.'" },
    { heading: "الممارسة — والانتكاسة", body: "أسبوعان من المسودات الحرفية. جملتي العملة الأولى فشلت عند الموثوقية 4. التي نجحت كانت أصغر. في الأسبوع السادس، قاطعني مدير في منتصف جملتي وتوقفت عن الممارسة تسعة أيام. إعادة البدء اتضح أنها المهارة الحقيقية. لا أحد يخبرك بذلك." },
    { heading: "الآن", body: "ثمانية أشهر: أُعيد التدريب مرة واحدة، احتراماً للغرفة لا خوفاً منها. ما زلت ألتقي بالكمالية معظم أيام الخميس. أدعها تتحقق من بطاقتي، ثم أدخل." },
  ],
  david: [
    { heading: "قبل", body: "أوراق الطلاق سردت الأصول، وأذكر أنني فكرت: لا سطر لذلك الجزء مني الذي غادر للتو. كان راويي نبياً، وكان هادئاً: الجزء الجيد انتهى الآن. يُقدَّم كتقرير طقس." },
    { heading: "التحوّل", body: "أرسلت لي أختي المقالة عن محكمة الساعتين صباحاً برسالة 'هذا أنت'. مارست بروتوكول المساء لأسبوع — مجرد دفتر ملاحظات. الجلسات الليلية صارت أقصر. أدير العمليات؛ أحترم الأشياء التي تعمل." },
    { heading: "الممارسة — والانتكاسة", body: "أثبت بحث الاعتقاد في 'الجزء الجيد انتهى' مؤلفه. لم تكن جملتي — كانت جملة أبي عن حياته، مزروعة على طاولة مطبخنا حوالي عام 1989. في أول أعياد الميلاد وحيداً، توقفت عن كل شيء ثلاثة أسابيع. أعادني دائرتي بأربع كلمات: 'الكرسي ما زال هنا، داود.'" },
    { heading: "الآن", body: "أربعة عشر شهراً. الشهر الماضي سألتني ابنتي ماذا أكتب دائماً في الصباح. قلت لها: 'أدلة.' قالت 'على ماذا؟' فقلت 'على أن الجزء الجيد لم ينته.' النبي لم يُعلّق." },
  ],
  elena: [
    { heading: "قبل", body: "كنت أعتذر عن وجودي في الغرف. 'آسفة على الإزعاج' قبل كل رسالة بريد إلكتروني. 'أعرف أنك مشغول' قبل كل طلب. أدرك الآن أن الكلمة كانت وقائية — اعتذار مسبق قبل أن يرفضني أحد." },
    { heading: "التحوّل", body: "الشيء الذي غيّر المسار لم يكن مقنعاً في البداية. جلست مع تمرين كتابة الحد، وكتبت تسع نسخ، وكلها بدت مُفرطة في التأدب. النسخة العاشرة كانت قصيرة فقط. وعملت." },
    { heading: "الممارسة — والانتكاسة", body: "شهر من الاعتراضات الصغيرة — تصحيح طلب غير صحيح، إعادة إرسال بريد إلكتروني بدون 'آسفة'. ثم ترقية جديدة ومدير جديد ودورة كاملة من الاعتذارات بدأت من جديد. خمسة أسابيع قبل أن أُلاحظ النمط وأُعيد استخدام الجملة." },
    { heading: "الآن", body: "اثنا عشر شهراً. لا أزال أكتب مسودات الرسائل ذات المخاطر العالية مرتين. لكن الطبعة الأولى لم تعد تحمل أعذاراً مسبقة — فقط المحتوى. الفارق في كيفية استقبالها من قِبَل الآخرين أربكني حتى أتعوّد عليه." },
  ],
  james: [
    { heading: "قبل", body: "خمسة عشر عاماً في الأدوار نفسها، لأنني كنت أعتقد أن الأدوار الأخرى كانت لأشخاص آخرين. الناقد في داخلي لم يكن قاسياً — كان منطقياً. 'أنت لست النوع.' مُقدَّم بنبرة محايدة تماماً." },
    { heading: "التحوّل", body: "اكتشفت أن ما كنت أسميه 'واقعية' كان له اسم: الشبح — نمط نظرة البطل المزيفة. قرأت الوصف ثلاث مرات. في المرة الثالثة، كتبت: 'هذا قد يكون خطأً.' لم تكن جملة كبيرة. كانت الأولى." },
    { heading: "الممارسة — والانتكاسة", body: "ثلاثة أشهر من سجل الأدلة — شيء واحد يومياً لم أكن أتوقعه من نفسي. الانتكاسة جاءت مع رفض: تطبيق لدور أعلى، رفض في الجولة الأولى. توقفت عن السجل أسبوعاً وعدت إلى 'أنت لست النوع.' ثم قرأت الإدخالات التسعين التي كتبتها. كانت هناك." },
    { heading: "الآن", body: "ثمانية عشر شهراً. الترقية التي كنت أعتقد أنها لشخص آخر لحقت. أحياناً لا يزال الشبح يُعلّق في الأرجاء، لكنني لا أُخطئه بعد الآن عن الواقعية. الفرق واضح حين تعرف ما تبحث عنه." },
  ],
};

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) return buildMetadata({ title: "غير موجود", noIndex: true });
  return buildMetadata({ title: `${story.name} — قصة في مسودات`, description: story.after, path: `/stories/${slug}` });
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();
  const chapters = CHAPTERS[slug] ?? [];

  return (
    <article className="bg-ink-950 text-bone-50">
      <div className="container max-w-[680px] py-s9">
        <Badge className="border-ink-700 !text-ink-300">{story.situation}</Badge>
        <h1 className="mt-5 font-serif text-display-m leading-tight">
          {story.name}، {story.age}. {story.role}.
        </h1>
        <p className="mt-4 font-serif text-serif-feature italic text-ink-300 line-through decoration-1">
          &ldquo;{story.before}&rdquo;
        </p>

        <div className="mt-12 space-y-10">
          {chapters.map((c) => (
            <section key={c.heading}>
              <h2 className="eyebrow mb-3 !text-solar-500">{c.heading}</h2>
              <p className="font-serif text-body-l leading-[1.75] text-ink-100">{c.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-r3 border border-ink-700 bg-ink-900 p-6 text-center">
          <p className="text-body-m text-ink-100">خطوتهم الأولى كانت التشخيص.</p>
          <Button asChild className="mt-4 bg-bone-50 text-ink-950">
            <Link href="/lab/audit">ابدأ تشخيصك — مجاني، 4 دقائق</Link>
          </Button>
        </div>

        <p className="mt-10 text-body-s text-ink-500">
          قصة مركّبة مستخلصة من أنماط شائعة بين الأعضاء، وتفاصيل مُغيَّرة، مُصنَّفة وفق معيارنا التحريري.
          النتائج تتفاوت — المنهجية متاحة.
        </p>
      </div>
    </article>
  );
}
