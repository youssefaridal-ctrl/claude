import Link from "next/link";
import { ImmersiveTierCards } from "@/components/pricing/immersive-tier-cards";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "الأسعار — بسيطة وصادقة، إلغاء بنقرتين",
  description:
    "أدوات مجانية للأبد، الممارسة بـ 19$/شهر، الأكاديمية بـ 39$/شهر. استرداد 30 يوماً بلا استجواب. نصمم للتخرج، لا للتقييد.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="container py-s9">
      <Reveal>
        <div className="text-center">
          <h1 className="text-display-l font-medium">أسعار بسيطة وصادقة.</h1>
          <p className="mx-auto mt-4 max-w-xl text-body-l text-muted-foreground">
            إلغاء في أي وقت بنقرتين. استرداد ثلاثين يوماً، بلا استجواب.
          </p>
        </div>
      </Reveal>

      <div className="mt-12">
        <ImmersiveTierCards />
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-16 max-w-2xl rounded-r4 border border-border bg-card p-8">
          <h2 className="text-heading-s font-medium">الضمان، في ثلاث جمل واضحة.</h2>
          <p className="mt-3 text-body-m text-muted-foreground">
            جرّب أي مستوى مدفوع لثلاثين يوماً. إذا لم يكن يُحرّك شيئاً، اكتب سطراً واحداً
            واسترد أموالك — بلا مكالمة، ولا استبيان مطوّل، ولا 'متخصص استبقاء'. نفضّل
            ثقتك على تجديدك.
          </p>
          <p className="mt-4 font-serif italic text-muted-foreground">— فريق سيلف</p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-12 text-center text-body-m text-muted-foreground">
          لست مستعداً للدفع؟{" "}
          <Link href="/lab/audit" className="underline underline-offset-4">التشخيص</Link> وأساسيات المختبر
          مجانية للأبد. هذا ليس تجربة — إنه الباب الأمامي.
        </p>
      </Reveal>
    </div>
  );
}
