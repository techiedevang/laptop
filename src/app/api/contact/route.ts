import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { ContactSchema } from '@/lib/validations';
import { verifyCaptcha } from '@/lib/captcha';
import { encrypt } from '@/lib/encryption';
import { enqueueEmail } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(contactLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = ContactSchema.parse(rawBody);

    const isCaptchaValid = await verifyCaptcha(body.captchaToken, ip);
    if (!isCaptchaValid) {
      return errorResponse('CAPTCHA verification failed', 400);
    }

    // Encrypt PII before saving to DB
    const encryptedEmail = encrypt(body.email);
    const encryptedPhone = body.phone ? encrypt(body.phone) : null;

    const message = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: encryptedEmail,
        phone: encryptedPhone,
        subject: body.subject,
        message: body.message,
      },
    });

    // Notify admin
    try {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'support@nextgenithub.in';
      await enqueueEmail({
        type: 'generic',
        to: adminEmail,
        subject: `New Contact Submission: ${body.subject}`,
        templateData: {
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
        },
      });
    } catch {}

    return successResponse({
      message: 'Thank you for reaching out! Our team will contact you shortly.',
      id: message.id,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/contact');
  }
}
