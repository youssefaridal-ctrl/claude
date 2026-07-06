"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Checkbox: fills with a 150ms wipe (design/04 §16), native input for full
 * form/AT semantics; the visible box is the styled sibling. 44px touch area
 * via padding on the label wrapper — compose with <Field> or a <label>.
 */
export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <span className={cn("relative inline-flex h-11 w-11 items-center justify-center", className)}>
      <input
        type="checkbox"
        ref={ref}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-[4px] border border-border bg-input",
          "transition-all duration-fast",
          "peer-checked:border-foreground peer-checked:bg-foreground",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          "peer-disabled:opacity-40",
          "[&>svg]:scale-0 [&>svg]:transition-transform [&>svg]:duration-fast peer-checked:[&>svg]:scale-100",
        )}
      >
        <Check className="h-3.5 w-3.5 text-background" strokeWidth={2} />
      </span>
    </span>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
