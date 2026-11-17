import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, requireAdminRole } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { LaptopSchema } from '@/lib/validations';
import { enqueueAudit } from '@/lib/queue';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const brand = url.searchParams.get('brand');
    const grade = url.searchParams.get('grade');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const where: Prisma.LaptopWhereInput = {
      deletedAt: null,
    };

    if (brand) where.brand = { name: { contains: brand } };
    if (grade) where.grade = grade as any;
    if (status) where.status = status as any;
    if (search) {
      where.OR = [
        { model: { contains: search } },
        { processor: { contains: search } },
      ];
    }

    const [total, laptops] = await Promise.all([
      prisma.laptop.count({ where }),
      prisma.laptop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { units: true, reviews: true } },
        },
      }),
    ]);

    return successResponse({
      laptops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/inventory');
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);
    const ip = getClientIp(req);

    const rawBody = await req.json();
    const body = LaptopSchema.parse(rawBody);

    // Auto slug if not provided
    const slug =
      body.slug ||
      `${body.brand}-${body.model}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + `-${Date.now().toString(36)}`;

    // Find or create Brand
    const brand = await prisma.brand.upsert({
      where: { name: body.brand },
      update: {},
      create: {
        name: body.brand,
        slug: body.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    });

    const laptop = await prisma.laptop.create({
      data: {
        brandId: brand.id,
        model: body.model,
        slug,
        processor: body.processor,
        ram: `${body.ram}GB`,
        storage: `${body.storage}GB ${body.storageType}`,
        display: body.display,
        gpu: body.gpu,
        os: body.os,
        battery: body.battery,
        grade: body.grade,
        priceTiers: undefined,
        sellingPrice: body.priceInPaise,
        mrp: body.mrpInPaise || Math.round(body.priceInPaise * 1.3),
        costPrice: Math.round(body.priceInPaise * 0.75),
        totalUnits: body.stock,
        availableUnits: body.stock,
        description: body.description,
        status: body.status,
      },
      include: {
        brand: true,
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'inventory_create_laptop',
      entityType: 'Laptop',
      entityId: laptop.id,
      ipAddress: ip,
      newValue: { id: laptop.id, model: laptop.model, price: laptop.sellingPrice },
    });

    return successResponse({ laptop }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/inventory');
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN', 'MANAGER']);
    const ip = getClientIp(req);

    const rawBody = await req.json();
    const { id, ...data } = rawBody;
    if (!id) return errorResponse('Laptop ID required', 400);

    const existing = await prisma.laptop.findUnique({ where: { id } });
    if (!existing) return errorResponse('Laptop not found', 404);

    const updated = await prisma.laptop.update({
      where: { id },
      data: {
        ...(data.model ? { model: data.model } : {}),
        ...(data.priceInPaise ? { sellingPrice: data.priceInPaise } : {}),
        ...(data.stock !== undefined ? { availableUnits: data.stock, totalUnits: data.stock } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.grade ? { grade: data.grade } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'inventory_update_laptop',
      entityType: 'Laptop',
      entityId: id,
      ipAddress: ip,
      oldValue: { sellingPrice: existing.sellingPrice, status: existing.status },
      newValue: { sellingPrice: updated.sellingPrice, status: updated.status },
    });

    return successResponse({ laptop: updated });
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/inventory');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdminRole(req, ['SUPER_ADMIN', 'ADMIN']);
    const ip = getClientIp(req);

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return errorResponse('Laptop ID required', 400);

    const existing = await prisma.laptop.findUnique({ where: { id } });
    if (!existing) return errorResponse('Laptop not found', 404);

    await prisma.laptop.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'HIDDEN' },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'inventory_delete_laptop',
      entityType: 'Laptop',
      entityId: id,
      ipAddress: ip,
    });

    return successResponse({ message: 'Laptop soft deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/admin/inventory');
  }
}
