import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Member app preview", noIndex: true });

const PREVIEW_NAV = [
  { href: "/preview/today", label: "Today" },
  { href: "/preview/tracker", label: "Tracker" },
  { href: "/preview/journal", label: "Journal" },
  { href: "/preview/planner", label: "Planner" },
  { href: "/preview/progress", label: "Progress" },
  { href: "/preview/commons", label: "Commons" },
] as const;

/**
 * /preview — the clickable member-app prototype. Sample data, in-memory state,
 * no account needed. Every screen mirrors its real counterpart's layout so the
 * prototype graduates into the wired app without redesign.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="container flex min-h-11 flex-wrap items-center gap-x-6 gap-y-2 py-2">
          <Badge variant="solar">Prototype · sample data · nothing is saved</Badge>
          <nav aria-label="Preview screens" className="flex flex-wrap gap-4">
            {PREVIEW_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-s text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
