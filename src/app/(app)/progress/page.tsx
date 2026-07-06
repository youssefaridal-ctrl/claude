import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { computeWeekStates } from "@/server/services/habits";

export const metadata = buildMetadata({ title: "Progress", noIndex: true });

const SOURCE_LABELS: Record<string, string> = {
  REP: "Reps",
  HABIT: "Habits",
  CHALLENGE: "Challenges",
  JOURNAL: "Journal",
  MANUAL: "Manual entries",
};

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [
    ledgerTotal,
    ledgerBySrc,
    chapters,
    habits,
    assessments,
  ] = await Promise.all([
    prisma.ledgerEntry.count({ where: { userId } }),
    prisma.ledgerEntry.groupBy({
      by: ["source"],
      where: { userId },
      _count: { source: true },
    }),
    prisma.chapter.findMany({
      where: { userId },
      orderBy: { number: "desc" },
    }),
    prisma.habit.findMany({
      where: { userId, archivedAt: null },
      include: { logs: { where: { date: { gte: twelveWeeksAgo() } }, orderBy: { date: "asc" } } },
    }),
    prisma.assessmentResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, type: true, createdAt: true, dominantNarrator: true },
    }),
  ]);

  const repCount = ledgerBySrc.find((r) => r.source === "REP")?._count.source ?? 0;
  const repsInCurrentChapter = repCount % 30;
  const nextChapterAt = 30;

  // Week states for all habits, last 12 weeks
  const habitWeeks = habits.map((h) => ({
    name: h.name,
    identityStatement: h.identityStatement,
    weeks: computeWeekStates(h.logs, h.targetPerWeek, 12),
  }));

  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">Instruments</p>
      <h1 className="text-display-m font-medium">Progress</h1>

      {/* Ledger summary */}
      <section aria-label="Ledger overview" className="mt-10">
        <p className="eyebrow mb-5">Identity Ledger</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-r3 border border-border bg-card p-5">
            <p className="text-display-m font-medium">{ledgerTotal}</p>
            <p className="mt-1 font-mono text-label-mono uppercase text-muted-foreground">Total entries</p>
          </div>
          {ledgerBySrc.map((row) => (
            <div key={row.source} className="rounded-r3 border border-border bg-card p-5">
              <p className="text-display-m font-medium">{row._count.source}</p>
              <p className="mt-1 font-mono text-label-mono uppercase text-muted-foreground">
                {SOURCE_LABELS[row.source] ?? row.source}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter progress */}
      <section aria-label="Rep chapters" className="mt-10">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">Rep chapters</p>
          {repCount > 0 && (
            <p className="text-body-s text-muted-foreground">
              {repsInCurrentChapter} / {nextChapterAt} reps in Chapter {chapters.length + 1}
            </p>
          )}
        </div>

        {repCount > 0 && (
          <div className="mt-3 mb-6" aria-hidden>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-solar-500 transition-all duration-slow"
                style={{ width: `${(repsInCurrentChapter / nextChapterAt) * 100}%` }}
              />
            </div>
          </div>
        )}

        {chapters.length === 0 ? (
          <div className="rounded-r3 border border-dashed border-border bg-card p-8 text-center">
            <p className="font-serif text-serif-feature text-muted-foreground">
              First Chapter closes at 30 reps.
            </p>
            <p className="mt-2 text-body-s text-muted-foreground">
              {repCount === 0
                ? "Your first rep is one step away."
                : `${30 - repsInCurrentChapter} more rep${30 - repsInCurrentChapter !== 1 ? "s" : ""} to close Chapter 1.`}
            </p>
            <Link href="/practice/rep" className="mt-4 inline-block text-accent underline-offset-4 hover:underline">
              Do a rep →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((ch) => {
              const recap = ch.recap as {
                title: string;
                period?: { from: string; to: string };
                highlights?: string[];
              };
              return (
                <article key={ch.id} className="rounded-r3 border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-label-mono uppercase">
                        {recap.title ?? `Chapter ${ch.number}`}
                      </p>
                      <p className="mt-1 text-body-s text-muted-foreground">
                        {ch.repCount} reps ·{" "}
                        {new Date(ch.closedAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {recap.highlights && recap.highlights.length > 0 && (
                    <blockquote className="mt-4 border-l-2 border-solar-500 pl-4 font-serif text-body-l italic">
                      &ldquo;{recap.highlights[0]}&rdquo;
                    </blockquote>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Habit history — 12-week dots */}
      {habitWeeks.length > 0 && (
        <section aria-label="Habit history" className="mt-10">
          <p className="eyebrow mb-5">Habit history · 12 weeks</p>
          <div className="space-y-6">
            {habitWeeks.map((h) => (
              <div key={h.name}>
                <p className="mb-1 text-body-m font-medium">{h.name}</p>
                <p className="mb-3 text-body-s italic text-muted-foreground">{h.identityStatement}</p>
                <div
                  role="img"
                  aria-label={`${h.name}: ${h.weeks.filter((w) => w.kept).length} of 12 weeks kept`}
                  className="flex flex-wrap gap-1.5"
                >
                  {h.weeks.map((week) => (
                    <div
                      key={week.weekStart}
                      title={`Week of ${week.weekStart}: ${week.keptDays}/${week.target} days`}
                      className={`h-4 w-4 rounded-sm ${
                        week.kept
                          ? "bg-foreground"
                          : week.keptDays > 0
                          ? "bg-muted-foreground/40"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-body-s text-muted-foreground">
                  {h.weeks.filter((w) => w.kept).length} of 12 weeks kept
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assessment history */}
      {assessments.length > 0 && (
        <section aria-label="Assessment history" className="mt-10">
          <p className="eyebrow mb-4">Assessments</p>
          <div className="space-y-3">
            {assessments.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border py-3">
                <div>
                  <p className="text-body-m font-medium">
                    {a.type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  {a.dominantNarrator && (
                    <p className="text-body-s text-muted-foreground">
                      Dominant: {a.dominantNarrator.charAt(0) + a.dominantNarrator.slice(1).toLowerCase()}
                    </p>
                  )}
                </div>
                <p className="font-mono text-label-mono uppercase text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            <Link href="/lab/audit" className="text-accent underline-offset-4 hover:underline">
              Retake the Audit →
            </Link>
          </p>
        </section>
      )}

      {/* Quick links */}
      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8">
        <Link href="/ledger" className="text-body-s text-accent underline-offset-4 hover:underline">
          Full Ledger →
        </Link>
        <Link href="/practice/rep" className="text-body-s text-accent underline-offset-4 hover:underline">
          Do a rep →
        </Link>
        <Link href="/practice/tracker" className="text-body-s text-accent underline-offset-4 hover:underline">
          Habit tracker →
        </Link>
      </div>
    </div>
  );
}

function twelveWeeksAgo(): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 84);
  return d;
}
