import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Sign-in error", noIndex: true });

const MESSAGES: Record<string, string> = {
  OAuthSignin: "We couldn't start the sign-in. Please try again.",
  OAuthCallback: "Something went wrong during the sign-in. Please try again.",
  OAuthCreateAccount: "We couldn't create your account. Please try again.",
  EmailCreateAccount: "We couldn't create your account. Please try again.",
  Callback: "The sign-in callback failed. Please try again.",
  OAuthAccountNotLinked: "That email is already signed in another way. Use the original method.",
  EmailSignin: "The sign-in email couldn't be sent. Please check your address and try again.",
  CredentialsSignin: "Sign-in failed. Please check your credentials.",
  SessionRequired: "Please sign in to access that page.",
  Default: "An unexpected error occurred. Please try again.",
};

export default async function SignInErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = (error && MESSAGES[error]) ?? MESSAGES.Default;

  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16 text-center">
      <p className="font-mono text-label-mono uppercase text-muted-foreground">Sign-in error</p>
      <h1 className="mt-4 text-display-m font-medium">Something didn't work.</h1>
      <p className="mt-4 text-body-m text-muted-foreground">{message}</p>
      <Button asChild className="mt-8">
        <Link href="/signin">Try again</Link>
      </Button>
    </div>
  );
}
