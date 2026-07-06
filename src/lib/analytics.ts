import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * First-party, privacy-first analytics. No third-party trackers — a stated
 * trust feature (design/02 §12). Events are written to Postgres; aggregation
 * happens in scheduled jobs / dashboards, never in request paths.
 *
 * Anti-metrics rule (design/02 §14): we deliberately do NOT track session
 * length or notification CTR. Don't add them.
 */

type EventName =
  | "audit_started"
  | "audit_completed"
  | "audit_result_saved"
  | "signup_completed"
  | "first_rep_completed"
  | "rep_completed"
  | "habit_logged"
  | "ledger_entry_created"
  | "chapter_closed"
  | "checkout_started"
  | "subscription_activated"
  | "subscription_canceled"
  | "course_enrolled"
  | "lesson_completed"
  | "certificate_issued"
  | "post_created"
  | "challenge_completed";

export async function track(
  name: EventName,
  opts: { userId?: string; anonId?: string; props?: Record<string, unknown> } = {},
): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        name,
        userId: opts.userId,
        anonId: opts.anonId,
        props: opts.props as object | undefined,
      },
    });
  } catch (err) {
    // Analytics must never break product paths.
    logger.warn({ err, name }, "analytics_write_failed");
  }
}
