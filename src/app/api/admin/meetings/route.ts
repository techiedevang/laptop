import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');
    const staffId = url.searchParams.get('staffId');
    const search = url.searchParams.get('search');

    const where: Prisma.VideoMeetingWhereInput = {
      deletedAt: null,
    };

    if (status) where.status = status as any;
    if (staffId) where.assignedStaffId = staffId;
    if (date) {
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);
      where.scheduledAt = { gte: dayStart, lte: dayEnd };
    }
    if (search) {
      where.OR = [
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
        { title: { contains: search } },
      ];
    }

    const [total, meetings] = await Promise.all([
      prisma.videoMeeting.count({ where }),
      prisma.videoMeeting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true } },
          assignedStaff: { select: { id: true, name: true, email: true } },
          laptops: {
            include: {
              laptop: { select: { id: true, model: true, brand: true, sellingPrice: true } },
            },
          },
        },
      }),
    ]);

    return successResponse({
      meetings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/meetings');
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    if (!body.title || !body.scheduledAt) {
      return errorResponse('Title and scheduledAt are required', 400);
    }

    const roomId = crypto.randomBytes(32).toString('hex');

    const meeting = await prisma.videoMeeting.create({
      data: {
        roomId,
        title: body.title,
        customerId: body.customerId,
        assignedStaffId: body.assignedStaffId || admin.id,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        scheduledAt: new Date(body.scheduledAt),
        durationMinutes: body.durationMinutes || 30,
        notes: body.notes,
        status: 'SCHEDULED',
      },
    });

    return successResponse({ meeting }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/meetings');
  }
}
