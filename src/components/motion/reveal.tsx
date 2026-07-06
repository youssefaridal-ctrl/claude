"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * "Type rise" entrance (design/04 §15): 16px rise + fade, ease-out-quart,
 * optional sibling stagger. Reduced-motion parity is automatic — opacity-only
 * fade ≤200ms, no translation. Never triggers again after first entry.
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "span" | "li";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2, delay } },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] },
        },
      };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger container: children Reveal with 60ms offsets, capped at 6 (design/04 §15). */
export function RevealGroup({ children, className }: { children: ReactNode[]; className?: string }) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={Math.min(i, 5) * 0.06}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
