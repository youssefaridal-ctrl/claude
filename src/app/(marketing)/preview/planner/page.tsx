import { PlannerDemo } from "@/components/preview/planner-demo";

export default function PreviewPlannerPage() {
  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">الأدوات</p>
      <h1 className="text-display-m font-medium">المواسم</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        لا مدير مشروعات — بل مخطط تحوّل. الهوية تضع الاتجاه، والموسم يضع الموضوع،
        والخطوات بحجم التقويم.
      </p>
      <div className="mt-10">
        <PlannerDemo />
      </div>
    </div>
  );
}
