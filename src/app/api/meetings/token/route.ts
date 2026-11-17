import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { meetingTokenLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { getVideoProvider } from '@/lib/livekit';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.LIVEKIT_API_SECRET || process.env.NEXTAUTH_SECRET || 'livekit_secret_key_12345';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(meetingTokenLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const meetingId = url.searchParams.get('meetingId');
    const roomId = url.searchParams.get('roomId');

    if (!token) {
      return errorResponse('Token parameter is required', 400);
    }

    // 1. Verify customer JWT token
    let decoded: {
      meetingId?: string;
      roomId?: string;
      role?: string;
      guestEmail?: string;
    };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as typeof decoded;
    } catch {
      return errorResponse('Invalid or expired meeting access token', 401);
    }

    // 2. Fetch meeting record
    const targetMeetingId = meetingId || decoded.meetingId;
    const targetRoomId = roomId || decoded.roomId;

    const meeting = await prisma.videoMeeting.findFirst({
      where: {
        OR: [
          ...(targetMeetingId ? [{ id: targetMeetingId }] : []),
          ...(targetRoomId ? [{ roomId: targetRoomId }] : []),
        ],
        deletedAt: null,
      },
    });

    if (!meeting) {
      return errorResponse('Meeting not found', 404);
    }

    if (meeting.status === 'CANCELLED') {
      return errorResponse('This meeting has been cancelled', 400);
    }

    // 3. Time Window Check: (scheduledAt - 10 min) to (scheduledAt + duration + 30 min)
    const now = Date.now();
    const scheduledTime = new Date(meeting.scheduledAt).getTime();
    const windowStart = scheduledTime - 10 * 60 * 1000; // 10 min before
    const windowEnd = scheduledTime + (meeting.durationMinutes + 30) * 60 * 1000; // 30 min after

    if (now < windowStart) {
      const minutesToWait = Math.ceil((windowStart - now) / 60000);
      return errorResponse(
        `Meeting room is not open yet. It opens 10 minutes before the scheduled time (in ${minutesToWait} minutes).`,
        403,
      );
    }

    if (now > windowEnd) {
      return errorResponse('This meeting session has concluded.', 403);
    }

    // 4. Generate LiveKit server room token
    const isHost = decoded.role === 'host' || decoded.role === 'admin';
    const participantName = meeting.guestName || 'Customer';
    const participantIdentity = decoded.guestEmail || `user_${meeting.id.slice(0, 8)}`;

    const provider = getVideoProvider();
    const videoToken = await provider.generateToken({
      roomName: meeting.roomId,
      participantName,
      participantIdentity,
      isHost,
    });

    // Mark meeting as LIVE if first participant joins
    if (meeting.status === 'SCHEDULED') {
      await prisma.videoMeeting.update({
        where: { id: meeting.id },
        data: {
          status: 'LIVE',
          actualStartAt: new Date(),
        },
      });
    }

    return successResponse({
      token: videoToken.token,
      wsUrl: videoToken.wsUrl,
      roomId: meeting.roomId,
      title: meeting.title,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/meetings/token');
  }
}
