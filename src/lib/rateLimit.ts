export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface ClientBucket {
  count: number;
  resetAt: number;
}

const rateLimitStores = new Map<string, Map<string, ClientBucket>>();

/**
 * Extracts client IP from standard reverse proxy headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return ip;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Checks and updates rate limit for a given action and client identifier.
 * Automatically cleans up expired buckets.
 */
export function checkRateLimit(
  namespace: string,
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  if (!rateLimitStores.has(namespace)) {
    rateLimitStores.set(namespace, new Map());
  }

  const store = rateLimitStores.get(namespace)!;

  // Cleanup old records occasionally
  if (store.size > 2000) {
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt <= now) {
        store.delete(key);
      }
    }
  }

  let bucket = store.get(identifier);

  if (!bucket || bucket.resetAt <= now) {
    bucket = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(identifier, bucket);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterSeconds: 0,
    };
  }

  if (bucket.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - bucket.count,
    retryAfterSeconds: 0,
  };
}
