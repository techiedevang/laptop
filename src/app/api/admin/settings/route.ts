import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { SiteSettingsSchema } from '@/lib/validations';
import { enqueueAudit } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return successResponse({ settings: settingsMap });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/settings');
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const rawBody = await req.json();
    const body = SiteSettingsSchema.parse(rawBody);

    const updates = Object.entries(body).map(async ([key, value]) => {
      const stringVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal },
      });
    });

    await Promise.all(updates);

    await enqueueAudit({
      adminId: admin.id,
      action: 'site_settings_updated',
      entityType: 'SiteSetting',
      newValue: body,
    });

    return successResponse({ message: 'Settings updated successfully' });
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/settings');
  }
}
