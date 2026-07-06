import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "No password — we send you a one-time door in.",
  path: "/signin",
  noIndex: true,
});

export default function SignInPage() {
  async function sendLink(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("email", { email, redirect: false });
    redirect("/signin/sent");
  }

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/today" });
  }

  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <p className="eyebrow mb-3">Sign in</p>
      <h1 className="text-display-m font-medium">No password. On purpose.</h1>
      <p className="mt-3 text-body-m text-muted-foreground">
        Enter your email and we&rsquo;ll send a one-time link. It works once and expires in ten minutes.
      </p>

      <form action={signInWithGoogle} className="mt-8">
        <Button type="submit" variant="secondary" className="w-full">
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="font-mono text-label-mono text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form action={sendLink}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
        <Button type="submit" className="mt-4 w-full">
          Send my sign-in link
        </Button>
      </form>

      <p className="mt-6 text-body-s text-muted-foreground">
        New here? The same link creates your account — nothing else to fill in.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
