import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "تحقق من بريدك الإلكتروني", noIndex: true });

export default function SentPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16 text-center">
      <h1 className="font-serif text-serif-feature">الباب مفتوح.</h1>
      <p className="mt-4 text-body-m text-muted-foreground">
        أرسلنا رابط تسجيل الدخول إلى بريدك الإلكتروني. يعمل مرة واحدة وينتهي في عشر دقائق —
        لا استعجال، سنُرسل آخر إذا انتهت صلاحيته.
      </p>
    </div>
  );
}
