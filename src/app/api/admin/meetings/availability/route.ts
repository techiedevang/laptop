import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const slots = await prisma.availabilitySlot.findMany({
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return successResponse({ slots });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/meetings/availability');
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    if (body.dayOfWeek === undefined || !body.startTime || !body.endTime) {
      return errorResponse('dayOfWeek, startTime, and endTime are required', 400);
    }

    const slot = await prisma.availabilitySlot.create({
      data: {
        dayOfWeek: parseInt(body.dayOfWeek, 10),
        startTime: body.startTime,
        endTime: body.endTime,
        duration: body.duration || 30,
        maxBookings: body.maxBookings || 2,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return successResponse({ slot }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/meetings/availability');
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    if (!body.id) return errorResponse('Slot ID required', 400);

    const updated = await prisma.availabilitySlot.update({
      where: { id: body.id },
      data: {
        ...(body.startTime ? { startTime: body.startTime } : {}),
        ...(body.endTime ? { endTime: body.endTime } : {}),
        ...(body.maxBookings ? { maxBookings: body.maxBookings } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    return successResponse({ slot: updated });
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/meetings/availability');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return errorResponse('Slot ID required', 400);

    await prisma.availabilitySlot.delete({ where: { id } });
    return successResponse({ message: 'Slot deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/admin/meetings/availability');
  }
}
