import { NextRequest } from 'next/server';
import { loginAdmin } from '@/app/api/admin/auth/route';
import { handleApiError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    return await loginAdmin(rawBody, req);
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/auth/login');
  }
}
