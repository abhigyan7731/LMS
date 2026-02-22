import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = {
    title: "Student Management – LearnHub",
    description: 'View all students, their enrollments and progress',
};

const DEAN_EMAIL = 'abhigyankumar268@gmail.com';

export default async function StudentPortalLayout({ children }) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, role, email')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    // Allow: admin (dean email) or teacher role
    const isAdmin = profile.email === DEAN_EMAIL;
    const isTeacher = profile.role === 'teacher';

    if (!isAdmin && !isTeacher) redirect('/');

    return <>{children}</>;
}
