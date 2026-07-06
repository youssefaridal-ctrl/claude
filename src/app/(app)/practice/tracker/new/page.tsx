import { buildMetadata } from "@/lib/seo";
import { NewHabitForm } from "@/components/tracker/new-habit-form";

export const metadata = buildMetadata({ title: "New Habit", noIndex: true });

export default function NewHabitPage() {
  return (
    <div className="container max-w-2xl py-12">
      <p className="eyebrow mb-2">Instruments · Tracker</p>
      <h1 className="text-display-m font-medium">New habit</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        Start with who, not what. The identity statement is the foundation; the
        habit is just how that person spends four days a week.
      </p>
      <NewHabitForm />
    </div>
  );
}
