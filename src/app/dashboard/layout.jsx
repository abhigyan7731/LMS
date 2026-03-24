import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { DashboardNav } from '@/components/dashboard-nav';

export default async function DashboardLayout({ children }) {
  let userId = null;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch {
    redirect('/sign-in');
  }
  if (!userId) redirect('/sign-in');

  const supabase = createAdminClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('clerk_user_id', userId)
    .single();

  if (error || !profile) {
    // Profile doesn't exist yet - user needs to onboard
    redirect('/onboarding');
  }

  const role = profile.role || 'student';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <DashboardNav role={role} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
