import { requireNativeModule } from 'expo-modules-core';

interface ExpoPbkdf2Module {
  pbkdf2HmacSha256(
    passwordHex: string,
    saltHex: string,
    iterations: number,
    keyLenBytes: number
  ): Promise<string>;
}

const nativeModule = requireNativeModule<ExpoPbkdf2Module>('ExpoPbkdf2');

export function pbkdf2HmacSha256(
  passwordHex: string,
  saltHex: string,
  iterations: number,
  keyLenBytes: number
): Promise<string> {
  return nativeModule.pbkdf2HmacSha256(passwordHex, saltHex, iterations, keyLenBytes);
}
