import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError, ValidationError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';

interface AddBudgetCategoryInput {
  name: string;
  percentage: number;
  color: string;
  icon: string;
}

export async function addBudgetCategory(
  input: AddBudgetCategoryInput
): Promise<Result<void, DomainError>> {
  if (input.name.trim().length === 0) {
    return Err(ValidationError('Category name cannot be empty'));
  }
  if (!Number.isFinite(input.percentage) || input.percentage < 1 || input.percentage > 100) {
    return Err(ValidationError('Percentage must be between 1 and 100'));
  }

  const existing = useAppStore.getState().categories;
  const totalAllocated = existing.reduce((sum, c) => sum + c.percentage, 0);
  if (totalAllocated + input.percentage > 100) {
    return Err(
      ValidationError(
        `Cannot allocate ${input.percentage}%: only ${100 - totalAllocated}% remaining`
      )
    );
  }

  try {
    await useAppStore.getState().addCategory({
      name: input.name.trim(),
      percentage: input.percentage,
      amount: 0,
      color: input.color,
      icon: input.icon,
    });
    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
