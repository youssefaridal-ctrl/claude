import { z } from "zod";

/**
 * Fail-fast environment validation. Imported by anything that touches env so
 * a misconfigured deploy dies at boot, not at 2 a.m. in a request handler.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("SELV <hello@localhost>"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRACTICE_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PRACTICE_ANNUAL: z.string().optional(),
  STRIPE_PRICE_ACADEMY_MONTHLY: z.string().optional(),
  STRIPE_PRICE_ACADEMY_ANNUAL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  JOURNAL_MASTER_KEY: z
    .string()
    .regex(/^[0-9a-f]{64}$/i, "JOURNAL_MASTER_KEY must be 32 bytes of hex"),
  JOURNAL_KEY_VERSION: z.coerce.number().int().positive().default(1),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export const env = {
  ...serverSchema.parse(process.env),
  ...clientSchema.parse({ NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL }),
};

export const appUrl = env.NEXT_PUBLIC_APP_URL;
