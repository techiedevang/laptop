import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { reviewLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { ReviewSchema } from '@/lib/validations';
import { verifyCaptcha } from '@/lib/captcha';
import { getUserSession } from '@/lib/server-auth';
import { encrypt } from '@/lib/encryption';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(reviewLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = ReviewSchema.parse(rawBody);

    const isCaptchaValid = await verifyCaptcha(body.captchaToken, ip);
    if (!isCaptchaValid) {
      return errorResponse('CAPTCHA verification failed', 400);
    }

    const laptop = await prisma.laptop.findUnique({
      where: { id: body.laptopId },
    });

    if (!laptop || laptop.deletedAt) {
      return errorResponse('Product not found', 404);
    }

    const user = await getUserSession(req);
    const reviewerEmail = user?.email || body.guestEmail;

    if (!reviewerEmail) {
      return errorResponse('Email address is required for submitting a review', 400);
    }

    // Check duplicate review
    const existing = await prisma.review.findFirst({
      where: {
        laptopId: body.laptopId,
        deletedAt: null,
        OR: [
          ...(user ? [{ userId: user.id }] : []),
        ],
      },
    });

    if (existing) {
      return errorResponse('You have already submitted a review for this product', 400);
    }

    const reviewerName = user?.name || rawBody.guestName || 'Verified Buyer';

    const review = await prisma.review.create({
      data: {
        laptopId: body.laptopId,
        userId: user?.id,
        name: reviewerName,
        email: encrypt(reviewerEmail),
        rating: body.rating,
        title: body.title,
        body: body.body,
        status: 'PENDING',
        isVerified: !!user,
      },
    });

    return successResponse({
      message: 'Review submitted successfully! It will appear once approved by our team.',
      reviewId: review.id,
    }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/reviews');
  }
}
