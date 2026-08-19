import { z } from "zod";

const BUILD_PLACEHOLDER_DATABASE_URL = "postgresql://127.0.0.1:5432/sun_build_placeholder";

const FALLBACK = {
  DATABASE_URL: BUILD_PLACEHOLDER_DATABASE_URL,
  JWT_ACCESS_SECRET: "sun_access_secret_change_me",
  JWT_REFRESH_SECRET: "sun_refresh_secret_change_me",
  ACCESS_TOKEN_TTL_MINUTES: 15,
  REFRESH_TOKEN_TTL_DAYS: 30,
  PAYMENT_CALLBACK_SECRET: "sun_payment_callback_secret_change_me",
  CORS_ALLOWED_ORIGIN: undefined as string | undefined,
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default(FALLBACK.DATABASE_URL),
  JWT_ACCESS_SECRET: z.string().min(16).default(FALLBACK.JWT_ACCESS_SECRET),
  JWT_REFRESH_SECRET: z.string().min(16).default(FALLBACK.JWT_REFRESH_SECRET),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().positive().default(FALLBACK.ACCESS_TOKEN_TTL_MINUTES),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().positive().default(FALLBACK.REFRESH_TOKEN_TTL_DAYS),
  PAYMENT_CALLBACK_SECRET: z.string().min(16).default(FALLBACK.PAYMENT_CALLBACK_SECRET),
  CORS_ALLOWED_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: readEnv("DATABASE_URL"),
  JWT_ACCESS_SECRET: readEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: readEnv("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_TTL_MINUTES: readEnv("ACCESS_TOKEN_TTL_MINUTES"),
  REFRESH_TOKEN_TTL_DAYS: readEnv("REFRESH_TOKEN_TTL_DAYS"),
  PAYMENT_CALLBACK_SECRET: readEnv("PAYMENT_CALLBACK_SECRET"),
  CORS_ALLOWED_ORIGIN: readEnv("CORS_ALLOWED_ORIGIN"),
});

export const env = parsed.success ? parsed.data : FALLBACK;

export function hasLiveDatabase() {
  const url = readEnv("DATABASE_URL");
  return Boolean(url) && url !== BUILD_PLACEHOLDER_DATABASE_URL;
}
