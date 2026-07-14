import { NativeModulesProxy, requireNativeModule } from 'expo-modules-core';

interface ExpoPbkdf2Module {
  pbkdf2HmacSha256(
    passwordHex: string,
    saltHex: string,
    iterations: number,
    keyLenBytes: number
  ): Promise<string>;
}

let module: ExpoPbkdf2Module;
try {
  module = requireNativeModule<ExpoPbkdf2Module>('ExpoPbkdf2');
} catch {
  // Fallback: should never be hit in a native build, but prevents bundler crashes
  module = NativeModulesProxy.ExpoPbkdf2 as ExpoPbkdf2Module;
}

export const { pbkdf2HmacSha256 } = module;
