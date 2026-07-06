import { ProgressDemo } from "@/components/preview/progress-demo";
import { Badge } from "@/components/ui/badge";

export default function PreviewProgressPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Progress</p>
      <h1 className="text-display-m font-medium">Evidence, not points.</h1>
      <p className="mt-2 max-w-xl text-body-m text-muted-foreground">
        The Ledger keeps what you did; the Delta shows what moved. You&rsquo;ll find no XP, no levels-by-payment,
        and no leaderboards anywhere in this product — comparison is the disease we treat.
      </p>
      <div className="mt-4 flex gap-2">
        <Badge variant="filled">Chapter 2 · rep 12 of 30</Badge>
        <Badge>47 Ledger entries</Badge>
      </div>
      <div className="mt-10">
        <ProgressDemo />
      </div>
    </div>
  );
}
