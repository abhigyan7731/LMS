import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CollegeSidebar } from '@/components/college/college-sidebar';

export const metadata = {
    title: "Dean's Portal – LearnHub",
    description: 'Manage teachers, students, and courses across the entire platform',
};

export default async function CollegeLayout({ children }) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    const DEAN_EMAIL = 'abhigyankumar268@gmail.com';
    if (profile.email !== DEAN_EMAIL) redirect('/');

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white flex">
            <CollegeSidebar dean={profile} />
            <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
