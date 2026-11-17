import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

process.env.RAZORPAY_KEY_ID = 'rzp_test_mockKeyId12345';
process.env.RAZORPAY_KEY_SECRET = 'mock_secret_key_9876543210_abcdef';
process.env.RAZORPAY_WEBHOOK_SECRET = 'mock_webhook_secret_xyz123';
process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_mockKeyId12345';

import {
  verifyPaymentSignature,
  verifyWebhookSignature,
  getRazorpayCheckoutOptions,
} from '../src/lib/razorpay';

describe('Payment Gateway Security (Razorpay Integration)', () => {
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  it('validates a genuine Razorpay payment signature successfully', () => {
    const orderId = 'order_DA291038472910';
    const paymentId = 'pay_FA983726152431';

    // Signature formula: HMAC_SHA256(order_id + "|" + payment_id, secret)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = verifyPaymentSignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: expectedSignature,
    });

    assert.equal(isValid, true);
  });

  it('rejects tampered razorpayPaymentId (anti-fraud defense)', () => {
    const orderId = 'order_DA291038472910';
    const paymentId = 'pay_FA983726152431';

    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Attacker substitutes payment ID with another payment
    let tamperedValid = true;
    try {
      tamperedValid = verifyPaymentSignature({
        razorpayOrderId: orderId,
        razorpayPaymentId: 'pay_ATTACKER_INJECTED_9999',
        razorpaySignature: validSignature,
      });
    } catch {
      tamperedValid = false;
    }

    assert.equal(tamperedValid, false);
  });

  it('rejects tampered razorpayOrderId against a valid paymentId', () => {
    const orderId = 'order_LEGITIMATE_12345';
    const paymentId = 'pay_FA983726152431';

    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Swapped order ID
    let tamperedValid = true;
    try {
      tamperedValid = verifyPaymentSignature({
        razorpayOrderId: 'order_DIFFERENT_67890',
        razorpayPaymentId: paymentId,
        razorpaySignature: validSignature,
      });
    } catch {
      tamperedValid = false;
    }

    assert.equal(tamperedValid, false);
  });

  it('rejects forged signatures with identical length', () => {
    const orderId = 'order_DA291038472910';
    const paymentId = 'pay_FA983726152431';

    // 64-char hex string with wrong values
    const forgedSignature = '0'.repeat(64);

    const isValid = verifyPaymentSignature({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: forgedSignature,
    });

    assert.equal(isValid, false);
  });

  it('verifies genuine webhook payload signatures and rejects forged webhooks', () => {
    const webhookBody = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_FA983726152431',
            amount: 4500000,
            currency: 'INR',
            status: 'captured',
            order_id: 'order_DA291038472910',
          },
        },
      },
    });

    const validWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    // 1. Genuine webhook payload
    const isValid = verifyWebhookSignature({
      body: webhookBody,
      signature: validWebhookSig,
    });
    assert.equal(isValid, true);

    // 2. Tampered payload (e.g., attacker altered amount from 4500000 to 100)
    const tamperedBody = webhookBody.replace('4500000', '100');
    let isTamperedValid = true;
    try {
      isTamperedValid = verifyWebhookSignature({
        body: tamperedBody,
        signature: validWebhookSig,
      });
    } catch {
      isTamperedValid = false;
    }
    assert.equal(isTamperedValid, false);
  });

  it('constructs safe Razorpay checkout client options without leaking secrets', () => {
    const options = getRazorpayCheckoutOptions({
      razorpayOrderId: 'order_TEST_123',
      amountPaise: 3500000,
      orderNumber: 'NGH-2024-0099',
      customerName: 'Pooja Nair',
      customerEmail: 'pooja@example.com',
      customerPhone: '9876543210',
    });

    // Contains only public key, never secret
    assert.equal(options.key, 'rzp_test_mockKeyId12345');
    assert.equal(options.amount, 3500000);
    assert.equal(options.currency, 'INR');
    assert.equal(options.order_id, 'order_TEST_123');
    assert.equal((options as any).notes.order_number, 'NGH-2024-0099');

    // Secrets must NOT be present
    assert.equal((options as any).key_secret, undefined);
    assert.equal((options as any).webhook_secret, undefined);
  });
});
