const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  existing.count += 1;
  if (existing.count > limit) {
    return true;
  }

  return false;
}
