import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Free tools & downloads",
  description: "Printable worksheets, the thought-record PDF, and the free instruments. No forced email gates.",
  path: "/tools",
});

const TOOLS = [
  { name: "The Inner Dialogue Audit", format: "Interactive · 4 min", href: "/lab/audit", note: "Your narrator, named. Free forever." },
  { name: "The Dialogue Audit Sheet", format: "Printable PDF", href: "#", note: "7-day verbatim transcript grid — the paper version of movement one." },
  { name: "The Courtroom Record", format: "Printable PDF", href: "#", note: "Charge, evidence, fair judge, commuted sentence. One thought per page." },
  { name: "The Working Sentences Card", format: "Wallet / lockscreen", href: "#", note: "Your three believability-7 sentences, where you'll see them before the door." },
  { name: "The Fear Ladder Builder", format: "Printable PDF", href: "#", note: "One avoidance, eight climbable rungs, prediction-vs-actual columns." },
  { name: "Manifesto poster", format: "PDF, A3", href: "#", note: "“You are the author now.” For the wall that faces your desk." },
] as const;

export default function ToolsPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">Tools</p>
      <h1 className="text-display-l font-medium">Free, and actually free.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        Direct downloads — no email gates. There's a field at the bottom if you <em>want</em> the full kit
        by email; that's an offer, not a toll.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <InteractiveCard key={t.name}>
            <Link href={t.href} className="block h-full focus-visible:outline-none">
              <CardContent className="flex h-full flex-col p-6">
                <Badge className="w-fit">{t.format}</Badge>
                <h2 className="mt-4 text-body-l font-medium">{t.name}</h2>
                <p className="mt-2 flex-1 text-body-s text-muted-foreground">{t.note}</p>
              </CardContent>
            </Link>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
