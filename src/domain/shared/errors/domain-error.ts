/**
 * Domain layer has zero external dependencies.
 * All errors are plain data objects — no class hierarchy, no Error extension.
 */

export const ErrorCode = {
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  DATABASE: 'DATABASE',
  ENCRYPTION: 'ENCRYPTION',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface DomainError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly cause?: unknown;
}

// ── Constructors ──────────────────────────────────────────────────────────────

export const ValidationError = (message: string): DomainError => ({
  code: ErrorCode.VALIDATION,
  message,
});

export const NotFoundError = (message: string): DomainError => ({
  code: ErrorCode.NOT_FOUND,
  message,
});

export const AlreadyExistsError = (message: string): DomainError => ({
  code: ErrorCode.ALREADY_EXISTS,
  message,
});

export const UnauthorizedError = (message: string): DomainError => ({
  code: ErrorCode.UNAUTHORIZED,
  message,
});

export const DatabaseError = (message: string, cause?: unknown): DomainError => ({
  code: ErrorCode.DATABASE,
  message,
  cause,
});

export const EncryptionError = (message: string, cause?: unknown): DomainError => ({
  code: ErrorCode.ENCRYPTION,
  message,
  cause,
});

export const UnknownError = (cause: unknown): DomainError => ({
  code: ErrorCode.UNKNOWN,
  message: cause instanceof Error ? cause.message : 'An unexpected error occurred',
  cause,
});
