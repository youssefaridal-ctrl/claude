import { JournalDemo } from "@/components/preview/journal-demo";

export default function PreviewJournalPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Instruments</p>
      <h1 className="text-display-m font-medium">Journal</h1>
      <p className="mt-2 max-w-xl text-body-m text-muted-foreground">
        Writing that talks back to the critic. In the real app, entries are encrypted before storage —
        in this prototype, nothing leaves your browser at all.
      </p>
      <div className="mt-10">
        <JournalDemo />
      </div>
    </div>
  );
}
