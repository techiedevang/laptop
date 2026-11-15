import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/admin/login');
  }

  // Check 2FA is verified in session
  if (!(session as { user?: { twoFactorVerified?: boolean } }).user?.twoFactorVerified) {
    redirect('/admin/login?step=2fa');
  }

  // Check admin role
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'STAFF'];
  if (!allowedRoles.includes((session.user as { adminRole?: string }).adminRole ?? '')) {
    redirect('/admin/login?error=unauthorized');
  }

  const user = {
    name: session.user.name ?? 'Admin',
    role: (session.user as { adminRole?: string }).adminRole ?? 'STAFF',
    email: session.user.email ?? '',
  };

  return <AdminShell user={user}>{children}</AdminShell>;
}
