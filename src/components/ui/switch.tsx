"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Toggle switch (design/04 §9): 44×24 track, ink when on with a Solar dot
 * indicator, 150ms motion. Native button with role="switch" — zero deps,
 * full keyboard/AT support. Always pair with a visible label via aria-labelledby
 * or aria-label.
 */
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, className, disabled, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      ref={ref}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-fast",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        checked ? "border-foreground bg-foreground" : "border-border bg-muted",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "block h-4 w-4 translate-x-1 rounded-full transition-transform duration-fast ease-out-quart",
          checked ? "translate-x-6 bg-solar-500" : "bg-background",
        )}
      />
    </button>
  ),
);
Switch.displayName = "Switch";

export { Switch };
