import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { AddEntryForm } from "@/components/ledger/add-entry-form";
import { CounterEvidence } from "@/components/ledger/counter-evidence";

export const metadata = buildMetadata({ title: "Identity Ledger", noIndex: true });

const SOURCE_LABELS: Record<string, string> = {
  REP: "Rep",
  HABIT: "Habit",
  CHALLENGE: "Challenge",
  JOURNAL: "Journal",
  MANUAL: "Evidence",
};

export default async function LedgerPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [entries, total, chapters] = await Promise.all([
    prisma.ledgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.ledgerEntry.count({ where: { userId } }),
    prisma.chapter.findMany({
      where: { userId },
      orderBy: { number: "desc" },
      take: 5,
    }),
  ]);

  const repCount = await prisma.ledgerEntry.count({ where: { userId, source: "REP" } });
  const repsToNextChapter = 30 - (repCount % 30);
  const currentChapter = Math.floor(repCount / 30) + 1;

  return (
    <div className="container max-w-3xl py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Instruments</p>
          <h1 className="text-display-m font-medium">Identity Ledger</h1>
          <p className="mt-2 text-body-m text-muted-foreground">
            Evidence, not points. Every rep, habit, and moment of courage goes
            here — in your own words.
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-label-mono uppercase text-muted-foreground">
            {total} {total === 1 ? "entry" : "entries"}
          </p>
          {repCount > 0 && (
            <p className="mt-1 text-body-s text-muted-foreground">
              Chapter {currentChapter} · {repsToNextChapter} rep{repsToNextChapter !== 1 ? "s" : ""} to close
            </p>
          )}
        </div>
      </div>

      {/* Chapter progress bar */}
      {repCount > 0 && (
        <div className="mt-6" aria-label={`${30 - repsToNextChapter} of 30 reps toward Chapter ${currentChapter}`}>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-solar-500 transition-all duration-slow"
              style={{ width: `${((30 - repsToNextChapter) / 30) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Closed chapters */}
      {chapters.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow mb-4">Closed chapters</p>
          <div className="space-y-3">
            {chapters.map((ch) => {
              const recap = ch.recap as { title: string; highlights?: string[] };
              return (
                <div key={ch.id} className="rounded-r3 border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-label-mono uppercase">
                      {recap.title ?? `Chapter ${ch.number}`}
                    </p>
                    <p className="text-body-s text-muted-foreground">
                      {new Date(ch.closedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {recap.highlights && recap.highlights.length > 0 && (
                    <p className="mt-2 font-serif text-body-s italic text-muted-foreground">
                      &ldquo;{recap.highlights[0]}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add entry */}
      <div className="mt-10">
        <AddEntryForm />
      </div>

      {/* Counter-evidence search */}
      <div className="mt-10">
        <CounterEvidence />
      </div>

      {/* Entry list */}
      <div className="mt-10">
        <p className="eyebrow mb-6">
          Recent entries {total > 50 && <span className="text-muted-foreground">(showing 50 of {total})</span>}
        </p>

        {entries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-serif-feature text-muted-foreground">
              Your Ledger is empty — for now.
            </p>
            <p className="mt-3 text-body-m text-muted-foreground">
              Every rep closes a small gap. The first entry is the hardest.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/practice/rep" className="text-accent underline-offset-4 hover:underline">
                Do your first rep →
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li key={entry.id} className="border-b border-border py-5">
                <p className="font-serif text-body-l">&ldquo;{entry.text}&rdquo;</p>
                {entry.becauseClause && (
                  <p className="mt-2 text-body-s italic text-muted-foreground">
                    Because {entry.becauseClause}
                  </p>
                )}
                <p className="mt-3 font-mono text-label-mono uppercase text-muted-foreground">
                  {SOURCE_LABELS[entry.source] ?? entry.source} ·{" "}
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
