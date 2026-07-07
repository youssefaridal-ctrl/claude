import { buildMetadata } from "@/lib/seo";
import { NewHabitForm } from "@/components/tracker/new-habit-form";

export const metadata = buildMetadata({ title: "عادة جديدة", noIndex: true });

export default function NewHabitPage() {
  return (
    <div className="container max-w-2xl py-12">
      <p className="eyebrow mb-2">الأدوات · المتتبع</p>
      <h1 className="text-display-m font-medium">عادة جديدة</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        ابدأ بالهوية لا بالفعل. بيان الهوية هو الأساس؛ العادة هي فقط كيف يقضي ذلك الشخص أربعة أيام في الأسبوع.
      </p>
      <NewHabitForm />
    </div>
  );
}
