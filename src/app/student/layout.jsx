import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';

export const metadata = {
    title: "Student Dashboard – LearnHub",
    description: 'View your enrolled courses, track progress, and learn',
};

export default async function StudentLayout({ children }) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');
    const DEAN_EMAIL = 'abhigyankumar268@gmail.com';

    const supabase = createAdminClient();
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, email')
        .eq('clerk_user_id', userId)
        .single();

    if (profileError || !profile) redirect('/onboarding');

    // Students and dean admin can access this route
    const isDean = profile.email === DEAN_EMAIL;
    if (!isDean && profile.role !== 'student') redirect('/dashboard');

    return <>{children}</>;
}
