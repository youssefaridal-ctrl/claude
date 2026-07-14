/**
 * Installs react-native-quick-crypto as global.crypto so that crypto.subtle
 * (PBKDF2, SHA-256) is available in Hermes on Android and iOS.
 *
 * Hermes does not ship SubtleCrypto; this must run before any code that
 * calls crypto.subtle.importKey / deriveBits / digest.
 */
import { install } from 'react-native-quick-crypto';

install();
