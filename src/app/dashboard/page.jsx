import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin-cjs'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) redirect('/onboarding')

  const role = profile.role || 'student'

  // Redirect to role-specific dashboard
  const DEAN_EMAIL = 'abhigyankumar268@gmail.com'
  if (profile.email === DEAN_EMAIL) {
    redirect('/college')
  } else if (role === 'teacher') {
    redirect('/teacher')
  } else {
    redirect('/student')
  }
}
