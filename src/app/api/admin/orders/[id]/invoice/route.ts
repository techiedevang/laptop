import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { enqueueAudit } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(req);
    const ip = getClientIp(req);
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        items: { include: { laptop: true } },
        invoice: true,
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    if (order.invoice) {
      return successResponse({
        invoice: order.invoice,
        message: 'Existing invoice retrieved',
      });
    }

    const currentYear = new Date().getFullYear();
    const invoiceNumber = `INV-${currentYear}-${order.orderNumber.replace(/[^A-Za-z0-9]/g, '')}`;
    const sellerGstin = process.env.SELLER_GSTIN || '27AABCU9603R1ZM';

    const invoice = await prisma.invoice.create({
      data: {
        orderId: order.id,
        invoiceNumber,
        gstinSeller: sellerGstin,
        gstinBuyer: order.gstin,
        pdfUrl: `/api/invoices/${invoiceNumber}.pdf`,
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'invoice_generated',
      entityType: 'Invoice',
      entityId: invoice.id,
      ipAddress: ip,
      newValue: { invoiceNumber, orderId: order.id },
    });

    return successResponse({
      invoice,
      message: 'GST invoice generated successfully',
    }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/orders/[id]/invoice');
  }
}
