import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";
import { env } from "@/env";

/**
 * Journal encryption: AES-256-GCM with a per-user derived key.
 *
 * Threat model & honesty note (mirrors the public privacy copy):
 * - Entries are encrypted at rest with keys derived from a master key held
 *   only in the runtime environment — a database leak exposes nothing.
 * - This is *server-held* encryption. True client-side E2E (keys derived from
 *   a user passphrase, never leaving the device) is the roadmap and the
 *   marketing copy must not claim E2E until it ships. See ARCHITECTURE.md
 *   §Security for the migration path (keyVersion field exists for exactly this).
 */

function deriveUserKey(userId: string): Buffer {
  const master = Buffer.from(env.JOURNAL_MASTER_KEY, "hex");
  return createHash("sha256").update(master).update(userId).digest();
}

export interface Envelope {
  ciphertext: Buffer;
  iv: Buffer;
  authTag: Buffer;
  keyVersion: number;
}

export function encryptForUser(userId: string, plaintext: string): Envelope {
  const key = deriveUserKey(userId);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return { ciphertext, iv, authTag: cipher.getAuthTag(), keyVersion: env.JOURNAL_KEY_VERSION };
}

export function decryptForUser(userId: string, envelope: Envelope): string {
  const key = deriveUserKey(userId);
  const decipher = createDecipheriv("aes-256-gcm", key, envelope.iv);
  decipher.setAuthTag(envelope.authTag);
  return Buffer.concat([decipher.update(envelope.ciphertext), decipher.final()]).toString("utf8");
}
