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
  {
    name: "The Inner Dialogue Audit",
    format: "Interactive · 4 min",
    href: "/lab/audit",
    note: "Your narrator, named. Free forever.",
    live: true,
  },
  {
    name: "Life Wheel",
    format: "Interactive · 2 min",
    href: "/tools/life-wheel",
    note: "Rate eight life dimensions. The shape shows where the energy is leaking.",
    live: true,
  },
  {
    name: "Values Assessment",
    format: "Interactive · 3 min",
    href: "/tools/values",
    note: "Two-round card sort to surface your five core values.",
    live: true,
  },
  {
    name: "The Dialogue Audit Sheet",
    format: "Printable PDF",
    href: "#",
    note: "7-day verbatim transcript grid — the paper version of movement one.",
    live: false,
  },
  {
    name: "The Courtroom Record",
    format: "Printable PDF",
    href: "#",
    note: "Charge, evidence, fair judge, commuted sentence. One thought per page.",
    live: false,
  },
  {
    name: "The Fear Ladder Builder",
    format: "Printable PDF",
    href: "#",
    note: "One avoidance, eight climbable rungs, prediction-vs-actual columns.",
    live: false,
  },
] as const;

export default function ToolsPage() {
  return (
    <div className="container py-s9">
      <p className="eyebrow mb-3">Tools</p>
      <h1 className="text-display-l font-medium">Free, and actually free.</h1>
      <p className="mt-3 max-w-xl text-body-l text-muted-foreground">
        No email gates. Interactive tools run here; printables are direct downloads. The field
        at the bottom is an offer, not a toll.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <InteractiveCard key={t.name} className={!t.live ? "opacity-60" : ""}>
            <Link
              href={t.live ? t.href : "#"}
              className="block h-full focus-visible:outline-none"
              aria-disabled={!t.live}
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2">
                  <Badge className="w-fit">{t.format}</Badge>
                  {!t.live && <Badge variant="filled">Coming soon</Badge>}
                </div>
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
