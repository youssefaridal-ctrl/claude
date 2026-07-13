import type { ULID } from '../../../shared/types/ulid';

/**
 * Base shape for all domain events. Payload is typed per concrete event.
 * The domain layer only DEFINES events; the infrastructure event bus DISPATCHES them.
 */
export interface DomainEvent<TPayload = unknown> {
  /** Unique ULID for this event occurrence. */
  readonly id: ULID;
  /** Dot-namespaced type: "transaction.created", "budget.overspent", etc. */
  readonly type: string;
  /** ISO-8601 UTC timestamp of when the event occurred. */
  readonly occurredAt: string;
  readonly payload: TPayload;
}

/** Well-known event type strings used across the application. */
export const EventType = {
  // Transaction
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_UPDATED: 'transaction.updated',
  TRANSACTION_DELETED: 'transaction.deleted',

  // Budget
  BUDGET_OVERSPENT: 'budget.overspent',
  BUDGET_PERIOD_ADVANCED: 'budget.period_advanced',

  // Goal
  GOAL_MILESTONE_REACHED: 'goal.milestone_reached',
  GOAL_COMPLETED: 'goal.completed',

  // EMF
  EMF_MILESTONE_CROSSED: 'emf.milestone_crossed',

  // Debt
  DEBT_PAID: 'debt.paid',

  // FHS
  FHS_CHANGED: 'fhs.changed',

  // Gamification
  ACHIEVEMENT_UNLOCKED: 'gamification.achievement_unlocked',
  XP_AWARDED: 'gamification.xp_awarded',
  STREAK_UPDATED: 'gamification.streak_updated',

  // Auth
  APP_UNLOCKED: 'auth.app_unlocked',
  APP_LOCKED: 'auth.app_locked',
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];
