/**
 * AES-256-GCM encryption utilities for PII fields (phone, address, email of guests, etc.)
 * Key is derived from ENCRYPTION_KEY env var (must be 64-char hex = 32 bytes).
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits recommended for GCM
const TAG_LENGTH = 16; // 128 bits auth tag
const ENCODING = 'base64url';

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Encrypts a plaintext string.
 * Returns a base64url-encoded string: iv(12) + ciphertext + tag(16)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Format: iv (12) | ciphertext | tag (16)
  const combined = Buffer.concat([iv, encrypted, tag]);
  return combined.toString(ENCODING);
}

/**
 * Decrypts a value previously encrypted with `encrypt()`.
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ciphertext;
  const key = getKey();
  const combined = Buffer.from(ciphertext, ENCODING);

  const iv = combined.subarray(0, IV_LENGTH);
  const tag = combined.subarray(combined.length - TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH, combined.length - TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

/**
 * Hash a value (phone number) for indexed lookup without exposing the plaintext.
 * Uses HMAC-SHA256 with a separate HASH_SECRET.
 */
export function hashForLookup(value: string): string {
  const secret = process.env.HASH_SECRET;
  if (!secret) throw new Error('HASH_SECRET env var is required');
  return crypto.createHmac('sha256', secret).update(value.toLowerCase().trim()).digest('hex');
}

/**
 * Encrypt an object's specified fields in-place (mutates).
 */
export function encryptFields<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[],
): T {
  const copy = { ...obj };
  for (const field of fields) {
    if (copy[field] && typeof copy[field] === 'string') {
      (copy as Record<string, unknown>)[field as string] = encrypt(copy[field] as string);
    }
  }
  return copy;
}

/**
 * Decrypt an object's specified fields in-place (mutates).
 */
export function decryptFields<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[],
): T {
  const copy = { ...obj };
  for (const field of fields) {
    if (copy[field] && typeof copy[field] === 'string') {
      (copy as Record<string, unknown>)[field as string] = decrypt(copy[field] as string);
    }
  }
  return copy;
}
