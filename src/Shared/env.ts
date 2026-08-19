import { z } from "zod";

const BUILD_PLACEHOLDER_DATABASE_URL = "postgresql://127.0.0.1:5432/sun_build_placeholder";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default(BUILD_PLACEHOLDER_DATABASE_URL),
  JWT_ACCESS_SECRET: z.string().min(16).default("sun_access_secret_change_me"),
  JWT_REFRESH_SECRET: z.string().min(16).default("sun_refresh_secret_change_me"),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().positive().default(30),
  PAYMENT_CALLBACK_SECRET: z.string().min(16).default("sun_payment_callback_secret_change_me"),
  CORS_ALLOWED_ORIGIN: z.string().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL_MINUTES: process.env.ACCESS_TOKEN_TTL_MINUTES,
  REFRESH_TOKEN_TTL_DAYS: process.env.REFRESH_TOKEN_TTL_DAYS,
  PAYMENT_CALLBACK_SECRET: process.env.PAYMENT_CALLBACK_SECRET,
  CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN,
});

export function hasLiveDatabase() {
  return Boolean(process.env.DATABASE_URL) && process.env.DATABASE_URL !== BUILD_PLACEHOLDER_DATABASE_URL;
}
