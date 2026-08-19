import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const BUILD_PLACEHOLDER_DATABASE_URL = "postgresql://127.0.0.1:5432/sun_build_placeholder";

function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || BUILD_PLACEHOLDER_DATABASE_URL;
}

function shouldUseSsl(databaseUrl: string) {
  if (process.env.DATABASE_SSL === "false") return undefined;
  if (process.env.DATABASE_SSL === "true") return { rejectUnauthorized: false };
  if (/sslmode=disable/i.test(databaseUrl)) return undefined;
  if (
    process.env.NODE_ENV === "production" ||
    /sslmode=require|supabase|neon\.tech|pooler|amazonaws|vercel-storage/i.test(databaseUrl)
  ) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

const globalForDb = globalThis as typeof globalThis & {
  __sunPgPool?: Pool;
};

function getPool() {
  if (!globalForDb.__sunPgPool) {
    const databaseUrl = resolveDatabaseUrl();
    globalForDb.__sunPgPool = new Pool({
      connectionString: databaseUrl,
      ssl: shouldUseSsl(databaseUrl),
      max: 5,
    });
  }
  return globalForDb.__sunPgPool;
}

export const pool = new Proxy({} as Pool, {
  get(_target, property, _receiver) {
    const instance = getPool();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export const db = drizzle(pool);
