import { NextRequest } from 'next/server';
import { logoutAdmin } from '@/app/api/admin/auth/route';
import { handleApiError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    return await logoutAdmin();
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/auth/logout');
  }
}
