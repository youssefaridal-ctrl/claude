import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import { initDatabase } from '../../database/client';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import {
  EncryptionError,
  UnknownError,
  ValidationError,
} from '../../domain/shared/errors/domain-error';
import { computeVerifier, derivePinKey, generateSalt } from '../../infrastructure/crypto/pbkdf2';
import { savePinCredentials } from '../../infrastructure/crypto/pin-store';
import { useAuthStore } from '../../presentation/stores/auth.store';
import { useAppStore } from '../../store';
import { isPinValid } from './pin-validation';

/**
 * First-time PIN setup.
 * Derives the DB encryption key, persists credentials, opens the DB, and
 * transitions the auth store to 'unlocked'. The key never touches disk.
 */
export async function setupPin(pin: string): Promise<Result<void, DomainError>> {
  if (!isPinValid(pin)) {
    return Err(ValidationError('PIN must be exactly 6 digits'));
  }
  try {
    const salt = await generateSalt();
    const key = await derivePinKey(pin, salt);
    const verifier = await computeVerifier(key);
    await savePinCredentials(salt, verifier);
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
