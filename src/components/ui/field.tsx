import * as React from "react";
import { cn } from "@/lib/utils";
import { Label, FieldError } from "@/components/ui/input";

/**
 * Field: the mandatory form-row wrapper. Wires label ↔ control ↔ help ↔ error
 * with correct ids/aria-describedby so no form ships with orphaned labels.
 * Labels sit ABOVE the control, always visible (design/04 §9 — never
 * placeholder-as-label). Errors are kind and specific (content/00 rules).
 *
 *   <Field id="email" label="Email" help="We only use this to sign you in."
 *          error={errors.email}>
 *     {(aria) => <Input type="email" {...aria} />}
 *   </Field>
 */
export interface FieldAria {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export function Field({
  id,
  label,
  help,
  error,
  optional = false,
  className,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string | null;
  optional?: boolean;
  className?: string;
  children: (aria: FieldAria) => React.ReactNode;
}) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("mb-5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="ml-2 font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {help && (
        <p id={helpId} className="mt-1.5 text-body-s text-muted-foreground">
          {help}
        </p>
      )}
      <FieldError id={errorId ?? `${id}-error`}>{error}</FieldError>
    </div>
  );
}
