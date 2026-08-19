type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __sunRateLimitStore?: Map<string, Bucket>;
};

const store = globalStore.__sunRateLimitStore ?? new Map<string, Bucket>();
globalStore.__sunRateLimitStore = store;

export function checkRateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = store.get(input.key);

  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + input.windowMs };
    store.set(input.key, fresh);
    return { allowed: true, remaining: input.limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= input.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(input.key, existing);
  return { allowed: true, remaining: input.limit - existing.count, resetAt: existing.resetAt };
}
