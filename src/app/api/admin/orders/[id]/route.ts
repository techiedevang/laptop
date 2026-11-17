import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, requireAdminRole } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { AdminOrderStatusSchema } from '@/lib/validations';
import { enqueueAudit, enqueueEmail } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            laptop: { include: { brand: true, images: true } },
          },
        },
        payments: true,
        refunds: true,
        invoice: true,
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse({ order });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/orders/[id]');
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);
    const ip = getClientIp(req);
    const { id } = await params;

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      return errorResponse('Order not found', 404);
    }

    const rawBody = await req.json();
    const body = AdminOrderStatusSchema.parse(rawBody);

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        cancelReason: body.reason || existing.cancelReason,
        trackingNumber: body.trackingNumber || existing.trackingNumber,
        trackingUrl: body.trackingUrl || existing.trackingUrl,
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'order_status_update',
      entityType: 'Order',
      entityId: id,
      ipAddress: ip,
      oldValue: { status: existing.status },
      newValue: { status: body.status, reason: body.reason },
    });

    // Notify user of shipment if status is SHIPPED
    if (body.status === 'SHIPPED') {
      const email = existing.user?.email || existing.guestEmail;
      if (email) {
        try {
          await enqueueEmail({
            type: 'order_shipped',
            to: email,
            templateData: {
              orderNumber: existing.orderNumber,
              trackingNumber: body.trackingNumber || '',
              trackingUrl: body.trackingUrl || '',
            },
          });
        } catch {}
      }
    }

    return successResponse({ order: updated });
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/orders/[id]');
  }
}
