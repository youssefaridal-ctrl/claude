import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "تواصل — اكتب لإنسان",
  description: "نقرأ كل شيء، وشخص حقيقي يُجيب خلال يومي عمل.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container grid gap-14 py-s9 lg:grid-cols-[3fr_2fr]">
      <div>
        <p className="eyebrow mb-3">تواصل</p>
        <h1 className="text-display-l font-medium">اكتب لإنسان.</h1>
        <p className="mt-3 max-w-lg text-body-l text-muted-foreground">
          نقرأ كل شيء، وشخص حقيقي — لا روبوت، ولا ماكرو — يُجيب خلال يومي عمل.
        </p>
        <div className="mt-10 max-w-lg">
          <ContactForm />
        </div>
      </div>

      <aside className="space-y-8 lg:pt-24">
        <div>
          <h2 className="eyebrow mb-2">الدعم</h2>
          <p className="text-body-m">hello@selv.com</p>
          <p className="text-body-s text-muted-foreground">
            بنص واضح، لأن إخفاء عناوين البريد الإلكتروني طريقة غريبة لقول "تحدث إلينا."
          </p>
        </div>
        <div>
          <h2 className="eyebrow mb-2">الصحافة والشراكات</h2>
          <p className="text-body-s text-muted-foreground">فقرة واحدة تكفي. مجموعة الصحافة متاحة عند الطلب.</p>
        </div>
        <div className="rounded-r3 border border-border bg-card p-6">
          <h2 className="text-body-m font-medium">ملاحظة لطيفة</h2>
          <p className="mt-2 text-body-s text-muted-foreground">
            إذا كنت في أزمة الآن، من فضلك لا تنتظر رد البريد الإلكتروني.{" "}
            <Link href="/resources" className="underline underline-offset-4">صفحة الموارد</Link> تدرج
            أشخاصاً يمكنهم المساعدة اليوم، مجاناً، في معظم البلدان.
          </p>
        </div>
      </aside>
    </div>
  );
}
