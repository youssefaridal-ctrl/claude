import { buildMetadata } from "@/lib/seo";
import { RepFlow } from "@/components/practice/rep-flow";

export const metadata = buildMetadata({ title: "تمرين اليوم", noIndex: true });

export default function RepPage() {
  return (
    <div className="container py-16">
      <RepFlow />
    </div>
  );
}
