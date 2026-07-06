import Link from "next/link";
import { RepPlayer } from "@/components/preview/rep-player";
import { Card, CardContent } from "@/components/ui/card";
import { previewLedger } from "@/lib/mock";

export default function PreviewTodayPage() {
  const latest = previewLedger[0];
  return (
    <div className="container max-w-3xl py-12">
      <p className="font-serif text-serif-feature">
        {new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}.
        Good morning, Maya.
      </p>

      <div className="mt-8">
        <RepPlayer />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">This week</p>
            <p className="text-body-m">
              ●●●○ <span className="ml-2 text-body-s text-muted-foreground">3 of 4 kept</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">From your Ledger</p>
            <p className="text-body-s text-muted-foreground">“{latest.text}”</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="eyebrow mb-2">Worth reading</p>
            <Link href="/blog/the-2am-tribunal" className="text-body-s underline-offset-4 hover:underline">
              The 2 a.m. Tribunal →
            </Link>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-center">
        <Link href="/preview/tracker" className="text-body-s text-muted-foreground underline-offset-4 hover:underline">
          Browse Instruments →
        </Link>
      </p>
    </div>
  );
}
