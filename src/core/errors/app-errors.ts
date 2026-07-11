export type AppErrorCode =
  | 'DATABASE_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'UNAUTHORIZED'
  | 'UNKNOWN';

export interface AppError {
  code: AppErrorCode;
  message: string;
  cause?: unknown;
}

export function DatabaseError(message: string, cause?: unknown): AppError {
  return { code: 'DATABASE_ERROR', message, cause };
}

export function ValidationError(message: string, cause?: unknown): AppError {
  return { code: 'VALIDATION_ERROR', message, cause };
}

export function NotFoundError(message: string): AppError {
  return { code: 'NOT_FOUND', message };
}

export function AlreadyExistsError(message: string): AppError {
  return { code: 'ALREADY_EXISTS', message };
}

export function UnknownError(cause: unknown): AppError {
  const message = cause instanceof Error ? cause.message : String(cause);
  return { code: 'UNKNOWN', message, cause };
}
