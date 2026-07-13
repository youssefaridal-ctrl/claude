import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError, ValidationError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';

export async function updateSalary(amount: number): Promise<Result<void, DomainError>> {
  if (!Number.isFinite(amount) || amount < 0) {
    return Err(ValidationError('Salary must be a non-negative number'));
  }

  try {
    await useAppStore.getState().setSalary(amount);
    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
