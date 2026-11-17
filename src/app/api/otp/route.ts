import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { otpSendLimiter, otpVerifyLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { OtpSendSchema, OtpVerifySchema } from '@/lib/validations';
import { enqueueEmail, enqueueWhatsApp } from '@/lib/queue';
import { logger } from '@/lib/logger';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const HASH_SECRET = process.env.HASH_SECRET || process.env.NEXTAUTH_SECRET || 'nextgen_otp_secret_key';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'nextgen_it_hub_secure_production_secret_key_12345';

function hashOtp(otp: string): string {
  return crypto.createHmac('sha256', HASH_SECRET).update(otp).digest('hex');
}

export async function sendOtp(body: unknown, req: NextRequest) {
  const ip = getClientIp(req);
  const parsed = OtpSendSchema.parse(body);
  const identifier = parsed.type === 'phone' ? parsed.phone! : parsed.email!;

  // Rate limit check per identifier / IP
  const rateLimitError = await enforceRateLimit(otpSendLimiter, `${identifier}:${ip}`);
  if (rateLimitError) return rateLimitError;

  // Generate 6 digit code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = hashOtp(otpCode);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate previous active OTPs for same identifier + purpose
  await prisma.otpCode.updateMany({
    where: {
      identifier,
      purpose: parsed.purpose,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  // Store new OTP
  await prisma.otpCode.create({
    data: {
      identifier,
      code: hashedCode,
      purpose: parsed.purpose,
      expiresAt,
    },
  });

  // Send via channel
  if (parsed.type === 'phone') {
    try {
      await enqueueWhatsApp({
        type: 'otp',
        phone: identifier,
        templateName: 'otp_verification',
        templateData: { otp: otpCode },
      });
    } catch (err) {
      logger.error('Failed to enqueue OTP WhatsApp', { error: String(err) });
    }
  } else {
    try {
      await enqueueEmail({
        type: 'otp',
        to: identifier,
        subject: `Your NextGen IT Hub Verification Code: ${otpCode}`,
        templateData: { otp: otpCode, purpose: parsed.purpose },
      });
    } catch (err) {
      logger.error('Failed to enqueue OTP Email', { error: String(err) });
    }
  }

  logger.info('OTP generated and dispatched', {
    type: parsed.type,
    identifier: identifier.replace(/(.{2}).*(.{2})/, '$1***$2'),
    purpose: parsed.purpose,
  });

  return successResponse({
    message: `OTP sent successfully to ${parsed.type === 'phone' ? 'mobile' : 'email'}`,
    expiresInSeconds: 600,
    // In dev mode only, return code for automated testing
    ...(process.env.NODE_ENV !== 'production' ? { devOtp: otpCode } : {}),
  });
}

export async function verifyOtp(body: unknown, req: NextRequest) {
  const ip = getClientIp(req);
  const parsed = OtpVerifySchema.parse(body);
  const identifier = parsed.type === 'phone' ? parsed.phone! : parsed.email!;

  // Rate limit verify attempts
  const rateLimitError = await enforceRateLimit(otpVerifyLimiter, `${identifier}:${ip}`);
  if (rateLimitError) return rateLimitError;

  // Find latest active OTP
  const record = await prisma.otpCode.findFirst({
    where: {
      identifier,
      purpose: parsed.purpose,
      usedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    return errorResponse('No active OTP found or OTP has already been used. Please request a new one.', 400);
  }

  if (record.attempts >= 5) {
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
    return errorResponse('Maximum attempts exceeded. This OTP is invalidated. Please request a new one.', 429);
  }

  if (record.expiresAt < new Date()) {
    return errorResponse('OTP has expired. Please request a new code.', 400);
  }

  const submittedHash = hashOtp(parsed.code);
  if (submittedHash !== record.code) {
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    const remainingAttempts = 5 - (record.attempts + 1);
    return errorResponse(`Invalid OTP code. ${remainingAttempts} attempts remaining.`, 400);
  }

  // Mark verified
  await prisma.otpCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  // Issue verification token
  const otpToken = jwt.sign(
    {
      verified: true,
      identifier,
      purpose: parsed.purpose,
    },
    JWT_SECRET,
    { expiresIn: '15m' },
  );

  return successResponse({
    verified: true,
    message: 'OTP verified successfully',
    token: otpToken,
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    if (rawBody.code !== undefined) {
      return await verifyOtp(rawBody, req);
    } else {
      return await sendOtp(rawBody, req);
    }
  } catch (error) {
    return handleApiError(error, 'POST /api/otp');
  }
}
