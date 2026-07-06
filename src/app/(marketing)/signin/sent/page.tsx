import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Check your email", noIndex: true });

export default function SentPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-16 text-center">
      <h1 className="font-serif text-serif-feature">The door is open.</h1>
      <p className="mt-4 text-body-m text-muted-foreground">
        We&rsquo;ve sent a sign-in link to your email. It works once and expires in ten minutes — no rush,
        we&rsquo;ll send another if it lapses.
      </p>
    </div>
  );
}
