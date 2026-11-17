import { getServerSession } from 'next-auth/next';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import type { User, AdminUser } from '@prisma/client';
import type { AdminRole } from '@/types/enums';
import { logger } from '@/lib/logger';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'nextgen_it_hub_secure_production_secret_key_12345';

export class AuthError extends Error {
  statusCode: number;
  constructor(message = 'Unauthorized', statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Extract auth token from Request headers or cookies
 */
async function extractToken(req?: Request): Promise<string | null> {
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
  }

  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    if (adminToken) return adminToken;

    const userToken = cookieStore.get('user_token')?.value;
    if (userToken) return userToken;
  } catch {
    // cookies() might fail outside request context
  }

  return null;
}

/**
 * Get current authenticated customer User, or null
 */
export async function getUserSession(req?: Request): Promise<User | null> {
  try {
    // 1. Try NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const sessionUser = session.user as { id?: string; email?: string };
      if (sessionUser.id) {
        const user = await prisma.user.findUnique({
          where: { id: sessionUser.id },
        });
        if (user && user.isActive && !user.deletedAt) {
          return user;
        }
      }
      if (sessionUser.email) {
        const user = await prisma.user.findUnique({
          where: { email: sessionUser.email },
        });
        if (user && user.isActive && !user.deletedAt) {
          return user;
        }
      }
    }

    // 2. Try JWT token from cookie or header
    const token = await extractToken(req);
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
        const id = decoded.userId || decoded.id;
        if (id) {
          const user = await prisma.user.findUnique({
            where: { id },
          });
          if (user && user.isActive && !user.deletedAt) {
            return user;
          }
        }
      } catch {
        // Token invalid or expired
      }
    }
  } catch (error) {
    logger.error('Error getting user session', { error: String(error) });
  }

  return null;
}

/**
 * Requires authenticated user, throws 401 if not authenticated
 */
export async function requireAuth(req?: Request): Promise<User> {
  const user = await getUserSession(req);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  return user;
}

/**
 * Get current authenticated AdminUser, or null
 */
export async function getAdminSession(req?: Request): Promise<AdminUser | null> {
  try {
    // 1. Check admin_token cookie or Bearer token
    let adminToken: string | null = null;
    try {
      const cookieStore = await cookies();
      adminToken = cookieStore.get('admin_token')?.value || null;
    } catch {
      // ignore
    }

    if (!adminToken && req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        adminToken = authHeader.substring(7);
      }
    }

    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, JWT_SECRET) as {
          adminId?: string;
          id?: string;
          twoFactorVerified?: boolean;
        };
        const adminId = decoded.adminId || decoded.id;
        if (adminId && decoded.twoFactorVerified !== false) {
          const admin = await prisma.adminUser.findUnique({
            where: { id: adminId },
          });
          if (admin && admin.isActive && !admin.deletedAt) {
            return admin;
          }
        }
      } catch {
        // invalid token
      }
    }

    // 2. Check NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const user = session.user as {
        id?: string;
        email?: string;
        role?: string;
        adminRole?: string;
        twoFactorVerified?: boolean;
      };

      if (user.role === 'ADMIN' || user.adminRole) {
        if (user.email) {
          const admin = await prisma.adminUser.findUnique({
            where: { email: user.email },
          });
          if (admin && admin.isActive && !admin.deletedAt) {
            return admin;
          }
        }
        if (user.id) {
          const admin = await prisma.adminUser.findUnique({
            where: { id: user.id },
          });
          if (admin && admin.isActive && !admin.deletedAt) {
            return admin;
          }
        }
      }
    }
  } catch (error) {
    logger.error('Error getting admin session', { error: String(error) });
  }

  return null;
}

/**
 * Requires admin authentication, throws 401 or 403
 */
export async function requireAdmin(req?: Request): Promise<AdminUser> {
  const admin = await getAdminSession(req);
  if (!admin) {
    throw new AuthError('Admin authentication required', 403);
  }
  return admin;
}

/**
 * Requires specific admin role(s)
 */
export async function requireAdminRole(
  req: Request | undefined,
  roles: AdminRole[],
): Promise<AdminUser> {
  const admin = await requireAdmin(req);
  if (!roles.includes(admin.role as AdminRole)) {
    throw new AuthError(`Forbidden: requires one of roles [${roles.join(', ')}]`, 403);
  }
  return admin;
}
