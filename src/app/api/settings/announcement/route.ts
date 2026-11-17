import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handleApiError, successResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['announcementText', 'announcementActive', 'announcementBgColor', 'announcementLink'],
        },
      },
    });

    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    const announcement = {
      active: map.announcementActive !== undefined ? map.announcementActive === 'true' : true,
      text: map.announcementText || 'Special Offer: Flat ₹2,000 OFF on all Grade A+ Business Laptops | Use Code: NEXTGEN2K',
      bgColor: map.announcementBgColor || '#2563EB',
      link: map.announcementLink || '/shop',
    };

    return successResponse({ announcement });
  } catch (error) {
    return handleApiError(error, 'GET /api/settings/announcement');
  }
}
