import Link from "next/link";
import { TierCards } from "@/components/pricing/tier-cards";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing — simple, honest, cancel in two clicks",
  description:
    "Free forever tools, Practice at $19/mo, Academy at $39/mo. 30-day refund, no interrogation. We design for graduation, not lock-in.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <div className="text-center">
          <h1 className="text-display-l font-medium">Simple, honest pricing.</h1>
          <p className="mx-auto mt-4 max-w-xl text-body-l text-muted-foreground">
            Cancel anytime in two clicks. Thirty-day refund, no interrogation.
          </p>
        </div>
      </Reveal>

      <div className="mt-12">
        <TierCards />
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-16 max-w-2xl rounded-r4 border border-border bg-card p-8">
          <h2 className="text-heading-s font-medium">The guarantee, in three plain sentences.</h2>
          <p className="mt-3 text-body-m text-muted-foreground">
            Try any paid tier for thirty days. If it isn't moving anything, write one line and the refund
            is yours — no call, no survey gauntlet, no “retention specialist.” We'd rather have your trust
            than your renewal.
          </p>
          <p className="mt-4 font-serif italic text-muted-foreground">— The SELV team</p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-12 text-center text-body-m text-muted-foreground">
          Not ready to pay? The{" "}
          <Link href="/lab/audit" className="underline underline-offset-4">Audit</Link> and Lab basics are
          free forever. That's not a trial — it's the front door.
        </p>
      </Reveal>
    </div>
  );
}
