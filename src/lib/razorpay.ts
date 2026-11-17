/**
 * Razorpay integration for NextGen IT Hub.
 * Handles order creation, payment capture, refunds, and webhook verification.
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from './logger';

// ─── Client ──────────────────────────────────────────────────────────────────

function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CreateOrderInput {
  amountPaise: number; // Amount in paise
  receipt: string; // Order reference (NGH-2024-001234)
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RefundInput {
  paymentId: string;
  amountPaise: number;
  notes?: Record<string, string>;
  speed?: 'normal' | 'optimum';
}

export interface WebhookVerificationInput {
  body: string; // raw request body string
  signature: string; // X-Razorpay-Signature header
}

// ─── Order ───────────────────────────────────────────────────────────────────

/**
 * Create a Razorpay order.
 * Returns the full Razorpay order object including the order ID.
 */
export async function createRazorpayOrder(input: CreateOrderInput): Promise<RazorpayOrder> {
  const razorpay = getRazorpayClient();

  logger.info('Creating Razorpay order', {
    receipt: input.receipt,
    amountPaise: input.amountPaise,
  });

  const order = await razorpay.orders.create({
    amount: input.amountPaise,
    currency: 'INR',
    receipt: input.receipt,
    notes: input.notes || {},
  });

  logger.info('Razorpay order created', { orderId: order.id, receipt: input.receipt });

  return order as unknown as RazorpayOrder;
}

// ─── Payment verification ─────────────────────────────────────────────────────

/**
 * Verify that a payment was successfully made using Razorpay signature.
 * This MUST be called before fulfilling any order.
 */
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error('RAZORPAY_KEY_SECRET is required');

  const payload = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(params.razorpaySignature),
  );

  logger.info('Payment signature verification', {
    orderId: params.razorpayOrderId,
    paymentId: params.razorpayPaymentId,
    valid: isValid,
  });

  return isValid;
}

// ─── Webhook ─────────────────────────────────────────────────────────────────

/**
 * Verify a Razorpay webhook signature.
 */
export function verifyWebhookSignature(input: WebhookVerificationInput): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('RAZORPAY_WEBHOOK_SECRET is required');

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(input.body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(input.signature),
  );
}

// ─── Refund ──────────────────────────────────────────────────────────────────

/**
 * Initiate a refund on a Razorpay payment.
 */
export async function createRefund(input: RefundInput) {
  const razorpay = getRazorpayClient();

  logger.info('Initiating Razorpay refund', {
    paymentId: input.paymentId,
    amountPaise: input.amountPaise,
  });

  const refund = await razorpay.payments.refund(input.paymentId, {
    amount: input.amountPaise,
    speed: input.speed || 'normal',
    notes: input.notes || {},
  });

  logger.info('Razorpay refund created', {
    refundId: (refund as { id: string }).id,
    paymentId: input.paymentId,
  });

  return refund;
}

// ─── Fetch payment ───────────────────────────────────────────────────────────

/**
 * Fetch a payment by ID (for reconciliation).
 */
export async function fetchPayment(paymentId: string) {
  const razorpay = getRazorpayClient();
  return razorpay.payments.fetch(paymentId);
}

// ─── Utils ───────────────────────────────────────────────────────────────────

/**
 * Generate a Razorpay checkout options object for the frontend.
 */
export function getRazorpayCheckoutOptions(params: {
  razorpayOrderId: string;
  amountPaise: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Record<string, unknown> {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: params.amountPaise,
    currency: 'INR',
    name: 'NextGen IT Hub',
    description: `Order ${params.orderNumber}`,
    image: '/logo.png',
    order_id: params.razorpayOrderId,
    prefill: {
      name: params.customerName,
      email: params.customerEmail,
      contact: params.customerPhone,
    },
    notes: {
      order_number: params.orderNumber,
    },
    theme: {
      color: '#2563EB', // brand blue
    },
  };
}
