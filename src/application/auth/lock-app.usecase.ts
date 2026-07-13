import { closeDatabase } from '../../database/client';
import { useAuthStore } from '../../presentation/stores/auth.store';
import { useAppStore } from '../../store';

/**
 * Lock the app: close the DB, wipe in-memory data, clear the DB key.
 * Navigation back to the lock screen is driven by the auth store state change.
 */
export async function lockApp(): Promise<void> {
  await closeDatabase();
  useAppStore.setState({ isInitialized: false, isLoading: true });
  useAuthStore.getState().lock();
}
