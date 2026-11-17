import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { dataExportLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse } from '@/lib/api-utils';
import { requireAuth } from '@/lib/server-auth';
import { decrypt } from '@/lib/encryption';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const rateLimitError = await enforceRateLimit(dataExportLimiter, `export:${user.id}`);
    if (rateLimitError) return rateLimitError;

    // Fetch user profile and related personal records
    const [addresses, orders, reviews, meetings, consents] = await Promise.all([
      prisma.userAddress.findMany({
        where: { userId: user.id, deletedAt: null },
        select: {
          id: true,
          name: true,
          line1: true,
          line2: true,
          city: true,
          state: true,
          pincode: true,
          country: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          subtotal: true,
          cgst: true,
          sgst: true,
          igst: true,
          total: true,
          paymentStatus: true,
          paymentMethod: true,
          createdAt: true,
          items: {
            select: {
              quantity: true,
              unitPrice: true,
              total: true,
              laptop: { select: { model: true, brand: { select: { name: true } } } },
            },
          },
        },
      }),
      prisma.review.findMany({
        where: { userId: user.id, deletedAt: null },
        select: {
          id: true,
          rating: true,
          title: true,
          body: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.videoMeeting.findMany({
        where: { customerId: user.id, deletedAt: null },
        select: {
          id: true,
          title: true,
          status: true,
          scheduledAt: true,
          durationMinutes: true,
          videoCallConsent: true,
          consentAt: true,
        },
      }),
      prisma.consentLog.findMany({
        where: { userId: user.id },
        select: {
          purpose: true,
          action: true,
          policyVersion: true,
          ipAddress: true,
          createdAt: true,
        },
      }),
    ]);

    // Record statutory DPDP access request
    await prisma.dataRequest.create({
      data: {
        userId: user.id,
        type: 'ACCESS',
        status: 'COMPLETED',
        details: 'Self-service data export via DPDP portal',
        resolvedAt: new Date(),
      },
    });

    const exportData = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        regulatorCompliance: 'Digital Personal Data Protection Act (DPDP), 2023 - Section 11',
        dataFiduciary: 'NextGen IT Hub Private Limited',
      },
      userProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
      },
      addresses: addresses.map((addr) => {
        let l1 = addr.line1;
        try { l1 = decrypt(l1); } catch {}
        return { ...addr, line1: l1 };
      }),
      orderHistory: orders,
      reviews,
      videoDemos: meetings,
      consents,
    };

    return successResponse(exportData);
  } catch (error) {
    return handleApiError(error, 'GET /api/account/data-export');
  }
}
