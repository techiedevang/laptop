import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { getClientIp, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { MeetingUpdateSchema } from '@/lib/validations';
import { enqueueAudit } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const meeting = await prisma.videoMeeting.findUnique({
      where: { id },
      include: {
        customer: true,
        assignedStaff: true,
        laptops: {
          include: { laptop: { include: { brand: true, images: true } } },
        },
        participants: true,
      },
    });

    if (!meeting) {
      return errorResponse('Meeting not found', 404);
    }

    return successResponse({ meeting });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/meetings/[id]');
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(req);
    const ip = getClientIp(req);
    const { id } = await params;

    const existing = await prisma.videoMeeting.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Meeting not found', 404);
    }

    const rawBody = await req.json();
    const body = MeetingUpdateSchema.parse(rawBody);

    let newScheduledAt = existing.scheduledAt;
    if (body.date && body.timeSlot) {
      newScheduledAt = new Date(`${body.date}T${body.timeSlot}:00+05:30`);
    }

    const updated = await prisma.videoMeeting.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.staffId ? { assignedStaffId: body.staffId } : {}),
        ...(body.cancelReason ? { cancelReason: body.cancelReason } : {}),
        ...(body.notes ? { internalNotes: body.notes } : {}),
        scheduledAt: newScheduledAt,
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'meeting_updated',
      entityType: 'VideoMeeting',
      entityId: id,
      ipAddress: ip,
      oldValue: { status: existing.status, scheduledAt: existing.scheduledAt },
      newValue: { status: updated.status, scheduledAt: updated.scheduledAt },
    });

    return successResponse({ meeting: updated });
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/meetings/[id]');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(req);
    const ip = getClientIp(req);
    const { id } = await params;

    await prisma.videoMeeting.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'CANCELLED',
      },
    });

    await enqueueAudit({
      adminId: admin.id,
      action: 'meeting_deleted',
      entityType: 'VideoMeeting',
      entityId: id,
      ipAddress: ip,
    });

    return successResponse({ message: 'Meeting cancelled and deleted' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/admin/meetings/[id]');
  }
}
