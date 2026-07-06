import pino from "pino";

/**
 * Structured JSON logging. Redaction list guards the fields that must never
 * reach log aggregation — journal plaintext is encrypted before it could ever
 * appear here, but defense in depth costs one array.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.token",
      "*.ciphertext",
      "*.body.content", // journal payloads
      "*.email",
    ],
    censor: "[redacted]",
  },
  base: { service: "selv-web" },
});

export function reqLogger(requestId: string) {
  return logger.child({ requestId });
}
