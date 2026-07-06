import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
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

  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <p className="eyebrow mb-3">Sign in</p>
      <h1 className="text-display-m font-medium">No password. On purpose.</h1>
      <p className="mt-3 text-body-m text-muted-foreground">
        Enter your email and we&rsquo;ll send a one-time link. It works once and expires in ten minutes.
      </p>

      <form action={sendLink} className="mt-8">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
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
