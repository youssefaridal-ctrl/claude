import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact — write to a human",
  description: "We read everything, and a person answers within two business days.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container grid gap-14 py-s9 lg:grid-cols-[3fr_2fr]">
      <div>
        <p className="eyebrow mb-3">Contact</p>
        <h1 className="text-display-l font-medium">Write to a human.</h1>
        <p className="mt-3 max-w-lg text-body-l text-muted-foreground">
          We read everything, and a person — not a bot, not a macro — answers within two business days.
        </p>
        <div className="mt-10 max-w-lg">
          <ContactForm />
        </div>
      </div>

      <aside className="space-y-8 lg:pt-24">
        <div>
          <h2 className="eyebrow mb-2">Support</h2>
          <p className="text-body-m">hello@selv.com</p>
          <p className="text-body-s text-muted-foreground">
            In plain text, because hiding email addresses is a strange way to say “talk to us.”
          </p>
        </div>
        <div>
          <h2 className="eyebrow mb-2">Press & partnerships</h2>
          <p className="text-body-s text-muted-foreground">One paragraph is plenty. Press kit available on request.</p>
        </div>
        <div className="rounded-r3 border border-border bg-card p-6">
          <h2 className="text-body-m font-medium">A gentle note</h2>
          <p className="mt-2 text-body-s text-muted-foreground">
            If you're in crisis right now, please don't wait for an email reply. Our{" "}
            <Link href="/resources" className="underline underline-offset-4">Resources page</Link> lists
            people who can help today, free, in most countries.
          </p>
        </div>
      </aside>
    </div>
  );
}
