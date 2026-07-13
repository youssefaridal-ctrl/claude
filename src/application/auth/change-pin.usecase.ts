import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import { rekeyDatabase } from '../../database/client';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import {
  UnauthorizedError,
  UnknownError,
  ValidationError,
} from '../../domain/shared/errors/domain-error';
import { computeVerifier, derivePinKey, generateSalt } from '../../infrastructure/crypto/pbkdf2';
import { loadSalt, loadVerifier, savePinCredentials } from '../../infrastructure/crypto/pin-store';
import { useAuthStore } from '../../presentation/stores/auth.store';
import { isPinValid } from './pin-validation';

/**
 * Change the PIN while the app is unlocked.
 *
 * Steps:
 *  1. Verify current PIN against stored verifier
 *  2. Derive new key with a fresh salt
 *  3. Persist new salt + verifier to SecureStore first (so a rekey failure can be rolled back)
 *  4. PRAGMA rekey — re-encrypts the DB file in place (SQLCipher); rollback credentials on error
 *  5. Update the in-memory DB key so the session continues uninterrupted
 */
export async function changePin(
  currentPin: string,
  newPin: string
): Promise<Result<void, DomainError>> {
  if (!isPinValid(currentPin) || !isPinValid(newPin)) {
    return Err(ValidationError('PIN must be exactly 6 digits'));
  }
  if (currentPin === newPin) {
    return Err(ValidationError('New PIN must differ from the current PIN'));
  }
  try {
    const [salt, storedVerifier] = await Promise.all([loadSalt(), loadVerifier()]);
    if (!salt || !storedVerifier) {
      return Err(UnauthorizedError('No PIN credentials found.'));
    }

    const currentKey = await derivePinKey(currentPin, salt);
    const currentVerifier = await computeVerifier(currentKey);
    if (currentVerifier !== storedVerifier) {
      return Err(UnauthorizedError('Current PIN is incorrect'));
    }

    const newSalt = await generateSalt();
    const newKey = await derivePinKey(newPin, newSalt);
    const newVerifier = await computeVerifier(newKey);

    // Save new credentials BEFORE rekeying the DB.
    // If savePinCredentials fails, the DB is still encrypted with the current key
    // and the user can still unlock with their current PIN — no lockout.
    // If rekeyDatabase fails after credentials are saved, we roll back to the
    // original credentials so the current PIN continues to work.
    await savePinCredentials(newSalt, newVerifier);
    try {
      await rekeyDatabase(newKey);
    } catch (rekeyError) {
      // Rollback: restore old credentials so the current PIN still works.
      await savePinCredentials(salt, storedVerifier);
      throw rekeyError;
    }
    useAuthStore.getState().unlock(newKey);

    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
