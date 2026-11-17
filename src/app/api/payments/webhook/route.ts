import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { webhookLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { enqueueAudit, enqueueEmail } from '@/lib/queue';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(webhookLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return errorResponse('Missing signature header', 400);
    }

    const rawBody = await req.text();

    // 1. Verify webhook HMAC signature
    let isValid = false;
    try {
      isValid = verifyWebhookSignature({ body: rawBody, signature });
    } catch (err) {
      logger.error('Webhook verification error', { error: String(err) });
      return errorResponse('Webhook secret not configured', 500);
    }

    if (!isValid) {
      logger.warn('Invalid webhook signature received', { ip });
      return errorResponse('Invalid webhook signature', 400);
    }

    // 2. Parse payload safely
    const payload = JSON.parse(rawBody);
    const eventType = payload.event as string;
    const eventId = (payload.payload?.payment?.entity?.id || payload.payload?.refund?.entity?.id || 'unknown') as string;

    logger.info('Processing Razorpay webhook event', { eventType, eventId });

    // 3. Log event to Audit log asynchronously
    try {
      await enqueueAudit({
        action: `webhook:${eventType}`,
        entityType: 'payment_webhook',
        entityId: eventId,
        ipAddress: ip,
        newValue: { event: eventType, id: eventId },
      });
    } catch {
      // non-blocking
    }

    // 4. Handle events
    switch (eventType) {
      case 'payment.captured': {
        const paymentEntity = payload.payload?.payment?.entity;
        if (paymentEntity) {
          const rzpOrderId = paymentEntity.order_id as string;
          const rzpPaymentId = paymentEntity.id as string;

          const payment = await prisma.payment.findFirst({
            where: {
              OR: [
                { razorpayOrderId: rzpOrderId },
                { razorpayPaymentId: rzpPaymentId },
              ],
            },
            include: { order: { include: { user: true, items: true } } },
          });

          if (payment) {
            // Idempotency check: skip if already marked PAID
            if (payment.status !== 'PAID') {
              await prisma.$transaction([
                prisma.payment.update({
                  where: { id: payment.id },
                  data: {
                    status: 'PAID',
                    razorpayPaymentId: rzpPaymentId,
                    webhookVerified: true,
                  },
                }),
                prisma.order.update({
                  where: { id: payment.orderId },
                  data: {
                    status: 'CONFIRMED',
                    paymentStatus: 'PAID',
                  },
                }),
              ]);
            }
          }
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload.payload?.payment?.entity;
        if (paymentEntity) {
          const rzpOrderId = paymentEntity.order_id as string;
          const rzpPaymentId = paymentEntity.id as string;
          const failureReason = paymentEntity.error_description || 'Payment failed';

          const payment = await prisma.payment.findFirst({
            where: {
              OR: [
                { razorpayOrderId: rzpOrderId },
                { razorpayPaymentId: rzpPaymentId },
              ],
            },
            include: { order: { include: { items: true } } },
          });

          if (payment && payment.status === 'PENDING') {
            await prisma.$transaction(async (tx) => {
              await tx.payment.update({
                where: { id: payment.id },
                data: {
                  status: 'FAILED',
                  failureReason,
                  webhookVerified: true,
                },
              });

              // Release reserved items
              for (const item of payment.order.items) {
                await tx.laptop.update({
                  where: { id: item.laptopId },
                  data: {
                    availableUnits: {
                      increment: item.quantity,
                    },
                  },
                });
              }
            });
          }
        }
        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        const refundEntity = payload.payload?.refund?.entity;
        if (refundEntity) {
          const rzpPaymentId = refundEntity.payment_id as string;
          const refundAmountPaise = refundEntity.amount as number;

          const payment = await prisma.payment.findFirst({
            where: { razorpayPaymentId: rzpPaymentId },
            include: { order: true },
          });

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'REFUNDED' },
            });
            await prisma.order.update({
              where: { id: payment.orderId },
              data: {
                status: 'REFUNDED',
                paymentStatus: 'REFUNDED',
              },
            });
          }
        }
        break;
      }

      default:
        logger.info(`Ignored unhandled webhook event: ${eventType}`);
    }

    return successResponse({ received: true });
  } catch (error) {
    return handleApiError(error, 'POST /api/payments/webhook');
  }
}
