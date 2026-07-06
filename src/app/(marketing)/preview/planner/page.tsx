import { PlannerDemo } from "@/components/preview/planner-demo";

export default function PreviewPlannerPage() {
  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">Instruments</p>
      <h1 className="text-display-m font-medium">Seasons</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        Not a project manager — a becoming planner. Identity sets the direction, the season sets the
        theme, the moves are calendar-sized.
      </p>
      <div className="mt-10">
        <PlannerDemo />
      </div>
    </div>
  );
}
