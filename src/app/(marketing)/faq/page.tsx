import Link from "next/link";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { faqs } from "@/lib/mock";

export const metadata = buildMetadata({
  title: "FAQ — honest answers, including the awkward ones",
  description: "Is this therapy? Do affirmations work? Can you read my journal? Plain answers.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">FAQ</p>
      <h1 className="text-display-l font-medium">Honest answers.</h1>
      <p className="mt-3 text-body-l text-muted-foreground">Including the awkward ones.</p>

      <div className="mt-10">
        <FaqBrowser />
      </div>

      <div className="mt-16 rounded-r3 border border-border bg-card p-6 text-center">
        <p className="text-body-m">
          Still unsure?{" "}
          <Link href="/contact" className="underline underline-offset-4">Write to a human →</Link>{" "}
          <span className="text-muted-foreground">We answer within two business days, personally.</span>
        </p>
      </div>

      <JsonLd data={faqJsonLd(faqs.flatMap((c) => c.items.map((i) => ({ question: i.q, answer: i.a }))))} />
    </div>
  );
}
