"use client";

import { useState } from "react";
import Link from "next/link";
import { pricingTiers } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Pricing tiers with billing toggle (design/03 §21). No strikethrough theatrics. */
export function TierCards() {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Billing interval"
        className="mx-auto flex w-fit items-center gap-1 rounded-full border border-border p-1"
      >
        {(["monthly", "annual"] as const).map((opt) => (
          <button
            key={opt}
            role="radio"
            aria-checked={interval === opt}
            onClick={() => setInterval(opt)}
            className={cn(
              "min-h-11 rounded-full px-5 text-body-s transition-colors duration-fast",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              interval === opt ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt === "monthly" ? "Monthly" : "Annual · 2 months free"}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex flex-col rounded-r4 border border-border bg-card p-6",
              tier.recommended && "border-t-2 border-t-solar-500",
            )}
          >
            {tier.recommended ? (
              <Badge variant="solar" className="mb-4 w-fit">Most members start here</Badge>
            ) : (
              <div className="mb-4 h-7" aria-hidden />
            )}
            <h3 className="text-heading-s font-medium">{tier.name}</h3>
            <p className="mt-1 text-body-s text-muted-foreground">{tier.identity}</p>
            <p className="mt-5 text-display-m font-medium" aria-live="polite">
              {tier.monthly === null ? (
                <span className="text-heading-s">By application</span>
              ) : tier.monthly === 0 ? (
                "$0"
              ) : interval === "monthly" ? (
                <>
                  ${tier.monthly}
                  <span className="text-body-s text-muted-foreground">/mo</span>
                </>
              ) : (
                <>
                  ${tier.annual}
                  <span className="text-body-s text-muted-foreground">/yr</span>
                </>
              )}
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-body-s text-muted-foreground">
                  <span aria-hidden className="text-positive">✓</span> {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={tier.recommended ? "primary" : "secondary"}
              size="compact"
              className="mt-6"
            >
              <Link href={tier.monthly === null ? "/contact" : "/signin"}>{tier.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
