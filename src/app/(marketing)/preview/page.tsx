import Link from "next/link";
import { InteractiveCard, CardContent } from "@/components/ui/card";

const SCREENS = [
  { href: "/preview/today", name: "Today", blurb: "The daily page: one rep, three tiles, nothing else. Run the rep — it's the product's heartbeat." },
  { href: "/preview/tracker", name: "Habit Tracker", blurb: "Grace-based weeks. Toggle the day dots; notice nothing ever turns red." },
  { href: "/preview/journal", name: "Journal", blurb: "Two-pane writing with the encryption badge and mood capture." },
  { href: "/preview/planner", name: "Goal Planner", blurb: "Identity → Season → Moves. Check moves off; the season arc responds." },
  { href: "/preview/progress", name: "Progress", blurb: "The Identity Ledger, the counter-evidence search, and the quarterly Delta radar." },
  { href: "/preview/commons", name: "The Commons", blurb: "Seeking-labeled posts and the “I see you” reaction — no counts anywhere." },
] as const;

export default function PreviewIndexPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">Member app · clickable prototype</p>
      <h1 className="text-display-l font-medium">Walk the whole product.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        Every member screen, interactive, with sample data — no account, nothing saved. The public site
        and the <Link href="/lab/audit" className="underline underline-offset-4">real Audit</Link> are
        live around it; this is the part that normally sits behind sign-in.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SCREENS.map((s) => (
          <InteractiveCard key={s.href}>
            <Link href={s.href} className="block h-full focus-visible:outline-none">
              <CardContent className="p-6">
                <h2 className="text-body-l font-medium">{s.name}</h2>
                <p className="mt-2 text-body-s text-muted-foreground">{s.blurb}</p>
              </CardContent>
            </Link>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
