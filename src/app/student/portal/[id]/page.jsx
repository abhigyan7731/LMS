import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import { BookOpen, Users, ArrowRight, GraduationCap } from 'lucide-react';

export default async function StudentPortalById({ params }) {
    const { id } = params; // student profile id

    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();

    // current user profile (to check role)
    const { data: currentProfile, error: currentProfileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('clerk_user_id', userId)
        .single();

    if (currentProfileError || !currentProfile) redirect('/onboarding');

    const allowedRoles = ['teacher', 'dean'];
    const isOwner = currentProfile.id === id;
    const isAllowedRole = allowedRoles.includes(currentProfile.role);

    if (!isOwner && !isAllowedRole) redirect('/');

    // Load the student profile
    const { data: studentProfile } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, created_at, role')
        .eq('id', id)
        .single();

    if (!studentProfile) return (<div className="p-8">Student not found</div>);

    // Get student's enrollments and courses
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at')
        .eq('student_id', id)
        .order('enrolled_at', { ascending: false });

    const courseIds = enrollments?.map(e => e.course_id) ?? [];
    const { data: courses } = courseIds.length > 0
        ? await supabase.from('courses').select('id, title, slug').in('id', courseIds)
        : { data: [] };

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{studentProfile.full_name}</h1>
                            <p className="text-sm text-white/50">{studentProfile.email} · Role: {studentProfile.role ?? 'student'}</p>
                        </div>
                    </div>
                    <div>
                        <Link href="/students" className="text-sm text-blue-400 hover:underline">Back</Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-semibold text-white">Enrolled Courses</h2>

                        {courses && courses.length > 0 ? (
                            <div className="space-y-3">
                                {courses.map((c) => (
                                    <Link key={c.id} href={`/courses/${c.slug || c.id}`} className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-white">{c.title}</p>
                                                <p className="text-xs text-white/40">{c.slug ?? c.id}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-white/30" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                <p className="text-white/40">This student is not enrolled in any courses yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border p-4 bg-white/5">
                            <h3 className="text-sm font-semibold text-white mb-2">Student Info</h3>
                            <div className="text-sm text-white/40">
                                <div>Joined: {studentProfile.created_at ? new Date(studentProfile.created_at).toLocaleDateString() : '—'}</div>
                                <div className="mt-2">Total Courses: {courses?.length ?? 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
