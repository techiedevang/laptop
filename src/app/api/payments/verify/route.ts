import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { paymentVerifyLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { VerifyPaymentSchema } from '@/lib/validations';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { enqueueEmail, enqueueWhatsApp } from '@/lib/queue';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(paymentVerifyLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = VerifyPaymentSchema.parse(rawBody);

    // 1. Fetch Order and Payment
    const order = await prisma.order.findUnique({
      where: { id: body.orderId },
      include: {
        items: { include: { laptop: true } },
        payments: true,
        user: true,
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    const payment = order.payments.find((p) => p.razorpayOrderId === body.razorpay_order_id) || order.payments[0];

    // Idempotency: If already verified and marked PAID, return success immediately
    if (payment && payment.status === 'PAID' && order.status === 'CONFIRMED') {
      return successResponse({
        verified: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      });
    }

    // 2. Verify Razorpay HMAC-SHA256 signature
    const isValid = verifyPaymentSignature({
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    if (!isValid) {
      logger.warn('Payment signature verification failed', {
        orderId: order.id,
        razorpayOrderId: body.razorpay_order_id,
      });

      // Release reserved units and mark payment failed
      await prisma.$transaction(async (tx) => {
        if (payment) {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: 'FAILED',
              failureReason: 'Invalid signature',
              razorpayPaymentId: body.razorpay_payment_id,
            },
          });
        }

        // Release stock
        for (const item of order.items) {
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

      return errorResponse('Payment signature verification failed', 400);
    }

    // 3. Mark payment as PAID and order as CONFIRMED in transaction
    await prisma.$transaction(async (tx) => {
      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            razorpayPaymentId: body.razorpay_payment_id,
            razorpaySignature: body.razorpay_signature,
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      // Clear user cart if any
      if (order.userId) {
        const cart = await tx.cart.findFirst({ where: { userId: order.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }
    });

    // 4. Send Confirmation Notifications via BullMQ queue
    const recipientEmail = order.user?.email || order.guestEmail;
    const recipientPhone = order.user?.phone || order.guestPhone;

    if (recipientEmail) {
      try {
        await enqueueEmail({
          type: 'order_confirmation',
          to: recipientEmail,
          templateData: {
            orderNumber: order.orderNumber,
            totalPaise: order.total,
            items: order.items.map((i) => ({
              model: i.laptop.model,
              quantity: i.quantity,
              price: i.unitPrice,
            })),
          },
        });
      } catch (err) {
        logger.error('Failed to enqueue order confirmation email', { error: String(err) });
      }
    }

    if (recipientPhone) {
      try {
        await enqueueWhatsApp({
          type: 'order_confirmation',
          phone: recipientPhone,
          templateName: 'order_confirmed',
          templateData: {
            orderNumber: order.orderNumber,
            total: `₹${(order.total / 100).toLocaleString('en-IN')}`,
          },
        });
      } catch (err) {
        logger.error('Failed to enqueue order confirmation WhatsApp', { error: String(err) });
      }
    }

    return successResponse({
      verified: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: 'CONFIRMED',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/payments/verify');
  }
}
