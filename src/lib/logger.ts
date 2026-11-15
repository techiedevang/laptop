/**
 * Logger with PII masking for NextGen IT Hub
 * Masks: email, phone, name, address fields before logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

// Fields to mask in log output
const PII_FIELDS = new Set([
  'email', 'phone', 'name', 'fullName', 'firstName', 'lastName',
  'address', 'line1', 'line2', 'password', 'passwordHash', 'token',
  'otp', 'secret', 'cardNumber', 'cvv', 'aadhaar', 'pan',
]);

function maskValue(value: unknown): unknown {
  if (typeof value === 'string') {
    if (value.length <= 4) return '***';
    return value.slice(0, 2) + '***' + value.slice(-2);
  }
  return '***';
}

function maskPII(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskPII);

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (PII_FIELDS.has(key.toLowerCase())) {
      masked[key] = maskValue(value);
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskPII(value);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context: context ? (maskPII(context) as Record<string, unknown>) : undefined,
    timestamp: new Date().toISOString(),
  };

  const formatted = formatLog(entry);

  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'debug':
      if (process.env.NODE_ENV !== 'production') console.debug(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};
