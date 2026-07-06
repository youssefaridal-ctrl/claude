import { AuditFlow } from "@/components/audit/audit-flow";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "تشخيص الحوار الداخلي — مجاني، 4 دقائق، بلا تسجيل",
  description:
    "اثنا عشر سؤالاً صادقاً. تعرّف على الراوي الذي يُشغّل حوارك الداخلي — واحصل على ملفك الشخصي للحوار فوراً، قبل أن نطلب منك بريدك الإلكتروني.",
  path: "/lab/audit",
});

export default function AuditPage() {
  return (
    <div className="container">
      <p className="sr-only">
        هذه أداة للتأمل الذاتي، وليست تشخيصاً. الإجابات الصادقة أفضل من المثيرة للإعجاب.
      </p>
      <AuditFlow />
    </div>
  );
}
