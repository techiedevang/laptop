import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { RefundSchema } from '@/lib/validations';
import { createRefund } from '@/lib/razorpay';
import { enqueueAudit } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN']);
    const ip = getClientIp(req);
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payments: { where: { status: 'PAID' } },
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    const paidPayment = order.payments.find((p) => p.razorpayPaymentId);
    if (!paidPayment || !paidPayment.razorpayPaymentId) {
      return errorResponse('No captured Razorpay payment found for this order', 400);
    }

    const rawBody = await req.json();
    const body = RefundSchema.parse(rawBody);

    if (body.amount > order.total) {
      return errorResponse(`Refund amount cannot exceed order total of ₹${order.total / 100}`, 400);
    }

    // Call Razorpay Refund API
    let rzpRefundId: string | undefined;
    try {
      const rzpRefund = await createRefund({
        paymentId: paidPayment.razorpayPaymentId,
        amountPaise: body.amount,
        notes: {
          orderNumber: order.orderNumber,
          reason: body.reason,
        },
      });
      rzpRefundId = (rzpRefund as { id: string }).id;
    } catch (err) {
      // In dev mode allow simulation if keys are mocked
      if (process.env.NODE_ENV !== 'production') {
        rzpRefundId = `rfnd_mock_${Date.now()}`;
      } else {
        throw err;
      }
    }

    // Record refund in DB and update status
    const isFullRefund = body.amount >= order.total;
    const [refundRecord] = await prisma.$transaction([
      prisma.refund.create({
        data: {
          orderId: order.id,
          razorpayRefundId: rzpRefundId,
          amount: body.amount,
          reason: body.reason,
          status: 'PROCESSED',
          initiatedBy: admin.id,
          auditNote: body.notes,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: isFullRefund ? 'REFUNDED' : order.status,
          paymentStatus: isFullRefund ? 'REFUNDED' : 'PARTIAL_REFUND',
        },
      }),
      prisma.payment.update({
        where: { id: paidPayment.id },
        data: {
          status: isFullRefund ? 'REFUNDED' : 'PARTIAL_REFUND',
        },
      }),
    ]);

    await enqueueAudit({
      adminId: admin.id,
      action: 'order_refund_issued',
      entityType: 'Refund',
      entityId: refundRecord.id,
      ipAddress: ip,
      newValue: {
        orderId: order.id,
        amount: body.amount,
        razorpayRefundId: rzpRefundId,
        reason: body.reason,
      },
    });

    return successResponse({
      refund: refundRecord,
      message: 'Refund initiated successfully',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/orders/[id]/refund');
  }
}
