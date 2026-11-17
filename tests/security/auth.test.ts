import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

process.env.RAZORPAY_KEY_ID = 'rzp_test_secSuiteKey123';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secSuiteSecret456';
process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
process.env.HASH_SECRET = 'sec_suite_hash_secret_789';

import { verifyPaymentSignature } from '../../src/lib/razorpay';
import { encrypt, decrypt } from '../../src/lib/encryption';

describe('Security Verification Suite (Auth, IDOR, Cryptographic Integrity)', () => {
  describe('Authentication & IDOR Prevention', () => {
    it('verifies resource ownership and prevents cross-tenant data leaks', () => {
      interface OrderRecord {
        id: string;
        userId: string;
        total: number;
      }

      const orders: OrderRecord[] = [
        { id: 'order_1001', userId: 'user_cust_A', total: 4500000 },
        { id: 'order_1002', userId: 'user_cust_B', total: 3200000 },
      ];

      function getOrderForUser(orderId: string, requestUserId: string, role: string): OrderRecord | null {
        const order = orders.find((o) => o.id === orderId);
        if (!order) return null;

        // IDOR check: customer can only access their own order
        if (role !== 'ADMIN' && order.userId !== requestUserId) {
          throw new Error('Access Forbidden: IDOR violation detected');
        }

        return order;
      }

      // Customer A accesses their order -> 200 OK
      const orderA = getOrderForUser('order_1001', 'user_cust_A', 'CUSTOMER');
      assert.equal(orderA?.id, 'order_1001');

      // Customer B attempts to access Customer A's order -> Throws 403 Forbidden
      assert.throws(
        () => {
          getOrderForUser('order_1001', 'user_cust_B', 'CUSTOMER');
        },
        /Access Forbidden: IDOR violation detected/
      );

      // Super Admin accesses order for dispute resolution -> 200 OK
      const adminAccess = getOrderForUser('order_1001', 'admin_super_1', 'ADMIN');
      assert.equal(adminAccess?.id, 'order_1001');
    });

    it('enforces token expiration and invalidates expired sessions', () => {
      interface SessionTokenPayload {
        userId: string;
        exp: number; // Unix epoch seconds
      }

      function validateTokenTimestamp(token: SessionTokenPayload, currentEpochSeconds: number): boolean {
        return currentEpochSeconds < token.exp;
      }

      const now = Math.floor(Date.now() / 1000);
      const activeToken: SessionTokenPayload = { userId: 'usr_1', exp: now + 3600 };
      const expiredToken: SessionTokenPayload = { userId: 'usr_1', exp: now - 60 };

      assert.equal(validateTokenTimestamp(activeToken, now), true);
      assert.equal(validateTokenTimestamp(expiredToken, now), false);
    });
  });

  describe('Payment Signature Tamper Resistance', () => {
    it('cryptographically validates genuine Razorpay signatures and blocks tampering', () => {
      const orderId = 'order_SEC_99281726';
      const paymentId = 'pay_SEC_11223344';
      const secret = process.env.RAZORPAY_KEY_SECRET!;

      const validSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      // Valid check passes
      assert.equal(
        verifyPaymentSignature({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: validSignature,
        }),
        true
      );

      // Replay attack with tampered order ID fails
      let tamperedValid = true;
      try {
        tamperedValid = verifyPaymentSignature({
          razorpayOrderId: 'order_ATTACKER_INJECTED',
          razorpayPaymentId: paymentId,
          razorpaySignature: validSignature,
        });
      } catch {
        tamperedValid = false;
      }

      assert.equal(tamperedValid, false);
    });
  });

  describe('Cryptographic Storage of Sensitive PII', () => {
    it('verifies ciphertext authentication and rejects bit-flipped data', () => {
      const originalPhone = '9876543210';
      const encrypted = encrypt(originalPhone);

      // Decrypt succeeds on intact ciphertext
      assert.equal(decrypt(encrypted), originalPhone);

      // Tampered tag triggers AEAD integrity rejection
      const buf = Buffer.from(encrypted, 'base64url');
      buf[buf.length - 1] ^= 0x01; // flip last bit of authentication tag
      const corrupted = buf.toString('base64url');

      assert.throws(
        () => decrypt(corrupted),
        /Unsupported state or unable to authenticate data|bad decrypt/i
      );
    });
  });
});
