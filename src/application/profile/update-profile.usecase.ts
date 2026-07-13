import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError, ValidationError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';
import type { Currency, UserProfile } from '../../store/types';

interface ProfileUpdate {
  name?: string;
  currency?: Currency;
  salaryPaymentDay?: number;
}

/**
 * Persist name, currency, and/or salary payment day.
 * Each field is optional — omit a field to leave it unchanged.
 */
export async function updateProfile(update: ProfileUpdate): Promise<Result<void, DomainError>> {
  if (update.name !== undefined && update.name.trim().length === 0) {
    return Err(ValidationError('Name cannot be empty'));
  }
  if (
    update.salaryPaymentDay !== undefined &&
    (!Number.isInteger(update.salaryPaymentDay) ||
      update.salaryPaymentDay < 1 ||
      update.salaryPaymentDay > 28)
  ) {
    return Err(ValidationError('Salary payment day must be between 1 and 28'));
  }

  try {
    const patch: Partial<UserProfile> = {};
    if (update.name !== undefined) patch.name = update.name.trim();
    if (update.currency !== undefined) patch.currency = update.currency;
    if (update.salaryPaymentDay !== undefined) patch.salaryPaymentDay = update.salaryPaymentDay;
    await useAppStore.getState().updateUser(patch);
    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
