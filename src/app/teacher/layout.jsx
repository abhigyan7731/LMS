import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { TeacherSidebar } from '@/components/teacher/teacher-sidebar';

export const metadata = {
    title: 'Teacher Portal – LearnHub',
    description: 'Manage your courses, upload lectures, and track student progress',
};

export default async function TeacherLayout({ children }) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');
    const DEAN_EMAIL = 'abhigyankumar268@gmail.com';

    const supabase = createAdminClient();
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role')
        .eq('clerk_user_id', userId)
        .single();

    if (profileError || !profile) redirect('/onboarding');
    
    const isDean = profile.email === DEAN_EMAIL;
    if (!isDean && profile.role !== 'teacher') redirect('/dashboard');

    return (
        <div className="min-h-screen gradient-mesh-dark text-white flex relative overflow-hidden">
            {/* Floating particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {Array.from({ length: 25 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-violet-400 particle-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            opacity: Math.random() * 0.3 + 0.1,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${Math.random() * 6 + 6}s`,
                        }}
                    />
                ))}
            </div>
            {/* Perspective grid */}
            <div className="fixed inset-0 perspective-grid pointer-events-none z-0" />

            <TeacherSidebar teacher={profile} />
            <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 relative z-10">
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
