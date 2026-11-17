import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { PincodeCheckSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

interface PincodeData {
  city: string;
  state: string;
  tier: 'METRO_EXPRESS' | 'TIER_2_STANDARD' | 'TIER_3_STANDARD';
  deliveryDays: string;
  codAvailable: boolean;
}

// Major Indian Postal Code Circle mappings
function getPincodeDetails(pincode: string): PincodeData | null {
  const prefix2 = pincode.slice(0, 2);
  const prefix3 = pincode.slice(0, 3);

  // Invalid postal circle ranges in India
  if (pincode.startsWith('0') || parseInt(prefix2, 10) > 85) {
    return null;
  }

  // Metro Express Circles (1-2 Days Delivery)
  if (prefix3 === '400' || prefix3 === '401') {
    return { city: 'Mumbai', state: 'Maharashtra', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }
  if (prefix3 === '411') {
    return { city: 'Pune', state: 'Maharashtra', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }
  if (prefix3 === '110') {
    return { city: 'New Delhi (HQ Warehouse)', state: 'Delhi', tier: 'METRO_EXPRESS', deliveryDays: 'Same / Next Day Express', codAvailable: true };
  }
  if (prefix3 === '122' || prefix3 === '201') {
    return { city: 'Gurugram / Noida (NCR)', state: 'Haryana / UP', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }
  if (prefix3 === '560') {
    return { city: 'Bengaluru', state: 'Karnataka', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }
  if (prefix3 === '500') {
    return { city: 'Hyderabad', state: 'Telangana', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }
  if (prefix3 === '600') {
    return { city: 'Chennai', state: 'Tamil Nadu', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }
  if (prefix3 === '700') {
    return { city: 'Kolkata', state: 'West Bengal', tier: 'METRO_EXPRESS', deliveryDays: '2-3 Days', codAvailable: true };
  }
  if (prefix3 === '380') {
    return { city: 'Ahmedabad', state: 'Gujarat', tier: 'METRO_EXPRESS', deliveryDays: '1-2 Days', codAvailable: true };
  }

  // Tier 2 State Capitals and Major Hubs
  const numPrefix2 = parseInt(prefix2, 10);
  if (numPrefix2 >= 11 && numPrefix2 <= 85) {
    let state = 'India';
    if (numPrefix2 >= 11 && numPrefix2 <= 19) state = 'Northern Region';
    else if (numPrefix2 >= 20 && numPrefix2 <= 28) state = 'Uttar Pradesh / Uttarakhand';
    else if (numPrefix2 >= 30 && numPrefix2 <= 34) state = 'Rajasthan';
    else if (numPrefix2 >= 36 && numPrefix2 <= 39) state = 'Gujarat';
    else if (numPrefix2 >= 40 && numPrefix2 <= 44) state = 'Maharashtra / Goa';
    else if (numPrefix2 >= 45 && numPrefix2 <= 49) state = 'Madhya Pradesh / Chhattisgarh';
    else if (numPrefix2 >= 50 && numPrefix2 <= 53) state = 'Andhra Pradesh / Telangana';
    else if (numPrefix2 >= 56 && numPrefix2 <= 59) state = 'Karnataka';
    else if (numPrefix2 >= 60 && numPrefix2 <= 64) state = 'Tamil Nadu';
    else if (numPrefix2 >= 67 && numPrefix2 <= 69) state = 'Kerala';
    else if (numPrefix2 >= 70 && numPrefix2 <= 74) state = 'West Bengal / North East';
    else if (numPrefix2 >= 75 && numPrefix2 <= 77) state = 'Odisha';
    else if (numPrefix2 >= 80 && numPrefix2 <= 85) state = 'Bihar / Jharkhand';

    return {
      city: `Hub ${prefix3}`,
      state,
      tier: 'TIER_2_STANDARD',
      deliveryDays: '3-5 Days',
      codAvailable: true,
    };
  }

  return null;
}

export async function checkPincode(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitError = await enforceRateLimit(apiLimiter, ip);
  if (rateLimitError) return rateLimitError;

  const url = new URL(req.url);
  const pincode = url.searchParams.get('pincode');

  if (!pincode) {
    return errorResponse('Pincode is required', 400);
  }

  const parsed = PincodeCheckSchema.safeParse({ pincode });
  if (!parsed.success) {
    return errorResponse('Invalid Indian pincode. Must be exactly 6 digits.', 400);
  }

  // 1. Check database ServiceArea override
  const dbArea = await prisma.serviceArea.findFirst({
    where: {
      isActive: true,
      pincodes: { contains: pincode },
    },
  });

  if (dbArea) {
    return successResponse({
      serviceable: true,
      pincode,
      city: dbArea.city,
      state: dbArea.state,
      tier: 'METRO_EXPRESS',
      estimatedDeliveryDays: '1-2 Days',
      codAvailable: true,
      shippingFeeInPaise: 0, // Free delivery
    });
  }

  // 2. Postal circle lookup
  const details = getPincodeDetails(pincode);

  if (!details) {
    return successResponse({
      serviceable: false,
      pincode,
      message: 'Currently we do not deliver to this pincode. Please contact support for special deliveries.',
    });
  }

  return successResponse({
    serviceable: true,
    pincode,
    city: details.city,
    state: details.state,
    tier: details.tier,
    estimatedDeliveryDays: details.deliveryDays,
    codAvailable: details.codAvailable,
    shippingFeeInPaise: 0, // Free delivery across serviceable India
  });
}

export async function GET(req: NextRequest) {
  try {
    return await checkPincode(req);
  } catch (error) {
    return handleApiError(error, 'GET /api/pincode-check');
  }
}
