import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "بيان إمكانية الوصول — WCAG 2.2 AAA، مع الأدلة",
  description: "هدفنا، وحالتنا الراهنة، ومشاكلنا المعروفة — منشورة، مع قناة تعليقات ذات أولوية.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <div className="container max-w-[680px] py-s9">
      <p className="eyebrow mb-3">إمكانية الوصول</p>
      <h1 className="text-display-l font-medium">التحوّل لكل جسد وعقل.</h1>

      <div className="mt-10 space-y-10 text-body-m leading-relaxed">
        <section>
          <h2 className="text-heading-s font-medium">هدفنا</h2>
          <p className="mt-3 text-muted-foreground">
            WCAG 2.2 المستوى AAA هو هدفنا العملي — تباين نصي 7:1، وتشغيل كامل بلوحة المفاتيح، وتركيز
            مرئي في كل مكان، وأهداف لمس 44 بكسل، وبلا مهل زمنية على التمارين، ونصوص وترجمات على كل شيء،
            والحركة المخفّفة كتجربة من الدرجة الأولى، لا كخيار احتياطي.
          </p>
        </section>
        <section>
          <h2 className="text-heading-s font-medium">الحالة الراهنة</h2>
          <p className="mt-3 text-muted-foreground">
            مرحلة النموذج الأولي: الفحوصات الآلية تعمل في CI؛ لوحة الرموز موثّقة بـ AAA في كلا السمتين؛
            رحلات لوحة المفاتيح والحركة المخفّفة تغطيها مجموعة الاختبارات. أول تدقيق خارجي كامل
            مجدول قبل الإطلاق العام، ونتائجه — بما في ذلك كل ما فشلنا فيه — ستُنشر هنا.
          </p>
        </section>
        <section>
          <h2 className="text-heading-s font-medium">المشاكل المعروفة</h2>
          <ul className="mt-3 list-disc space-y-2 pr-5 text-muted-foreground">
            <li>مشغّلات بودكاست النموذج الأولي عبارة عن عناصر مرئية مؤقتة — المشغّلات الكاملة القابلة للوصول تأتي مع استيراد الصوت.</li>
            <li>رادار نتائج التشخيص لم يُعرض بعد؛ تُعلَن الدرجات نصياً.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-heading-s font-medium">أخبرنا بما هو معطّل — قناة الأولوية</h2>
          <p className="mt-3 text-muted-foreground">
            access@selv.com يصل إلى إنسان لديه صلاحية تحديد أولويات الإصلاحات. تقارير إمكانية الوصول
            تتخطى طابور الانتظار. هذه سياسة، مكتوبة، على الصفحة.
          </p>
        </section>
      </div>
    </div>
  );
}
