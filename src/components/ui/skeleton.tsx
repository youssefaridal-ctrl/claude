import { cn } from "@/lib/utils";

/**
 * Loading skeleton (design/04 §15): luminance-step shimmer via the muted
 * surface token — works in both themes, no grey boxes on dark. Display
 * skeletons for ≥400ms once shown, to avoid flash.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-r2 bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
