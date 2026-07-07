import { JournalDemo } from "@/components/preview/journal-demo";

export default function PreviewJournalPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">الأدوات</p>
      <h1 className="text-display-m font-medium">المجلة</h1>
      <p className="mt-2 max-w-xl text-body-m text-muted-foreground">
        كتابة تردّ على الناقد. في التطبيق الحقيقي، تُشفَّر المدخلات قبل التخزين —
        في هذا النموذج الأولي، لا شيء يغادر متصفحك على الإطلاق.
      </p>
      <div className="mt-10">
        <JournalDemo />
      </div>
    </div>
  );
}
