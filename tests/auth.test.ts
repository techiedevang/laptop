import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

// Role definitions
type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';
type UserRole = 'CUSTOMER' | 'ADMIN';

interface TestUser {
  id: string;
  name: string;
  role: UserRole;
  adminRole?: AdminRole;
  isActive: boolean;
}

// RBAC Authorization Matrix
const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    'inventory:read',
    'inventory:write',
    'inventory:delete',
    'orders:read',
    'orders:write',
    'orders:refund',
    'reviews:moderate',
    'users:manage',
    'system:backup',
    'system:settings',
  ],
  ADMIN: [
    'inventory:read',
    'inventory:write',
    'orders:read',
    'orders:write',
    'orders:refund',
    'reviews:moderate',
  ],
  MANAGER: [
    'inventory:read',
    'inventory:write',
    'orders:read',
    'orders:write',
    'reviews:moderate',
  ],
  STAFF: [
    'inventory:read',
    'orders:read',
    'orders:pack',
    'meetings:host',
  ],
};

function hasPermission(user: TestUser, permission: string): boolean {
  if (!user.isActive) return false;
  if (user.role !== 'ADMIN' || !user.adminRole) return false;
  const permissions = ROLE_PERMISSIONS[user.adminRole] || [];
  return permissions.includes(permission);
}

// RFC 6238 TOTP computation helper
function generateTOTP(secretHex: string, timeStepSeconds = 30): string {
  const timeStep = Math.floor(Date.now() / 1000 / timeStepSeconds);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(timeStep));

  const hmac = crypto.createHmac('sha1', Buffer.from(secretHex, 'hex'));
  hmac.update(timeBuffer);
  const hmacResult = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code = (
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, '0');
}

function verifyTOTP(token: string, secretHex: string, toleranceSteps = 1): boolean {
  if (token.length !== 6 || !/^\d{6}$/.test(token)) return false;

  const currentStep = Math.floor(Date.now() / 1000 / 30);
  for (let i = -toleranceSteps; i <= toleranceSteps; i++) {
    const step = currentStep + i;
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigInt64BE(BigInt(step));

    const hmac = crypto.createHmac('sha1', Buffer.from(secretHex, 'hex'));
    hmac.update(timeBuffer);
    const hmacResult = hmac.digest();

    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const code = (
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff)
    ) % 1000000;

    if (code.toString().padStart(6, '0') === token) {
      return true;
    }
  }
  return false;
}

describe('Authentication, RBAC & 2FA Enforcement', () => {
  const superAdmin: TestUser = {
    id: 'admin_1',
    name: 'Super Admin',
    role: 'ADMIN',
    adminRole: 'SUPER_ADMIN',
    isActive: true,
  };

  const staffUser: TestUser = {
    id: 'staff_1',
    name: 'Warehouse Operator',
    role: 'ADMIN',
    adminRole: 'STAFF',
    isActive: true,
  };

  const customerUser: TestUser = {
    id: 'cust_1',
    name: 'Priya Sharma',
    role: 'CUSTOMER',
    isActive: true,
  };

  const deactivatedAdmin: TestUser = {
    id: 'admin_locked',
    name: 'Former Staff',
    role: 'ADMIN',
    adminRole: 'SUPER_ADMIN',
    isActive: false,
  };

  it('enforces RBAC permissions strictly across admin role tiers', () => {
    // SUPER_ADMIN has full permissions
    assert.equal(hasPermission(superAdmin, 'orders:refund'), true);
    assert.equal(hasPermission(superAdmin, 'system:settings'), true);
    assert.equal(hasPermission(superAdmin, 'inventory:delete'), true);

    // STAFF cannot issue refunds or delete inventory
    assert.equal(hasPermission(staffUser, 'orders:read'), true);
    assert.equal(hasPermission(staffUser, 'orders:refund'), false);
    assert.equal(hasPermission(staffUser, 'system:settings'), false);
    assert.equal(hasPermission(staffUser, 'inventory:delete'), false);

    // CUSTOMER has zero administrative permissions
    assert.equal(hasPermission(customerUser, 'orders:read'), false);
    assert.equal(hasPermission(customerUser, 'inventory:write'), false);

    // Deactivated admin cannot perform any action
    assert.equal(hasPermission(deactivatedAdmin, 'system:settings'), false);
  });

  it('generates and validates 6-digit TOTP two-factor authentication tokens', () => {
    const testSecretHex = '3132333435363738393031323334353637383930'; // 20-byte seed

    const token = generateTOTP(testSecretHex);
    assert.equal(token.length, 6);
    assert.match(token, /^\d{6}$/);

    // Validation passes for genuine code
    assert.equal(verifyTOTP(token, testSecretHex), true);

    // Validation fails for forged or wrong code
    assert.equal(verifyTOTP('000000', testSecretHex), false);
    assert.equal(verifyTOTP('999999', testSecretHex), false);
    assert.equal(verifyTOTP('12345', testSecretHex), false); // wrong length
    assert.equal(verifyTOTP('abcdef', testSecretHex), false); // non-numeric
  });

  it('prevents Insecure Direct Object Reference (IDOR) attacks', () => {
    function requireOwnership(actorUserId: string, resourceOwnerId: string, actorRole: string): boolean {
      if (actorRole === 'ADMIN') return true; // Administrators can inspect for support
      return actorUserId === resourceOwnerId;
    }

    const aliceId = 'user_alice_123';
    const bobId = 'user_bob_456';

    // Alice accesses her own order -> Allowed
    assert.equal(requireOwnership(aliceId, aliceId, 'CUSTOMER'), true);

    // Bob attempts to inspect Alice's order -> Denied (IDOR blocked)
    assert.equal(requireOwnership(bobId, aliceId, 'CUSTOMER'), false);

    // Admin inspects Alice's order for support -> Allowed
    assert.equal(requireOwnership(superAdmin.id, aliceId, 'ADMIN'), true);
  });
});
