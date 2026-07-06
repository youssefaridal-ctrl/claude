import { TrackerDemo } from "@/components/preview/tracker-demo";

export default function PreviewTrackerPage() {
  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">Instruments</p>
      <h1 className="text-display-m font-medium">Tracker</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        Weeks, not chains. Four kept days is a kept week — and a missed day is data, never a verdict.
      </p>
      <div className="mt-10">
        <TrackerDemo />
      </div>
    </div>
  );
}
