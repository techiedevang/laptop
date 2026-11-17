import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { requireAuth } from '@/lib/server-auth';
import { AccountDeleteSchema } from '@/lib/validations';
import argon2 from 'argon2';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const rawBody = await req.json();
    const body = AccountDeleteSchema.parse(rawBody);

    // Verify password confirmation
    if (user.passwordHash) {
      let isMatch = false;
      try {
        isMatch = await argon2.verify(user.passwordHash, body.password);
      } catch {
        isMatch = false;
      }

      if (!isMatch) {
        return errorResponse('Password confirmation incorrect', 401);
      }
    }

    const anonymizedSuffix = crypto.randomBytes(6).toString('hex');

    await prisma.$transaction(async (tx) => {
      // 1. Record DPDP erasure request
      await tx.dataRequest.create({
        data: {
          userId: user.id,
          type: 'DELETION',
          status: 'COMPLETED',
          details: body.reason || 'User self-requested right to erasure under DPDP Act 2023',
          resolvedAt: new Date(),
        },
      });

      // 2. Anonymize user profile (soft delete)
      await tx.user.update({
        where: { id: user.id },
        data: {
          name: `Anonymized User (${anonymizedSuffix})`,
          email: null,
          phone: null,
          phoneHash: null,
          passwordHash: null,
          isActive: false,
          deletedAt: new Date(),
        },
      });

      // 3. Soft-delete addresses
      await tx.userAddress.updateMany({
        where: { userId: user.id },
        data: {
          deletedAt: new Date(),
          name: 'Anonymized',
          phone: 'REDACTED',
          line1: 'REDACTED',
          line2: null,
        },
      });

      // 4. Invalidate all active sessions
      await tx.session.deleteMany({
        where: { userId: user.id },
      });
      await tx.refreshToken.deleteMany({
        where: { userId: user.id },
      });
    });

    const response = successResponse({
      message: 'Account successfully closed and personal data erased in accordance with DPDP Act, 2023. Statutory tax invoice records are retained as mandated by Indian law.',
    });

    // Clear cookies
    response.cookies.set('user_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('next-auth.session-token', '', { maxAge: 0, path: '/' });

    return response;
  } catch (error) {
    return handleApiError(error, 'POST /api/account/delete');
  }
}
