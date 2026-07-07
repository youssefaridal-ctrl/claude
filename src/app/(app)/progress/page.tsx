import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { computeWeekStates } from "@/server/services/habits";

export const dynamic = "force-static";

export const metadata = buildMetadata({ title: "التقدم", noIndex: true });

const SOURCE_LABELS: Record<string, string> = {
  REP: "تمارين",
  HABIT: "عادات",
  CHALLENGE: "تحديات",
  JOURNAL: "مجلة",
  MANUAL: "إدخالات يدوية",
};

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) return null;
  const userId = session.user.id;

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

  const habitWeeks = habits.map((h) => ({
    name: h.name,
    identityStatement: h.identityStatement,
    weeks: computeWeekStates(h.logs, h.targetPerWeek, 12),
  }));

  const NARRATOR_NAMES: Record<string, string> = {
    PERFECTIONIST: "الكمالي",
    GUARD: "الحارس",
    GHOST: "الشبح",
    PROSECUTOR: "المدّعي",
    PLEASER: "المُرضي",
    PROPHET: "المتنبئ",
  };

  return (
    <div className="container max-w-3xl py-12">
      <p className="eyebrow mb-2">الأدوات</p>
      <h1 className="text-display-m font-medium">التقدم</h1>

      {/* Ledger summary */}
      <section aria-label="ملخص السجل" className="mt-10">
        <p className="eyebrow mb-5">سجل الهوية</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-r3 border border-border bg-card p-5">
            <p className="text-display-m font-medium">{ledgerTotal}</p>
            <p className="mt-1 font-mono text-label-mono uppercase text-muted-foreground">إجمالي المدخلات</p>
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
      <section aria-label="فصول التمارين" className="mt-10">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">فصول التمارين</p>
          {repCount > 0 && (
            <p className="text-body-s text-muted-foreground">
              {repsInCurrentChapter} / {nextChapterAt} تمريناً في الفصل {chapters.length + 1}
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
              الفصل الأول يُغلق عند ٣٠ تمريناً.
            </p>
            <p className="mt-2 text-body-s text-muted-foreground">
              {repCount === 0
                ? "تمرينك الأول على بُعد خطوة واحدة."
                : `${30 - repsInCurrentChapter} تمرين آخر لإغلاق الفصل ١.`}
            </p>
            <Link href="/practice/rep" className="mt-4 inline-block text-accent underline-offset-4 hover:underline">
              أجرِ تمريناً ←
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
                        {recap.title ?? `الفصل ${ch.number}`}
                      </p>
                      <p className="mt-1 text-body-s text-muted-foreground">
                        {ch.repCount} تمرين ·{" "}
                        {new Date(ch.closedAt).toLocaleDateString("ar-SA", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {recap.highlights && recap.highlights.length > 0 && (
                    <blockquote className="mt-4 border-r-2 border-solar-500 pr-4 font-serif text-body-l italic">
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
        <section aria-label="سجل العادات" className="mt-10">
          <p className="eyebrow mb-5">سجل العادات · ١٢ أسبوعاً</p>
          <div className="space-y-6">
            {habitWeeks.map((h) => (
              <div key={h.name}>
                <p className="mb-1 text-body-m font-medium">{h.name}</p>
                <p className="mb-3 text-body-s italic text-muted-foreground">{h.identityStatement}</p>
                <div
                  role="img"
                  aria-label={`${h.name}: ${h.weeks.filter((w) => w.kept).length} من 12 أسبوعاً محقَّقة`}
                  className="flex flex-wrap gap-1.5"
                >
                  {h.weeks.map((week) => (
                    <div
                      key={week.weekStart}
                      title={`أسبوع ${week.weekStart}: ${week.keptDays}/${week.target} أيام`}
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
                  {h.weeks.filter((w) => w.kept).length} من 12 أسبوعاً محقَّقة
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assessment history */}
      {assessments.length > 0 && (
        <section aria-label="سجل التشخيصات" className="mt-10">
          <p className="eyebrow mb-4">التشخيصات</p>
          <div className="space-y-3">
            {assessments.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border py-3">
                <div>
                  <p className="text-body-m font-medium">
                    {a.type === "DIALOGUE_AUDIT" ? "تشخيص الحوار الداخلي" : a.type}
                  </p>
                  {a.dominantNarrator && (
                    <p className="text-body-s text-muted-foreground">
                      المهيمن: {NARRATOR_NAMES[a.dominantNarrator] ?? a.dominantNarrator}
                    </p>
                  )}
                </div>
                <p className="font-mono text-label-mono uppercase text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString("ar-SA", {
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
              أعِد التشخيص ←
            </Link>
          </p>
        </section>
      )}

      {/* Quick links */}
      <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8">
        <Link href="/ledger" className="text-body-s text-accent underline-offset-4 hover:underline">
          السجل الكامل ←
        </Link>
        <Link href="/practice/rep" className="text-body-s text-accent underline-offset-4 hover:underline">
          أجرِ تمريناً ←
        </Link>
        <Link href="/practice/tracker" className="text-body-s text-accent underline-offset-4 hover:underline">
          متتبع العادات ←
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
