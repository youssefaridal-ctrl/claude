import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError, ValidationError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface AddTransactionInput {
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  type: 'expense' | 'income';
}

export async function addTransaction(
  input: AddTransactionInput
): Promise<Result<void, DomainError>> {
  if (input.description.trim().length === 0) {
    return Err(ValidationError('Description cannot be empty'));
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return Err(ValidationError('Amount must be greater than 0'));
  }
  if (!input.categoryId) {
    return Err(ValidationError('Category is required'));
  }
  if (!DATE_RE.test(input.date)) {
    return Err(ValidationError('Date must be in YYYY-MM-DD format'));
  }

  try {
    await useAppStore.getState().addTransaction({
      description: input.description.trim(),
      amount: input.amount,
      categoryId: input.categoryId,
      date: input.date,
      type: input.type,
    });
    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
