import { episodes } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "الصوت الداخلي — محادثات حول التحوّل",
  description: "بودكاست سيلف: محادثات غير مستعجلة مع باحثين وأطباء وأعضاء. كل ضيف يُجيب على السؤال الختامي ذاته.",
  path: "/podcast",
});

export default function PodcastPage() {
  return (
    <div className="container max-w-3xl py-s9">
      <p className="eyebrow mb-3">البودكاست</p>
      <h1 className="text-display-l font-medium">الصوت الداخلي.</h1>
      <p className="mt-3 text-body-l text-muted-foreground">
        محادثات حول التحوّل — مع باحثين وأطباء وأعضاء. كل حلقة تنتهي بالسؤالين ذاتهما:{" "}
        <em>ماذا يقول صوتك الداخلي هذه الأيام، حرفياً؟</em> و{" "}
        <em>ما أصغر تمرين تمارسه إلى الآن؟</em>
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" size="compact">Apple Podcasts</Button>
        <Button variant="secondary" size="compact">Spotify</Button>
        <Button variant="ghost" size="compact">RSS</Button>
      </div>

      <ol className="mt-12">
        {episodes.map((e) => (
          <li key={e.number} className="border-b border-border">
            <details className="group py-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-6 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <span className="font-mono text-display-m text-muted-foreground/40" aria-hidden>
                  {String(e.number).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block text-body-l font-medium">{e.title}</span>
                  <span className="block text-body-s text-muted-foreground">{e.guest}</span>
                </span>
                <span className="font-mono text-label-mono text-muted-foreground">{e.minutes} د</span>
              </summary>
              <div className="mr-[4.5rem] pb-2 pt-2">
                <div className="flex items-center gap-4 rounded-r3 border border-border bg-card p-4">
                  <Button size="compact" aria-label={`تشغيل الحلقة ${e.number}`}>تشغيل ▸</Button>
                  <div className="h-1 flex-1 rounded-full bg-muted" aria-hidden>
                    <div className="h-full w-0 rounded-full bg-foreground" />
                  </div>
                  <span className="font-mono text-label-mono text-muted-foreground">00:00</span>
                </div>
                <p className="mt-3 text-body-s text-muted-foreground">
                  المشغّل الكامل، والملاحظات المبوّبة، والنص القابل للبحث تأتي مع استيراد الصوت.
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
