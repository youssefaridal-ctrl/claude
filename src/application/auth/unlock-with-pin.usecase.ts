import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import { initDatabase } from '../../database/client';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import {
  EncryptionError,
  UnauthorizedError,
  UnknownError,
  ValidationError,
} from '../../domain/shared/errors/domain-error';
import { computeVerifier, derivePinKey } from '../../infrastructure/crypto/pbkdf2';
import { loadSalt, loadVerifier } from '../../infrastructure/crypto/pin-store';
import { useAuthStore } from '../../presentation/stores/auth.store';
import { useAppStore } from '../../store';
import { isPinValid } from './pin-validation';

/**
 * Verify an existing PIN and open the encrypted database.
 * Transitions the auth store to 'unlocked' on success.
 * The DB key is never stored — derived fresh on each unlock.
 */
export async function unlockWithPin(pin: string): Promise<Result<void, DomainError>> {
  if (!isPinValid(pin)) {
    return Err(ValidationError('PIN must be exactly 6 digits'));
  }
  try {
    const [salt, storedVerifier] = await Promise.all([loadSalt(), loadVerifier()]);
    if (!salt || !storedVerifier) {
      return Err(UnauthorizedError('No PIN credentials found. Please set up a PIN.'));
    }
    const key = await derivePinKey(pin, salt);
    const verifier = await computeVerifier(key);
    if (verifier !== storedVerifier) {
      return Err(UnauthorizedError('Incorrect PIN'));
    }
    await initDatabase(key);
    await useAppStore.getState().initializeApp();
    useAuthStore.getState().unlock(key);
    return Ok(undefined);
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'NotSupportedError') {
      return Err(EncryptionError('Key derivation not supported on this device', cause));
    }
    return Err(UnknownError(cause));
  }
}
