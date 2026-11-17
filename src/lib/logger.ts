/**
 * Structured PII-safe logger for NextGen IT Hub.
 * Masks emails, phones, card numbers, and other sensitive patterns.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  environment: string;
  [key: string]: unknown;
}

// Patterns for PII masking
const PII_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Email
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: '***@***.***',
  },
  // Indian mobile (10 digits, optionally prefixed with +91 or 0)
  {
    pattern: /(?:\+91|0)?[6-9]\d{9}/g,
    replacement: '**PHONE**',
  },
  // Credit/debit card numbers
  {
    pattern: /\b(?:\d[ -]?){13,16}\b/g,
    replacement: '**CARD**',
  },
  // Aadhaar
  {
    pattern: /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g,
    replacement: '**AADHAAR**',
  },
  // GSTIN
  {
    pattern: /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/g,
    replacement: '**GSTIN**',
  },
  // PAN
  {
    pattern: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    replacement: '**PAN**',
  },
];

function maskPII(value: string): string {
  let masked = value;
  for (const { pattern, replacement } of PII_PATTERNS) {
    masked = masked.replace(pattern, replacement);
  }
  return masked;
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[max depth]';
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return maskPII(value);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map((v) => sanitizeValue(v, depth + 1));
  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Always redact these keys regardless of value
      const redactedKeys = [
        'password',
        'passwordHash',
        'twoFactorSecret',
        'token',
        'secret',
        'apiKey',
        'razorpaySignature',
        'customerToken',
        'hostToken',
        'refreshToken',
        'accessToken',
        'cookie',
        'authorization',
      ];
      if (redactedKeys.some((r) => k.toLowerCase().includes(r.toLowerCase()))) {
        sanitized[k] = '[REDACTED]';
      } else {
        sanitized[k] = sanitizeValue(v, depth + 1);
      }
    }
    return sanitized;
  }
  return value;
}

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  const sanitizedMeta = meta ? (sanitizeValue(meta) as Record<string, unknown>) : {};
  return {
    level,
    message: maskPII(message),
    timestamp: new Date().toISOString(),
    service: 'nextgen-it-hub',
    environment: process.env.NODE_ENV || 'development',
    ...sanitizedMeta,
  };
}

function output(entry: LogEntry): void {
  const json = JSON.stringify(entry);
  if (entry.level === 'error' || entry.level === 'warn') {
    console.error(json);
  } else if (process.env.NODE_ENV !== 'production' || process.env.LOG_LEVEL === 'debug') {
    console.log(json);
  } else if (entry.level === 'info') {
    console.log(json);
  }
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'production' && process.env.LOG_LEVEL !== 'debug') return;
    output(formatEntry('debug', message, meta));
  },

  info(message: string, meta?: Record<string, unknown>): void {
    output(formatEntry('info', message, meta));
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    output(formatEntry('warn', message, meta));
  },

  error(message: string, meta?: Record<string, unknown>): void {
    output(formatEntry('error', message, meta));
  },

  /** Log an HTTP request */
  http(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    meta?: Record<string, unknown>,
  ): void {
    output(
      formatEntry('info', `${method} ${path} ${statusCode} ${durationMs}ms`, {
        method,
        path,
        statusCode,
        durationMs,
        ...meta,
      }),
    );
  },
};

export default logger;
