import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge / mono-label chip. Default variant is the blueprint "annotation" voice
 * (mono, uppercase). Solar is reserved for earned/recommended markers only —
 * the ≤5% accent rule applies (design/04 §1.2).
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-r1 border px-2.5 py-1 font-mono text-label-mono uppercase",
  {
    variants: {
      variant: {
        default: "border-border bg-transparent text-muted-foreground",
        filled: "border-transparent bg-muted text-foreground",
        solar: "border-solar-500/40 bg-solar-500/10 text-accent",
        positive: "border-transparent bg-positive/15 text-positive",
        attention: "border-transparent bg-attention/15 text-attention",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
