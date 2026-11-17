import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// Set up mandatory test keys prior to importing the encryption module
process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
process.env.HASH_SECRET = 'nextgen_test_phone_blind_index_secret_key_12345';

import {
  encrypt,
  decrypt,
  hashForLookup,
  encryptFields,
  decryptFields,
} from '../src/lib/encryption';

describe('Cryptographic Engine & PII Data Protection (AES-256-GCM)', () => {
  it('encrypts and decrypts strings with perfect fidelity (roundtrip test)', () => {
    const testCases = [
      '9876543210',
      '+91 98200 12345',
      'Flat 402, Sunshine Towers, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
      'राजेश शर्मा (Mumbai Refurbished)',
      'customer.account+test@gmail.com',
      'Special characters: !@#$%^&*()_+~`-=[]{}|;:",.<>?/',
    ];

    for (const original of testCases) {
      const ciphertext = encrypt(original);
      assert.notEqual(ciphertext, original);
      assert.ok(ciphertext.length > original.length);

      const decrypted = decrypt(ciphertext);
      assert.equal(decrypted, original);
    }
  });

  it('guarantees unique IV generation (semantic security: same plaintext -> distinct ciphertexts)', () => {
    const phone = '9876543210';
    const cipher1 = encrypt(phone);
    const cipher2 = encrypt(phone);
    const cipher3 = encrypt(phone);

    // Ciphertexts must be distinct because random 96-bit IV is regenerated each time
    assert.notEqual(cipher1, cipher2);
    assert.notEqual(cipher2, cipher3);
    assert.notEqual(cipher1, cipher3);

    // All must decrypt to original phone
    assert.equal(decrypt(cipher1), phone);
    assert.equal(decrypt(cipher2), phone);
    assert.equal(decrypt(cipher3), phone);
  });

  it('detects tampering and rejects corrupted ciphertext or authentication tag (AEAD integrity)', () => {
    const sensitive = 'Private Delivery Address, Floor 5';
    const validCipher = encrypt(sensitive);

    // 1. Corrupt one character in the ciphertext
    const buffer = Buffer.from(validCipher, 'base64url');
    // Flip a byte in the middle
    buffer[15] = buffer[15] ^ 0xff;
    const tamperedCipher = buffer.toString('base64url');

    assert.throws(
      () => {
        decrypt(tamperedCipher);
      },
      /Unsupported state or unable to authenticate data|bad decrypt/i,
      'Tampered ciphertext must fail authentication tag verification'
    );
  });

  it('computes deterministic HMAC-SHA256 blind index for phone searchability', () => {
    const phone1 = '9876543210';
    const phone2 = ' 9876543210 '; // whitespace
    const phone3 = '9876543211'; // different digit

    const hash1 = hashForLookup(phone1);
    const hash2 = hashForLookup(phone2);
    const hash3 = hashForLookup(phone3);

    // Must be 64-char hex string (SHA256)
    assert.equal(hash1.length, 64);
    assert.match(hash1, /^[0-9a-f]{64}$/);

    // Trimmed and lowercased input produces identical blind index
    assert.equal(hash1, hash2);

    // Different number produces completely different hash
    assert.notEqual(hash1, hash3);
  });

  it('encrypts and decrypts targeted object fields in place', () => {
    interface UserProfile {
      id: string;
      name: string;
      phone: string;
      line1: string;
      pincode: string;
    }

    const originalProfile: UserProfile = {
      id: 'usr_101',
      name: 'Aditya Mehta',
      phone: '9988776655',
      line1: 'B-12, Green Acres, Pune',
      pincode: '411001',
    };

    // Encrypt phone and line1 only, keep id and pincode as-is
    const encryptedProfile = encryptFields({ ...originalProfile }, ['phone', 'line1']);

    assert.equal(encryptedProfile.id, 'usr_101');
    assert.equal(encryptedProfile.name, 'Aditya Mehta');
    assert.equal(encryptedProfile.pincode, '411001');
    assert.notEqual(encryptedProfile.phone, originalProfile.phone);
    assert.notEqual(encryptedProfile.line1, originalProfile.line1);

    // Decrypt fields back
    const decryptedProfile = decryptFields(encryptedProfile, ['phone', 'line1']);
    assert.deepEqual(decryptedProfile, originalProfile);
  });
});
