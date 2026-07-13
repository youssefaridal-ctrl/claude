import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';

export async function deleteTransaction(id: string): Promise<Result<void, DomainError>> {
  try {
    await useAppStore.getState().deleteTransaction(id);
    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
