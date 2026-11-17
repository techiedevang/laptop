/**
 * Email sending via Resend for NextGen IT Hub.
 * Provides typed helpers for all transactional emails.
 */

import { Resend } from 'resend';
import { logger } from './logger';

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is required');
  return new Resend(apiKey);
}

const FROM_ADDRESS = process.env.EMAIL_FROM || 'NextGen IT Hub <noreply@nextgenitHub.in>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@nextgenithub.in';

export interface SendEmailResult {
  id: string;
  success: boolean;
}

// ─── Generic send ─────────────────────────────────────────────────────────────

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}): Promise<SendEmailResult> {
  const resend = getResend();
  const recipients = Array.isArray(params.to) ? params.to : [params.to];

  logger.info('Sending email', {
    to: recipients.map((e) => e.replace(/(.{2}).*@/, '$1***@')),
    subject: params.subject,
  });

  const result = await resend.emails.send({
    from: FROM_ADDRESS,
    to: recipients,
    subject: params.subject,
    html: params.html,
    text: params.text,
    replyTo: params.replyTo || REPLY_TO,
    tags: params.tags,
  });

  if (result.error) {
    logger.error('Resend error', { error: result.error.message });
    throw new Error(`Email send failed: ${result.error.message}`);
  }

  logger.info('Email sent', { id: result.data?.id });
  return { id: result.data?.id || '', success: true };
}

// ─── Templates ────────────────────────────────────────────────────────────────

export async function sendOtpEmail(params: {
  to: string;
  name: string;
  otp: string;
  purpose: string;
  expiresInMinutes: number;
}): Promise<SendEmailResult> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="NextGen IT Hub" style="height: 48px;" />
    </div>
    <h2 style="color: #1e293b; margin-bottom: 8px;">Your OTP</h2>
    <p style="color: #64748b;">Hello ${params.name},</p>
    <p style="color: #64748b;">Your one-time password for <strong>${params.purpose}</strong> is:</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb; background: #eff6ff; padding: 16px 32px; border-radius: 8px; display: inline-block;">
        ${params.otp}
      </span>
    </div>
    <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>${params.expiresInMinutes} minutes</strong>. Do not share this with anyone.</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
      NextGen IT Hub | Mumbai, Maharashtra<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #2563eb;">www.nextgenithub.in</a>
    </p>
  </div>
</body>
</html>`;

  return sendEmail({
    to: params.to,
    subject: `${params.otp} — Your NextGen IT Hub OTP`,
    html,
    text: `Your OTP is: ${params.otp}. Valid for ${params.expiresInMinutes} minutes.`,
    tags: [{ name: 'type', value: 'otp' }],
  });
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  name: string;
  orderNumber: string;
  items: Array<{ model: string; quantity: number; price: string }>;
  total: string;
  deliveryAddress: string;
}): Promise<SendEmailResult> {
  const itemRows = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${item.model}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${item.price}</td>
        </tr>`,
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px;">
    <h2 style="color: #1e293b;">Order Confirmed! 🎉</h2>
    <p style="color: #64748b;">Hello ${params.name}, your order <strong>${params.orderNumber}</strong> has been confirmed.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      <thead>
        <tr>
          <th style="text-align: left; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">Product</th>
          <th style="text-align: center; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">Qty</th>
          <th style="text-align: right; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">Price</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top: 12px; font-weight: bold;">Total</td>
          <td style="padding-top: 12px; font-weight: bold; text-align: right;">${params.total}</td>
        </tr>
      </tfoot>
    </table>
    <p style="color: #64748b;"><strong>Delivery to:</strong> ${params.deliveryAddress}</p>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${params.orderNumber}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Track Your Order</a>
    </div>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">NextGen IT Hub | Questions? Reply to this email.</p>
  </div>
</body>
</html>`;

  return sendEmail({
    to: params.to,
    subject: `Order ${params.orderNumber} Confirmed — NextGen IT Hub`,
    html,
    tags: [{ name: 'type', value: 'order_confirmation' }],
  });
}

export async function sendMeetingConfirmationEmail(params: {
  to: string;
  name: string;
  meetingDate: string;
  meetingTime: string;
  joinUrl: string;
  durationMinutes: number;
}): Promise<SendEmailResult> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px;">
    <h2 style="color: #1e293b;">📹 Video Call Scheduled</h2>
    <p style="color: #64748b;">Hello ${params.name}, your video consultation with NextGen IT Hub is confirmed.</p>
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #64748b;"><strong>📅 Date:</strong> ${params.meetingDate}</p>
      <p style="margin: 0 0 8px; color: #64748b;"><strong>🕐 Time:</strong> ${params.meetingTime} IST</p>
      <p style="margin: 0; color: #64748b;"><strong>⏱ Duration:</strong> ${params.durationMinutes} minutes</p>
    </div>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${params.joinUrl}" style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px;">Join Video Call</a>
    </div>
    <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Please join from a stable internet connection. The link expires 1 hour after the scheduled time.</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">NextGen IT Hub | Mumbai, Maharashtra</p>
  </div>
</body>
</html>`;

  return sendEmail({
    to: params.to,
    subject: `Video Call Confirmed — ${params.meetingDate} at ${params.meetingTime} | NextGen IT Hub`,
    html,
    tags: [{ name: 'type', value: 'meeting_confirmation' }],
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<SendEmailResult> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px;">
    <h2 style="color: #1e293b;">Reset Your Password</h2>
    <p style="color: #64748b;">Hello ${params.name},</p>
    <p style="color: #64748b;">Click the button below to reset your password. This link is valid for 1 hour.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${params.resetUrl}" style="background: #dc2626; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none;">Reset Password</a>
    </div>
    <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, ignore this email. Your password won't change.</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">NextGen IT Hub | Mumbai, Maharashtra</p>
  </div>
</body>
</html>`;

  return sendEmail({
    to: params.to,
    subject: 'Reset Your NextGen IT Hub Password',
    html,
    tags: [{ name: 'type', value: 'password_reset' }],
  });
}
