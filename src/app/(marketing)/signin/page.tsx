import { buildMetadata } from "@/lib/seo";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = buildMetadata({
  title: "تسجيل الدخول",
  description: "بلا كلمة مرور — نُرسل لك رابطاً مؤقتاً.",
  path: "/signin",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <p className="eyebrow mb-3">تسجيل الدخول</p>
      <h1 className="text-display-m font-medium">بلا كلمة مرور. متعمّداً.</h1>
      <p className="mt-3 text-body-m text-muted-foreground">
        أدخل بريدك الإلكتروني وسنُرسل لك رابطاً مؤقتاً. يعمل مرة واحدة وينتهي في عشر دقائق.
      </p>
      <SignInForm />
      <p className="mt-6 text-body-s text-muted-foreground">
        جديد هنا؟ نفس الرابط يُنشئ حسابك — لا شيء آخر لملئه.
      </p>
    </div>
  );
}
