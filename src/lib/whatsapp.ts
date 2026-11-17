/**
 * WhatsApp Business Cloud API integration.
 * Sends template messages for meeting reminders, order notifications, etc.
 */

import { logger } from './logger';

const WHATSAPP_API_VERSION = 'v19.0';

function getConfig() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are required');
  }
  return { token, phoneNumberId };
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WhatsAppTextComponent {
  type: 'text';
  text: string;
}

export interface WhatsAppHeaderComponent {
  type: 'header';
  parameters: Array<{ type: 'text'; text: string }>;
}

export interface WhatsAppBodyComponent {
  type: 'body';
  parameters: Array<{ type: 'text'; text: string }>;
}

export type WhatsAppComponent =
  | WhatsAppHeaderComponent
  | WhatsAppBodyComponent;

export interface SendTemplateInput {
  to: string; // E.164 format e.g. +919876543210
  templateName: string;
  languageCode?: string; // default: en
  components?: WhatsAppComponent[];
}

export interface WhatsAppSendResult {
  messageId: string;
  to: string;
}

// ─── Send ─────────────────────────────────────────────────────────────────────

/**
 * Send a WhatsApp template message via Cloud API.
 */
export async function sendWhatsAppTemplate(
  input: SendTemplateInput,
): Promise<WhatsAppSendResult> {
  const { token, phoneNumberId } = getConfig();

  // Normalize phone — strip spaces, ensure + prefix
  const to = input.to.replace(/\s/g, '');

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: input.templateName,
      language: { code: input.languageCode || 'en' },
      components: input.components || [],
    },
  };

  logger.info('Sending WhatsApp template', {
    templateName: input.templateName,
    to: maskPhone(to),
  });

  const res = await fetch(
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    logger.error('WhatsApp API error', { status: res.status, error });
    throw new Error(`WhatsApp API error: ${res.status} ${error}`);
  }

  const data = (await res.json()) as {
    messages: Array<{ id: string }>;
  };
  const messageId = data.messages?.[0]?.id || '';

  logger.info('WhatsApp message sent', { messageId, to: maskPhone(to) });

  return { messageId, to };
}

// ─── Pre-built Templates ──────────────────────────────────────────────────────

export async function sendMeetingReminderWhatsApp(params: {
  phone: string;
  customerName: string;
  meetingDate: string;
  meetingTime: string;
  joinUrl: string;
}): Promise<WhatsAppSendResult> {
  return sendWhatsAppTemplate({
    to: params.phone,
    templateName: 'meeting_reminder',
    languageCode: 'en',
    components: [
      {
        type: 'header',
        parameters: [{ type: 'text', text: 'NextGen IT Hub' }],
      },
      {
        type: 'body',
        parameters: [
          { type: 'text', text: params.customerName },
          { type: 'text', text: params.meetingDate },
          { type: 'text', text: params.meetingTime },
          { type: 'text', text: params.joinUrl },
        ],
      },
    ],
  });
}

export async function sendOrderConfirmationWhatsApp(params: {
  phone: string;
  customerName: string;
  orderNumber: string;
  totalAmount: string;
}): Promise<WhatsAppSendResult> {
  return sendWhatsAppTemplate({
    to: params.phone,
    templateName: 'order_confirmation',
    languageCode: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: params.customerName },
          { type: 'text', text: params.orderNumber },
          { type: 'text', text: params.totalAmount },
        ],
      },
    ],
  });
}

export async function sendShippingUpdateWhatsApp(params: {
  phone: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  trackingUrl: string;
}): Promise<WhatsAppSendResult> {
  return sendWhatsAppTemplate({
    to: params.phone,
    templateName: 'shipping_update',
    languageCode: 'en',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: params.customerName },
          { type: 'text', text: params.orderNumber },
          { type: 'text', text: params.trackingNumber },
          { type: 'text', text: params.trackingUrl },
        ],
      },
    ],
  });
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

export function verifyWhatsAppWebhook(params: {
  mode: string;
  token: string;
  challenge: string;
}): string | null {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  if (params.mode === 'subscribe' && params.token === verifyToken) {
    return params.challenge;
  }
  return null;
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function maskPhone(phone: string): string {
  if (phone.length <= 4) return '****';
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}

/**
 * Normalize Indian phone number to E.164 format.
 */
export function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('0') && digits.length === 11) return `+91${digits.slice(1)}`;
  return `+${digits}`;
}
