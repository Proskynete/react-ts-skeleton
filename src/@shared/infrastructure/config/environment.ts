/**
 * Environment Configuration (Zod validated)
 *
 * @layer Shared/Infrastructure
 */

import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]).default("development"),
  VITE_API_BASE_URL: z.string().url().default("http://localhost:3000"),
  VITE_API_TIMEOUT: z
    .string()
    .default("10000")
    .transform(Number)
    .pipe(z.number().positive()),
  VITE_ENABLE_ANALYTICS: z
    .string()
    .default("false")
    .transform((v) => v === "true")
    .pipe(z.boolean()),
  VITE_SENTRY_DSN: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

function validateEnv(): Environment {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error("Environment validation failed:", error);
    throw new Error("Invalid environment configuration");
  }
}

export const env = validateEnv();
