import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { bulkEnquiryLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { BulkEnquirySchema } from '@/lib/validations';
import { verifyCaptcha } from '@/lib/captcha';
import { encrypt } from '@/lib/encryption';
import { enqueueEmail } from '@/lib/queue';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(bulkEnquiryLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = BulkEnquirySchema.parse(rawBody);

    const isCaptchaValid = await verifyCaptcha(body.captchaToken, ip);
    if (!isCaptchaValid) {
      return errorResponse('CAPTCHA verification failed', 400);
    }

    // Encrypt PII fields before saving
    const encryptedEmail = encrypt(body.email);
    const encryptedPhone = encrypt(body.phone);
    const encryptedGstin = body.gstNumber ? encrypt(body.gstNumber) : null;

    const enquiry = await prisma.bulkEnquiry.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        email: encryptedEmail,
        phone: encryptedPhone,
        gstin: encryptedGstin,
        quantity: body.quantity,
        budget: body.budget ? parseInt(body.budget.replace(/[^0-9]/g, ''), 10) * 100 : null,
        requirements: body.requirements,
        status: 'NEW',
      },
    });

    // Notify B2B sales team
    try {
      const b2bEmail = process.env.B2B_SALES_EMAIL || 'b2b@nextgenithub.in';
      await enqueueEmail({
        type: 'bulk_quote',
        to: b2bEmail,
        subject: `New B2B Bulk Enquiry from ${body.companyName} (${body.quantity} units)`,
        templateData: {
          company: body.companyName,
          contact: body.contactName,
          email: body.email,
          phone: body.phone,
          quantity: body.quantity,
          requirements: body.requirements,
        },
      });
    } catch {}

    return successResponse({
      message: 'Bulk enquiry received! A corporate account manager will reach out within 4 business hours.',
      enquiryId: enquiry.id,
    }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/bulk-enquiry');
  }
}
