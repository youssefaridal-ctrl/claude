"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * Lightweight CSS-only tooltip — no Radix dependency, respects prefers-reduced-motion.
 * For complex interactive tooltips (with forms/actions inside), use Dialog instead.
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const positions = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-xs rounded-r2 bg-ink-900 px-3 py-2",
          "font-mono text-label-mono text-bone-50",
          "opacity-0 transition-opacity duration-fast",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          "motion-reduce:transition-none",
          positions[side],
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
