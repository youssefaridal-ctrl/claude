import { requireNativeModule } from 'expo-modules-core';

interface ExpoPbkdf2Module {
  pbkdf2HmacSha256(
    passwordHex: string,
    saltHex: string,
    iterations: number,
    keyLenBytes: number
  ): Promise<string>;
}

// Lazy singleton — not called at module evaluation time so a missing native
// registration only surfaces when pbkdf2HmacSha256 is first invoked (inside
// an async use-case), not at startup.
let _mod: ExpoPbkdf2Module | null = null;
function getModule(): ExpoPbkdf2Module {
  if (!_mod) _mod = requireNativeModule<ExpoPbkdf2Module>('ExpoPbkdf2');
  return _mod;
}

export function pbkdf2HmacSha256(
  passwordHex: string,
  saltHex: string,
  iterations: number,
  keyLenBytes: number
): Promise<string> {
  return getModule().pbkdf2HmacSha256(passwordHex, saltHex, iterations, keyLenBytes);
}
