import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError, ValidationError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';

interface AddIncomeSourceInput {
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
}

export async function addIncomeSource(
  input: AddIncomeSourceInput
): Promise<Result<void, DomainError>> {
  if (input.name.trim().length === 0) {
    return Err(ValidationError('Income source name cannot be empty'));
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return Err(ValidationError('Income source amount must be greater than 0'));
  }

  try {
    await useAppStore.getState().addIncomeSource({
      name: input.name.trim(),
      amount: input.amount,
      type: input.type,
    });
    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
