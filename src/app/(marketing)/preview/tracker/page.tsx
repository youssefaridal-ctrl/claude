import { TrackerDemo } from "@/components/preview/tracker-demo";

export default function PreviewTrackerPage() {
  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">الأدوات</p>
      <h1 className="text-display-m font-medium">المتتبع</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        أسابيع لا سلاسل. أربعة أيام محقَّقة تعني أسبوعاً محقَّقاً — واليوم الفائت بيانات، لا حكم أبداً.
      </p>
      <div className="mt-10">
        <TrackerDemo />
      </div>
    </div>
  );
}
