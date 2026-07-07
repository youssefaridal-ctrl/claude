import { CommonsDemo } from "@/components/preview/commons-demo";

export default function PreviewCommonsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">المنتدى</p>
      <h1 className="text-display-m font-medium">افعل العمل الهادئ في رفقة جيدة.</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        كل منشور يُعلن ما يطلبه. رد الفعل الوحيد هو &ldquo;أراك.&rdquo;
      </p>
      <div className="mt-10">
        <CommonsDemo />
      </div>
    </div>
  );
}
