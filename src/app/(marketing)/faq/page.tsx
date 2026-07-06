import Link from "next/link";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { faqs } from "@/lib/mock";

export const metadata = buildMetadata({
  title: "الأسئلة الشائعة — إجابات صادقة، بما فيها المحرجة",
  description: "هل هذا علاج؟ هل تعمل التأكيدات؟ هل يمكنكم قراءة مذكراتي؟ إجابات واضحة.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">الأسئلة الشائعة</p>
      <h1 className="text-display-l font-medium">إجابات صادقة.</h1>
      <p className="mt-3 text-body-l text-muted-foreground">بما فيها المحرجة.</p>

      <div className="mt-10">
        <FaqBrowser />
      </div>

      <div className="mt-16 rounded-r3 border border-border bg-card p-6 text-center">
        <p className="text-body-m">
          ما زلت غير متأكد؟{" "}
          <Link href="/contact" className="underline underline-offset-4">اكتب لإنسان ←</Link>{" "}
          <span className="text-muted-foreground">نُجيب خلال يومي عمل، شخصياً.</span>
        </p>
      </div>

      <JsonLd data={faqJsonLd(faqs.flatMap((c) => c.items.map((i) => ({ question: i.q, answer: i.a }))))} />
    </div>
  );
}
