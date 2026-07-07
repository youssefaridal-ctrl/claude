import Link from "next/link";
import { auth } from "@/auth";
import { listHabits } from "@/server/services/habits";
import { HabitWeek, type DayState } from "@/components/tracker/habit-week";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "متتبع العادات", noIndex: true });

export default async function TrackerPage() {
  const session = await auth();
  const habits = await listHabits(session!.user.id);

  return (
    <div className="container max-w-3xl py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">الأدوات</p>
          <h1 className="text-display-m font-medium">المتتبع</h1>
          <p className="mt-2 text-body-m text-muted-foreground">
            أسابيع لا سلاسل. أربعة أيام محقَّقة تعني أسبوعاً محقَّقاً — واليوم الفائت بيانات، لا حكم أبداً.
          </p>
        </div>
        <Button asChild variant="secondary" size="compact">
          <Link href="/practice/tracker/new">عادة جديدة</Link>
        </Button>
      </div>

      <div className="mt-10 space-y-6">
        {habits.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="font-serif text-serif-feature">لا شيء هنا بعد.</p>
              <p className="mt-2 text-body-s text-muted-foreground">
                هذه ليست فجوة — بل بداية. كل عادة تبدأ بمن تنتمي إليه.
              </p>
              <Button asChild className="mt-6">
                <Link href="/practice/tracker/new">أنشئ أول عادة لك</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {habits.map((habit) => (
          <Card key={habit.id}>
            <CardContent className="p-6">
              <p className="mb-1 font-serif text-body-s italic text-muted-foreground">
                {habit.identityStatement}
              </p>
              <HabitWeek
                habitId={habit.id}
                habitName={habit.name}
                target={habit.targetPerWeek}
                days={thisWeek(habit.logs.map((l) => l.date))}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function thisWeek(keptDates: Date[]): DayState[] {
  const kept = new Set(keptDates.map((d) => d.toISOString().slice(0, 10)));
  const now = new Date();
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const labels = ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"];
  const todayIso = now.toISOString().slice(0, 10);

  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, label, kept: kept.has(iso), isFuture: iso > todayIso };
  });
}
