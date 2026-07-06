/**
 * Application error taxonomy. Route handlers throw these; the API wrapper
 * (src/lib/api.ts) maps them to RFC 9457 problem-details responses.
 * Anything not an AppError becomes an opaque 500 — internals never leak.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(details?: unknown) {
    super("The request payload is invalid.", 422, "validation_error", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Sign in to continue.", 401, "unauthorized");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have access to this.") {
    super(message, 403, "forbidden");
  }
}

export class NotFoundError extends AppError {
  constructor(entity = "Resource") {
    super(`${entity} not found.`, 404, "not_found");
  }
}

export class RateLimitError extends AppError {
  constructor(public readonly retryAfterSeconds: number) {
    super("Too many requests. Please slow down.", 429, "rate_limited");
  }
}

export class EntitlementError extends AppError {
  constructor(requiredTier: string) {
    super(
      `This is part of the ${requiredTier} tier.`,
      402,
      "entitlement_required",
      { requiredTier },
    );
  }
}
