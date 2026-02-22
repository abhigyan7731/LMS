import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('clerk_user_id', userId)
    .single();

  if (!profile) redirect('/onboarding');

  const role = profile.role || 'student';

  return (
    <div className="space-y-8">
      {role === 'teacher' ? <TeacherDashboard userId={userId} /> : <StudentDashboard userId={userId} />}
    </div>
  );
}
