import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, requireAdminRole } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { enqueueAudit } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const laptop = await prisma.laptop.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        specs: { orderBy: { sortOrder: 'asc' } },
        units: { orderBy: { createdAt: 'desc' } },
        priceTiers: true,
        stockHistory: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!laptop) {
      return errorResponse('Laptop not found', 404);
    }

    return successResponse({ laptop });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/inventory/[id]');
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

    const existing = await prisma.laptop.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Laptop not found', 404);
    }

    const body = await req.json();

    const updated = await prisma.laptop.update({
      where: { id },
      data: {
        ...(body.model ? { model: body.model } : {}),
        ...(body.processor !== undefined ? { processor: body.processor } : {}),
        ...(body.ram !== undefined ? { ram: body.ram } : {}),
        ...(body.storage !== undefined ? { storage: body.storage } : {}),
        ...(body.sellingPrice !== undefined ? { sellingPrice: body.sellingPrice } : {}),
        ...(body.mrp !== undefined ? { mrp: body.mrp } : {}),
        ...(body.costPrice !== undefined ? { costPrice: body.costPrice } : {}),
        ...(body.grade ? { grade: body.grade } : {}),
        ...(body.status ? { status: body.status } : {}),
        ...(body.availableUnits !== undefined ? { availableUnits: body.availableUnits } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.warranty !== undefined ? { warranty: body.warranty } : {}),
      },
      include: {
        brand: true,
        images: true,
        specs: true,
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'inventory_update_laptop_details',
      entityType: 'Laptop',
      entityId: id,
      ipAddress: ip,
      oldValue: { sellingPrice: existing.sellingPrice, status: existing.status },
      newValue: { sellingPrice: updated.sellingPrice, status: updated.status },
    });

    return successResponse({ laptop: updated });
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/inventory/[id]');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN']);
    const ip = getClientIp(req);
    const { id } = await params;

    const existing = await prisma.laptop.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Laptop not found', 404);
    }

    await prisma.laptop.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'HIDDEN',
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'inventory_soft_delete_laptop',
      entityType: 'Laptop',
      entityId: id,
      ipAddress: ip,
    });

    return successResponse({ message: 'Laptop successfully deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/admin/inventory/[id]');
  }
}
