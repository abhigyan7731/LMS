import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { CollegeSidebar } from '@/components/college/college-sidebar';

export const metadata = {
    title: "Dean's Portal – LearnHub",
    description: 'Manage teachers, students, and courses across the entire platform',
};

const DEAN_EMAIL = 'abhigyankumar268@gmail.com';

export default async function CollegeLayout({ children }) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role')
        .eq('clerk_user_id', userId)
        .single();

    // No profile or not admin → redirect to homepage (college dashboard is admin-only)
    if (profileError || !profile) redirect('/');
    const isAdmin = profile.email === DEAN_EMAIL;
    if (!isAdmin) redirect('/');

    return (
        <div className="min-h-screen gradient-mesh-amber text-white flex relative overflow-hidden">
            {/* Floating particles — amber themed */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {Array.from({ length: 25 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-amber-400 particle-float"
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

            <CollegeSidebar dean={profile} />
            <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64 relative z-10">
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
