import Link from "next/link";
import { RepPlayer } from "@/components/preview/rep-player";
import { Card, CardContent } from "@/components/ui/card";
import { previewLedger } from "@/lib/mock";

export default function PreviewTodayPage() {
  const latest = previewLedger[0];
  return (
    <div className="container max-w-3xl py-12">
      <p className="font-serif text-serif-feature">
        {new Intl.DateTimeFormat("ar-SA", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}.
        صباح الخير، مايا.
      </p>

      <div className="mt-8">
        <RepPlayer />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">هذا الأسبوع</p>
            <p className="text-body-m">
              ●●●○ <span className="mr-2 text-body-s text-muted-foreground">٣ من ٤ محقَّقة</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">من سجلّك</p>
            <p className="text-body-s text-muted-foreground">&ldquo;{latest.text}&rdquo;</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">يستحق القراءة</p>
            <Link href="/blog/the-2am-tribunal" className="text-body-s underline-offset-4 hover:underline">
              محكمة الثانية صباحاً ←
            </Link>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-center">
        <Link href="/preview/tracker" className="text-body-s text-muted-foreground underline-offset-4 hover:underline">
          تصفّح الأدوات ←
        </Link>
      </p>
    </div>
  );
}
