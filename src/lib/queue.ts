/**
 * BullMQ queues for NextGen IT Hub background jobs.
 * Uses Redis (ioredis) as the backing store.
 */

import { Queue, Worker, QueueOptions, Job } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from './logger';

// ─── Redis Connection ─────────────────────────────────────────────────────────

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export function createRedisConnection() {
  return new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });
}

const defaultQueueOptions: Partial<QueueOptions> = {
  connection: { url: REDIS_URL } as unknown as IORedis,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  },
};

// ─── Queue Names ──────────────────────────────────────────────────────────────

export const QUEUE_NAMES = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  SMS: 'sms',
  NOTIFICATION: 'notification',
  ORDER: 'order',
  MEETING: 'meeting',
  INVOICE: 'invoice',
  STOCK: 'stock',
  AUDIT: 'audit',
} as const;

// ─── Job Payloads ─────────────────────────────────────────────────────────────

export interface EmailJobData {
  type:
    | 'otp'
    | 'order_confirmation'
    | 'order_shipped'
    | 'order_delivered'
    | 'meeting_confirmation'
    | 'meeting_reminder'
    | 'password_reset'
    | 'account_verification'
    | 'bulk_quote'
    | 'generic';
  to: string;
  subject?: string;
  html?: string;
  templateData: Record<string, unknown>;
}

export interface WhatsAppJobData {
  type: 'meeting_reminder' | 'order_confirmation' | 'shipping_update' | 'otp';
  phone: string;
  templateName: string;
  templateData: Record<string, unknown>;
}

export interface OrderJobData {
  type: 'confirm' | 'cancel' | 'refund' | 'invoice_generate';
  orderId: string;
  data?: Record<string, unknown>;
}

export interface MeetingJobData {
  type: 'reminder_24h' | 'reminder_1h' | 'reminder_15min' | 'cleanup' | 'no_show';
  meetingId: string;
  data?: Record<string, unknown>;
}

export interface InvoiceJobData {
  orderId: string;
  invoiceNumber: string;
}

export interface StockJobData {
  type: 'update_counts' | 'low_stock_alert';
  laptopId: string;
}

export interface AuditJobData {
  adminId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

// ─── Queues (Lazy Singleton Initialization) ──────────────────────────────────

const queueCache = new Map<string, Queue<any>>();

function getOrCreateQueue<T>(name: string): Queue<T> {
  if (!queueCache.has(name)) {
    const queue = new Queue<T>(name, {
      ...defaultQueueOptions,
      connection: new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
        retryStrategy: () => null, // don't spam if Redis is offline during build
      }),
    } as QueueOptions);

    // Suppress unhandled error log when Redis is unavailable in local dev/build
    queue.on('error', (err) => {
      logger.debug(`Queue [${name}] Redis not connected:`, { error: err.message });
    });

    queueCache.set(name, queue);
  }
  return queueCache.get(name) as Queue<T>;
}

export const emailQueue = {
  add: (type: string, data: EmailJobData, opts?: any) => getOrCreateQueue<EmailJobData>(QUEUE_NAMES.EMAIL).add(type, data, opts)
} as unknown as Queue<EmailJobData>;

export const whatsappQueue = {
  add: (type: string, data: WhatsAppJobData, opts?: any) => getOrCreateQueue<WhatsAppJobData>(QUEUE_NAMES.WHATSAPP).add(type, data, opts)
} as unknown as Queue<WhatsAppJobData>;

export const orderQueue = {
  add: (type: string, data: OrderJobData, opts?: any) => getOrCreateQueue<OrderJobData>(QUEUE_NAMES.ORDER).add(type, data, opts)
} as unknown as Queue<OrderJobData>;

export const meetingQueue = {
  add: (type: string, data: MeetingJobData, opts?: any) => getOrCreateQueue<MeetingJobData>(QUEUE_NAMES.MEETING).add(type, data, opts)
} as unknown as Queue<MeetingJobData>;

export const invoiceQueue = {
  add: (type: string, data: InvoiceJobData, opts?: any) => getOrCreateQueue<InvoiceJobData>(QUEUE_NAMES.INVOICE).add(type, data, opts)
} as unknown as Queue<InvoiceJobData>;

export const stockQueue = {
  add: (type: string, data: StockJobData, opts?: any) => getOrCreateQueue<StockJobData>(QUEUE_NAMES.STOCK).add(type, data, opts)
} as unknown as Queue<StockJobData>;

export const auditQueue = {
  add: (type: string, data: AuditJobData, opts?: any) => getOrCreateQueue<AuditJobData>(QUEUE_NAMES.AUDIT).add(type, data, opts)
} as unknown as Queue<AuditJobData>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Add an email job to the queue.
 */
export async function enqueueEmail(data: EmailJobData, delayMs?: number) {
  const job = await emailQueue.add(data.type, data, {
    delay: delayMs,
    priority: data.type === 'otp' ? 1 : 5, // OTPs are highest priority
  });
  logger.info('Enqueued email job', { jobId: job.id, type: data.type });
  return job;
}

/**
 * Add a WhatsApp job.
 */
export async function enqueueWhatsApp(data: WhatsAppJobData, delayMs?: number) {
  const job = await whatsappQueue.add(data.type, data, { delay: delayMs });
  logger.info('Enqueued WhatsApp job', { jobId: job.id, type: data.type });
  return job;
}

/**
 * Schedule meeting reminders.
 * scheduledAt is the meeting start time (UTC).
 */
export async function scheduleMeetingReminders(meetingId: string, scheduledAt: Date) {
  const now = Date.now();
  const meetingMs = scheduledAt.getTime();

  const reminders: Array<{ type: MeetingJobData['type']; offsetMs: number }> = [
    { type: 'reminder_24h', offsetMs: 24 * 60 * 60 * 1000 },
    { type: 'reminder_1h', offsetMs: 60 * 60 * 1000 },
    { type: 'reminder_15min', offsetMs: 15 * 60 * 1000 },
  ];

  for (const reminder of reminders) {
    const fireAt = meetingMs - reminder.offsetMs;
    const delay = fireAt - now;
    if (delay > 0) {
      await meetingQueue.add(
        reminder.type,
        { type: reminder.type, meetingId },
        { delay, jobId: `meeting:${meetingId}:${reminder.type}` },
      );
      logger.info('Scheduled meeting reminder', { meetingId, type: reminder.type, delay });
    }
  }
}

/**
 * Enqueue an audit log entry.
 */
export async function enqueueAudit(data: AuditJobData) {
  try {
    return await auditQueue.add('audit', data, { priority: 10 });
  } catch (err) {
    logger.debug('Audit queue unavailable (Redis offline)', { error: (err as any)?.message });
    return null;
  }
}

/**
 * Create a typed Worker for a queue.
 */
export function createWorker<T>(
  queueName: string,
  processor: (job: Job<T>) => Promise<void>,
): Worker<T> {
  const worker = new Worker<T>(queueName, processor, {
    connection: createRedisConnection(),
    concurrency: 5,
  });

  worker.on('completed', (job) => {
    logger.info('Job completed', { queue: queueName, jobId: job.id });
  });

  worker.on('failed', (job, err) => {
    logger.error('Job failed', {
      queue: queueName,
      jobId: job?.id,
      error: err.message,
      attempts: job?.attemptsMade,
    });
  });

  return worker;
}
