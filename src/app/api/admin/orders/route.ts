import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, requireAdminRole } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';
import { enqueueAudit } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const status = url.searchParams.get('status');
    const paymentStatus = url.searchParams.get('paymentStatus');
    const search = url.searchParams.get('search');

    const where: Prisma.OrderWhereInput = {};

    if (status) where.status = status as any;
    if (paymentStatus) where.paymentStatus = paymentStatus as any;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          address: true,
          items: {
            include: {
              laptop: { select: { id: true, model: true, brand: true } },
            },
          },
          payments: { select: { id: true, status: true, amount: true, method: true, razorpayPaymentId: true } },
          invoice: { select: { id: true, invoiceNumber: true, pdfUrl: true } },
        },
      }),
    ]);

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/orders');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);
    const ip = getClientIp(req);
    const rawBody = await req.json();
    const { orderIds, status } = rawBody;

    if (!Array.isArray(orderIds) || orderIds.length === 0 || !status) {
      return errorResponse('orderIds array and status are required', 400);
    }

    const result = await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'orders_bulk_status_update',
      entityType: 'Order',
      entityId: orderIds.join(','),
      ipAddress: ip,
      newValue: { count: result.count, status },
    });

    return successResponse({ updatedCount: result.count, status });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/admin/orders');
  }
}
