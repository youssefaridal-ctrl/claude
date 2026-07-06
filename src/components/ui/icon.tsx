import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { icon as iconTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

/**
 * Icon: the single sanctioned way to render an icon (design/01 §14).
 * Enforces the 1.5px stroke and the four size tokens; guarantees an
 * accessibility decision — pass `label` for meaningful icons, omit it for
 * decorative ones (aria-hidden is applied automatically).
 *
 *   <Icon icon={Compass} size="nav" label="Explore" />   // meaningful
 *   <Icon icon={ArrowRight} size="inline" />             // decorative
 */
export type IconSize = keyof typeof iconTokens.sizes;

export function Icon({
  icon: LucideComponent,
  size = "button",
  label,
  className,
}: {
  icon: LucideIcon;
  size?: IconSize;
  label?: string;
  className?: string;
}) {
  const px = iconTokens.sizes[size];
  return (
    <LucideComponent
      width={px}
      height={px}
      strokeWidth={iconTokens.strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("shrink-0", className)}
    />
  );
}
