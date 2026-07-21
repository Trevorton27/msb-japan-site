const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { max: 10, windowMs: 60_000 }
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + options.windowMs });
    return true;
  }

  if (entry.count >= options.max) {
    return false;
  }

  entry.count++;
  return true;
}
