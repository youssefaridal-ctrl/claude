import { LibraryBrowser } from "@/components/library/library-browser";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "المكتبة — مقالات وأبحاث وتمارين قابلة للتطبيق",
  description: "كل ما كتبناه عن الثقة، والحوار الداخلي، والهوية — قابل للتصفية، صادق، وينتهي دائماً بالممارسة.",
  path: "/library",
});

export default function LibraryPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">المكتبة</p>
      <h1 className="text-display-l font-medium">اقرأ. ثم افعل التمرين.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        مقالات مع تسمية الآلية، وتمارين مع ذكر التكلفة الزمنية. لا طرق مسدودة للمحتوى —
        كل شيء هنا يقود إلى شيء تستطيع فعله اليوم.
      </p>
      <div className="mt-10">
        <LibraryBrowser />
      </div>
    </div>
  );
}
