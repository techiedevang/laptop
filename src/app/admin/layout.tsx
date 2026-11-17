import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'nextgen_it_hub_secure_production_secret_key_12345';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  // 1. Check dedicated admin_token JWT cookie
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, JWT_SECRET) as {
        adminId?: string;
        email?: string;
        role?: string;
        twoFactorVerified?: boolean;
      };
      if (decoded && decoded.email) {
        const user = {
          name: 'Super Admin',
          role: decoded.role || 'SUPER_ADMIN',
          email: decoded.email,
        };
        return <AdminShell user={user}>{children}</AdminShell>;
      }
    } catch {
      // Invalid or expired token, fall through to NextAuth check
    }
  }

  // 2. Check NextAuth server session
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'];
    const adminRole = (session.user as { adminRole?: string }).adminRole ?? 'SUPER_ADMIN';

    if (allowedRoles.includes(adminRole)) {
      const user = {
        name: session.user.name ?? 'Super Admin',
        role: adminRole,
        email: session.user.email ?? 'admin@nextgenithub.in',
      };
      return <AdminShell user={user}>{children}</AdminShell>;
    }
  }

  // If neither cookie is valid, redirect to admin login
  redirect('/admin/login');
}
