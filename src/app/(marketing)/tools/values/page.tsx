import { ValuesAssessment } from "@/components/tools/values-assessment";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Values Assessment — find your five",
  description: "A two-round card sort that surfaces your five core values. Free, no account needed.",
  path: "/tools/values",
});

export default function ValuesPage() {
  return (
    <div className="container max-w-2xl py-s9">
      <p className="eyebrow mb-3">Free Tool</p>
      <h1 className="text-display-m font-medium">Values Assessment.</h1>
      <p className="mt-3 text-body-l text-muted-foreground">
        A two-round card sort. You'll start with ten resonant values, then narrow to five.
        The result is a compass — the directions where confidence violations hurt most.
      </p>
      <div className="mt-10">
        <ValuesAssessment />
      </div>
    </div>
  );
}
