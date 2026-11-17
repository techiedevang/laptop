/**
 * Rate limiting configuration using rate-limiter-flexible + Redis (ioredis).
 * Falls back to in-memory if Redis is not configured (dev mode).
 */

import {
  RateLimiterRedis,
  RateLimiterMemory,
  RateLimiterAbstract,
  IRateLimiterOptions,
} from 'rate-limiter-flexible';

// Lazy Redis import to avoid issues in edge runtimes
let redisClient: import('ioredis').Redis | null = null;

function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (redisClient) return redisClient;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Redis = require('ioredis');
  redisClient = new Redis(process.env.REDIS_URL, {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  });
  return redisClient;
}

function createLimiter(opts: IRateLimiterOptions & { keyPrefix: string }): RateLimiterAbstract {
  // Use memory limiter in development or if Redis is not active
  if (process.env.NODE_ENV !== 'production') {
    return new RateLimiterMemory(opts);
  }
  const redis = getRedis();
  if (redis) {
    return new RateLimiterRedis({ storeClient: redis, ...opts });
  }
  return new RateLimiterMemory(opts);
}

// ─── Limiters ────────────────────────────────────────────────────────────────

/** General API rate limit: 100 requests per minute per IP */
export const apiLimiter = createLimiter({
  keyPrefix: 'rl:api',
  points: 100,
  duration: 60,
});

/** Auth endpoints: 50 attempts per 15 minutes per IP (generous in development) */
export const authLimiter = createLimiter({
  keyPrefix: 'rl:auth',
  points: process.env.NODE_ENV === 'production' ? 10 : 100,
  duration: 900,
});

/** OTP send: 5 OTPs per 10 minutes per identifier */
export const otpSendLimiter = createLimiter({
  keyPrefix: 'rl:otp:send',
  points: 5,
  duration: 600,
});

/** OTP verify: 10 attempts per 5 minutes per identifier */
export const otpVerifyLimiter = createLimiter({
  keyPrefix: 'rl:otp:verify',
  points: 10,
  duration: 300,
});

/** Payment webhook: 60 per minute per IP */
export const webhookLimiter = createLimiter({
  keyPrefix: 'rl:webhook',
  points: 60,
  duration: 60,
});

/** Admin login: 100 attempts per 15 minutes per IP (generous in development) */
export const adminAuthLimiter = createLimiter({
  keyPrefix: 'rl:admin:auth',
  points: process.env.NODE_ENV === 'production' ? 15 : 100,
  duration: 900,
});

/** Contact/enquiry form: 5 submissions per hour per IP */
export const contactLimiter = createLimiter({
  keyPrefix: 'rl:contact',
  points: 5,
  duration: 3600,
});

/** Booking/meeting scheduling: 3 per hour per user/IP */
export const bookingLimiter = createLimiter({
  keyPrefix: 'rl:booking',
  points: 3,
  duration: 3600,
});

/** Cart operations: 60 per minute */
export const cartLimiter = createLimiter({
  keyPrefix: 'rl:cart',
  points: 60,
  duration: 60,
});

/** Payment order creation: 10 per minute */
export const paymentOrderLimiter = createLimiter({
  keyPrefix: 'rl:payment:order',
  points: 10,
  duration: 60,
});

/** Payment verify: 10 per minute */
export const paymentVerifyLimiter = createLimiter({
  keyPrefix: 'rl:payment:verify',
  points: 10,
  duration: 60,
});

/** Meeting token: 10 per minute */
export const meetingTokenLimiter = createLimiter({
  keyPrefix: 'rl:meeting:token',
  points: 10,
  duration: 60,
});

/** Bulk enquiry: 2 per hour per IP */
export const bulkEnquiryLimiter = createLimiter({
  keyPrefix: 'rl:bulk:enquiry',
  points: 2,
  duration: 3600,
});

/** Review submit: 5 per hour */
export const reviewLimiter = createLimiter({
  keyPrefix: 'rl:review',
  points: 5,
  duration: 3600,
});

/** Data export: 3 per day */
export const dataExportLimiter = createLimiter({
  keyPrefix: 'rl:account:export',
  points: 3,
  duration: 86400,
});

/** Upload limiter: 20 per minute */
export const uploadLimiter = createLimiter({
  keyPrefix: 'rl:upload',
  points: 20,
  duration: 60,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

export type RateLimitResult =
  | { allowed: true; remainingPoints: number }
  | { allowed: false; retryAfterMs: number };

/**
 * Consume one point from a limiter for the given key.
 */
export async function checkRateLimit(
  limiter: RateLimiterAbstract,
  key: string,
): Promise<RateLimitResult> {
  try {
    const res = await limiter.consume(key);
    return { allowed: true, remainingPoints: res.remainingPoints };
  } catch (err: unknown) {
    const e = err as { msBeforeNext?: number };
    if (typeof e?.msBeforeNext === 'number') {
      return {
        allowed: false,
        retryAfterMs: e.msBeforeNext,
      };
    }
    // Fail open on Redis connection/network failures so valid requests are not blocked
    return { allowed: true, remainingPoints: 1 };
  }
}

/**
 * Returns headers to send in a rate-limited response.
 */
export function rateLimitHeaders(retryAfterMs: number): Record<string, string> {
  return {
    'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
    'X-RateLimit-Limit': '0',
    'X-RateLimit-Remaining': '0',
  };
}
