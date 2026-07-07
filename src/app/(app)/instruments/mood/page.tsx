import { buildMetadata } from "@/lib/seo";
import { MoodCheckin } from "@/components/instruments/mood-checkin";

export const metadata = buildMetadata({ title: "الطقس الداخلي", noIndex: true });

export default function MoodPage() {
  return (
    <div className="container max-w-2xl py-12">
      <p className="eyebrow mb-2">الأدوات</p>
      <h1 className="text-display-m font-medium">الطقس الداخلي</h1>
      <p className="mt-2 text-body-m text-muted-foreground">
        ليس درجة مزاج — بل ممارسة ملاحظة. الأنماط تحتاج شهراً كي تصبح قابلة للقراءة،
        وهي مفيدة فقط حين تكون لك أنت.
      </p>
      <div className="mt-10">
        <MoodCheckin />
      </div>
    </div>
  );
}
