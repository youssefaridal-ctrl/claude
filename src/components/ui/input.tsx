import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Blueprint input (design/04 §9): 48px, filled style, labels always visible
 * ABOVE the field — pair with <Label>, never placeholder-as-label.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-r1 border border-border bg-input px-4 text-body-m",
        "placeholder:text-muted-foreground/70",
        "transition-colors duration-fast",
        "focus-visible:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-[invalid=true]:border-attention",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-r1 border border-border bg-input px-4 py-3 text-body-m",
        "placeholder:text-muted-foreground/70",
        "focus-visible:border-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "aria-[invalid=true]:border-attention",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("mb-1.5 block text-body-s font-medium", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";

/** Error message with recovery guidance — kind and specific by content rule. */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-body-s text-attention">
      {children}
    </p>
  );
}

export { Input, Textarea, Label, FieldError };
