import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';
import { AuthError } from '@/lib/server-auth';
import { RateLimiterAbstract } from 'rate-limiter-flexible';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';

/**
 * Extract client IP from headers safely
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

/**
 * Standard API JSON success response
 */
export function successResponse<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers },
  );
}

/**
 * Standard API JSON error response (Never leaks stack traces)
 */
export function errorResponse(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(extra || {}),
    },
    { status },
  );
}

/**
 * Handle API rate limit check
 */
export async function enforceRateLimit(limiter: RateLimiterAbstract, key: string) {
  const result = await checkRateLimit(limiter, key);
  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: rateLimitHeaders(result.retryAfterMs),
      },
    );
  }
  return null;
}

/**
 * Standard error handler for API routes
 * Ensures generic messages to client and detailed masked logging on server
 */
export function handleApiError(error: unknown, context: string = 'API') {
  if (error instanceof ZodError) {
    logger.warn(`[${context}] Validation error`, {
      errors: error.flatten().fieldErrors,
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (error instanceof AuthError) {
    logger.warn(`[${context}] Auth error: ${error.message}`);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: error.statusCode },
    );
  }

  // Generic server or database error
  logger.error(`[${context}] Unhandled error`, {
    message: error instanceof Error ? error.message : String(error),
  });

  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    },
    { status: 500 },
  );
}
