import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { listPublishedArticles } from "@/server/services/content";

export const metadata = buildMetadata({ title: "Today", noIndex: true });

/**
 * Today — "not a dashboard, a daily page" (design/03 §26).
 * One hero action, max three tiles, whitespace as the feature.
 */
export default async function TodayPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [profile, latestLedger, weekLogs, articles] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.ledgerEntry.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.habitLog.count({
      where: {
        habit: { userId },
        status: "KEPT",
        date: { gte: startOfWeek() },
      },
    }),
    listPublishedArticles(),
  ]);

  const readingPick = articles[0];

  const greeting = greetingFor(new Date(), profile?.timezone ?? "UTC");
  const firstName = session!.user.name?.split(" ")[0];

  return (
    <div className="container max-w-3xl py-12">
      <p className="font-serif text-serif-feature">
        {formatToday(profile?.timezone ?? "UTC")}. {greeting}
        {firstName ? `, ${firstName}` : ""}.
      </p>

      {/* Hero: today's rep — exactly one primary action */}
      <Card className="mt-8 bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <p className="eyebrow">Today&rsquo;s rep · 4 min · reappraisal</p>
          <CardTitle>The Second Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-body-m text-muted-foreground">
            Take today&rsquo;s harshest line, get some distance from it, and rewrite it at believability seven.
            Both drafts go to your Ledger — the pair is the progress.
          </p>
          <Button asChild>
            <Link href="/practice/rep">Begin rep</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Max three tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">This week</p>
            <p className="text-body-m" aria-label={`${weekLogs} habit days kept this week`}>
              {"●".repeat(Math.min(weekLogs, 7))}
              {"○".repeat(Math.max(0, 4 - weekLogs))}
              <span className="ml-2 text-body-s text-muted-foreground">{weekLogs} of 4 kept</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">From your Ledger</p>
            <p className="text-body-s text-muted-foreground">
              {latestLedger ? `"${latestLedger.text}"` : "Your first evidence entry is one rep away."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">Worth reading</p>
            {readingPick ? (
              <Link href={`/blog/${readingPick.slug}`} className="text-body-s underline-offset-4 hover:underline">
                {readingPick.title} →
              </Link>
            ) : (
              <Link href="/blog" className="text-body-s underline-offset-4 hover:underline">
                Browse the essay archive →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-center">
        <Link href="/practice/tracker" className="text-body-s text-muted-foreground underline-offset-4 hover:underline">
          Browse Instruments →
        </Link>
      </p>
    </div>
  );
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function greetingFor(date: Date, timezone: string): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hour12: false }).format(date),
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatToday(timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}
