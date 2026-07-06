import { LifeWheel } from "@/components/tools/life-wheel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Life Wheel — satisfaction map",
  description: "Rate eight dimensions of your life and see where the gaps are. Free, no account needed.",
  path: "/tools/life-wheel",
});

export default function LifeWheelPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">Free Tool</p>
      <h1 className="text-display-m font-medium">The Life Wheel.</h1>
      <p className="mt-3 text-body-l text-muted-foreground">
        Rate your current satisfaction in eight areas. The shape tells you where energy is leaking —
        and where confidence work has the most leverage.
      </p>
      <div className="mt-10">
        <LifeWheel />
      </div>
      <div className="mt-12 rounded-r3 bg-card p-6">
        <p className="eyebrow mb-2">What to do next</p>
        <p className="text-body-m text-muted-foreground">
          The lowest-scoring area is rarely where the confidence problem lives — it's usually where
          a confidence problem is showing up. Take the{" "}
          <a href="/lab/audit" className="underline underline-offset-4">Inner Dialogue Audit</a>{" "}
          to find what's driving the shape.
        </p>
      </div>
    </div>
  );
}
