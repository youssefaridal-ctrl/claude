import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Blueprint button (design/04 §7). The primary variant carries the signature
 * "solar trace" hover — a perimeter light drawn via an inset ring transition.
 * Minimum touch target 44px is enforced by the default size.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-r2 font-medium",
    "transition-all duration-base ease-out-quart",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.985]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-elev-1 hover:-translate-y-px hover:shadow-elev-2 hover:ring-1 hover:ring-solar-500/70 hover:ring-offset-0",
        secondary: "border border-border bg-transparent hover:bg-muted",
        ghost: "hover:bg-muted",
        link: "underline-offset-4 hover:underline text-accent",
        destructive: "text-attention border border-attention/40 hover:bg-attention/10",
      },
      size: {
        default: "h-12 px-5 text-body-m", // 48px (design spec)
        compact: "h-10 px-4 text-body-s", // 40px compact
        icon: "h-11 w-11", // 44px icon-only minimum
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
