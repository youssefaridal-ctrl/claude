/**
 * Auth session state — kept in memory only, never persisted.
 *
 * AuthStatus machine:
 *   'checking'  → app start, determining if PIN exists
 *   'no_pin'    → first launch, no PIN configured yet
 *   'locked'    → PIN exists but user not yet authenticated this session
 *   'unlocked'  → PIN verified, DB key in memory, DB open
 */

import { create } from 'zustand';

export type AuthStatus = 'checking' | 'no_pin' | 'locked' | 'unlocked' | 'error';

interface AuthState {
  status: AuthStatus;
  /** In-memory derived key hex — present only when status === 'unlocked'. */
  dbKey: string | null;

  setStatus: (status: AuthStatus) => void;
  unlock: (dbKey: string) => void;
  lock: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'checking',
  dbKey: null,

  setStatus: (status) => set({ status }),

  unlock: (dbKey) => set({ status: 'unlocked', dbKey }),

  lock: () => set({ status: 'locked', dbKey: null }),
}));
