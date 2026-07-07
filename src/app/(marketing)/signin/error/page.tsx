import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata = buildMetadata({ title: "خطأ في تسجيل الدخول", noIndex: true });

const MESSAGES: Record<string, string> = {
  OAuthSignin: "لم نتمكن من بدء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
  OAuthCallback: "حدث خطأ ما أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
  OAuthCreateAccount: "لم نتمكن من إنشاء حسابك. يرجى المحاولة مرة أخرى.",
  EmailCreateAccount: "لم نتمكن من إنشاء حسابك. يرجى المحاولة مرة أخرى.",
  Callback: "فشل رد الاتصال لتسجيل الدخول. يرجى المحاولة مرة أخرى.",
  OAuthAccountNotLinked: "هذا البريد الإلكتروني مسجّل بطريقة أخرى. استخدم الطريقة الأصلية.",
  EmailSignin: "تعذّر إرسال بريد تسجيل الدخول. يرجى التحقق من عنوانك والمحاولة مرة أخرى.",
  CredentialsSignin: "فشل تسجيل الدخول. يرجى التحقق من بياناتك.",
  SessionRequired: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة.",
  Default: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
};

export default async function SignInErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams.catch(() => ({} as { error?: string }));
  const message = (params.error && MESSAGES[params.error]) ?? MESSAGES.Default;

  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16 text-center">
      <p className="font-mono text-label-mono uppercase text-muted-foreground">خطأ في تسجيل الدخول</p>
      <h1 className="mt-4 text-display-m font-medium">هناك شيء لم يعمل.</h1>
      <p className="mt-4 text-body-m text-muted-foreground">{message}</p>
      <Button asChild className="mt-8">
        <Link href="/signin">حاول مرة أخرى</Link>
      </Button>
    </div>
  );
}
