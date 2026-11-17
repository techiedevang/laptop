import { NextRequest } from 'next/server';
import { verifyOtp } from '@/app/api/otp/route';
import { handleApiError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    return await verifyOtp(rawBody, req);
  } catch (error) {
    return handleApiError(error, 'POST /api/otp/verify');
  }
}
