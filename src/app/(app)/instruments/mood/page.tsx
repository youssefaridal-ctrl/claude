import { buildMetadata } from "@/lib/seo";
import { MoodCheckin } from "@/components/instruments/mood-checkin";

export const metadata = buildMetadata({ title: "Inner Weather", noIndex: true });

export default function MoodPage() {
  return (
    <div className="container max-w-2xl py-12">
      <p className="eyebrow mb-2">Instruments</p>
      <h1 className="text-display-m font-medium">Inner Weather</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        Not a mood score — a practice of noticing. Patterns take a month to become
        readable, and they&apos;re only useful when they&apos;re yours.
      </p>
      <div className="mt-10">
        <MoodCheckin />
      </div>
    </div>
  );
}
