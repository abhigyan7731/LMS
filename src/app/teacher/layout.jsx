import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { TeacherSidebar } from '@/components/teacher/teacher-sidebar';

export const metadata = {
    title: 'Teacher Portal – LearnHub',
    description: 'Manage your courses, upload lectures, and track student progress',
};

export default async function TeacherLayout({ children }) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');
    if (profile.role !== 'teacher') redirect('/dashboard');

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white flex">
            <TeacherSidebar teacher={profile} />
            <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
