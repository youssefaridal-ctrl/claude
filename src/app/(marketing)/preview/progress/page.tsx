import { ProgressDemo } from "@/components/preview/progress-demo";
import { Badge } from "@/components/ui/badge";

export default function PreviewProgressPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">التقدم</p>
      <h1 className="text-display-m font-medium">دليل، لا نقاط.</h1>
      <p className="mt-2 max-w-xl text-body-m text-muted-foreground">
        السجل يحفظ ما فعلته؛ ودلتا يُظهر ما تحرّك. لن تجد XP ولا مستويات بالدفع
        ولا لوحات تصنيف في أي مكان بهذا المنتج — المقارنة هي المرض الذي نُعالجه.
      </p>
      <div className="mt-4 flex gap-2">
        <Badge variant="filled">الفصل ٢ · التمرين ١٢ من ٣٠</Badge>
        <Badge>٤٧ إدخالاً في السجل</Badge>
      </div>
      <div className="mt-10">
        <ProgressDemo />
      </div>
    </div>
  );
}
