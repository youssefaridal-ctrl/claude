import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { listPublishedArticles } from "@/server/services/content";

export const dynamic = "force-static";

export const metadata = buildMetadata({ title: "اليوم", noIndex: true });

/**
 * Today — "not a dashboard, a daily page" (design/03 §26).
 * One hero action, max three tiles, whitespace as the feature.
 */
export default async function TodayPage() {
  const session = await auth();
  if (!session?.user) return null;
  const userId = session.user.id;

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
          <p className="eyebrow">تمرين اليوم · ٤ دقائق · إعادة تأطير</p>
          <CardTitle>المسودة الثانية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-body-m text-muted-foreground">
            خذ أقسى جملة اليوم، أعطها مسافة، وأعد كتابتها عند درجة مصداقية سبعة.
            كلتا المسودتين تذهبان إلى سجلّك — الزوج هو التقدم.
          </p>
          <Button asChild>
            <Link href="/practice/rep">ابدأ التمرين</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Max three tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">هذا الأسبوع</p>
            <p className="text-body-m" aria-label={`${weekLogs} أيام عادة محقَّقة هذا الأسبوع`}>
              {"●".repeat(Math.min(weekLogs, 7))}
              {"○".repeat(Math.max(0, 4 - weekLogs))}
              <span className="mr-2 text-body-s text-muted-foreground">{weekLogs} من ٤ محقَّقة</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">من سجلّك</p>
            <p className="text-body-s text-muted-foreground">
              {latestLedger ? `"${latestLedger.text}"` : "إدخال دليلك الأول على بُعد تمرين واحد."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">يستحق القراءة</p>
            {readingPick ? (
              <Link href={`/blog/${readingPick.slug}`} className="text-body-s underline-offset-4 hover:underline">
                {readingPick.title} ←
              </Link>
            ) : (
              <Link href="/blog" className="text-body-s underline-offset-4 hover:underline">
                تصفّح أرشيف المقالات ←
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-center">
        <Link href="/practice/tracker" className="text-body-s text-muted-foreground underline-offset-4 hover:underline">
          تصفّح الأدوات ←
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
  if (hour < 12) return "صباح الخير";
  if (hour < 18) return "مساء الخير";
  return "مساء النور";
}

function formatToday(timezone: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}
