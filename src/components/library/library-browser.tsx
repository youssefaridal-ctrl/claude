"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { articles } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TYPES = ["All", "Essays", "Exercises"] as const;

/** Library with filter chips (design/03 §8, T2 template). */
export function LibraryBrowser() {
  const [type, setType] = useState<(typeof TYPES)[number]>("All");

  const shown = useMemo(
    () =>
      articles.filter((a) =>
        type === "All" ? true : type === "Essays" ? a.type === "ESSAY" : a.type === "EXERCISE",
      ),
    [type],
  );

  return (
    <div>
      <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={type === t}
            onClick={() => setType(t)}
            className={cn(
              "min-h-11 rounded-full border px-5 text-body-s transition-colors duration-fast",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              type === t ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
            )}
          >
            {t}
          </button>
        ))}
        <p className="ml-auto self-center font-mono text-label-mono text-muted-foreground" aria-live="polite">
          Showing {shown.length} of {articles.length}
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <InteractiveCard key={a.slug}>
            <Link href={`/blog/${a.slug}`} className="block h-full focus-visible:outline-none">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-2">
                  <Badge>{a.type === "ESSAY" ? "Essay" : "Exercise"}</Badge>
                  <Badge variant="filled">{a.category}</Badge>
                </div>
                <h2 className="mt-4 text-body-l font-medium leading-snug">{a.title}</h2>
                <p className="mt-2 flex-1 text-body-s text-muted-foreground">{a.dek}</p>
                <p className="mt-4 font-mono text-label-mono uppercase text-muted-foreground">
                  {a.author} · {a.minutes} min
                </p>
              </CardContent>
            </Link>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
