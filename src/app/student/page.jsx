import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import {
    BookOpen, Users, TrendingUp, Clock,
    ArrowRight, GraduationCap, Award, BarChart3,
    PlayCircle, Target
} from 'lucide-react';

export default async function StudentPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    const studentId = profile.id;

    // Fetch enrolled courses
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, created_at')
        .eq('user_id', studentId)
        .order('created_at', { ascending: false });

    const courseIds = enrollments?.map((e) => e.course_id) ?? [];
    let enrolledCourses = [];
    let totalProgress = 0;

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from('courses')
            .select('id, title, slug, thumbnail_url, price, category')
            .in('id', courseIds.slice(0, 10));

        enrolledCourses = courses ?? [];

        // Get progress for enrolled courses
        const { data: progressData } = await supabase
            .from('progress')
            .select('chapter_id, is_completed')
            .eq('user_id', studentId);

        const completedCount = progressData?.filter((p) => p.is_completed)?.length ?? 0;
        const totalChaptersTracked = progressData?.length ?? 0;
        totalProgress = totalChaptersTracked > 0 ? Math.round((completedCount / totalChaptersTracked) * 100) : 0;
    }

    // Fetch available courses (not enrolled)
    const { data: allCourses } = await supabase
        .from('courses')
        .select('id, title, slug, thumbnail_url, price, category')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

    const availableCourses = (allCourses ?? []).filter(
        (c) => !courseIds.includes(c.id)
    );

    const stats = [
        {
            label: 'Enrolled Courses',
            value: courseIds.length,
            icon: BookOpen,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
        },
        {
            label: 'Overall Progress',
            value: `${totalProgress}%`,
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            label: 'Completed Chapters',
            value: 0,
            icon: Award,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
        },
        {
            label: 'Hours Learned',
            value: '0h',
            icon: Clock,
            color: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back, {profile.full_name?.split(' ')[0] ?? 'Student'}! 👋
                            </h1>
                        </div>
                        <p className="text-white/50 mt-1 ml-10">Your learning dashboard</p>
                    </div>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit"
                    >
                        <BookOpen className="w-4 h-4" />
                        Browse Courses
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`rounded-2xl border p-5 ${stat.bg} backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{stat.label}</span>
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Enrolled Courses */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">My Courses</h2>
                            <Link href="/courses" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                Browse all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        {enrolledCourses.length > 0 ? (
                            <div className="space-y-3">
                                {enrolledCourses.map((course) => (
                                    <Link
                                        key={course.id}
                                        href={`/courses/${course.slug || course.id}`}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-200 group"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex-shrink-0 overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen className="w-6 h-6 text-blue-400 m-3" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">{course.title}</p>
                                            <p className="text-sm text-white/40">{course.category ?? 'Course'}</p>
                                        </div>
                                        <PlayCircle className="w-5 h-5 text-white/20 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                                <p className="text-white/40 mb-4">You haven't enrolled in any courses yet.</p>
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
                                >
                                    <BookOpen className="w-4 h-4" /> Browse Courses
                                </Link>
                            </div>
                        )}

                        {/* Available Courses */}
                        {availableCourses.length > 0 && (
                            <div className="space-y-4 mt-6">
                                <h2 className="text-lg font-semibold text-white">Recommended For You</h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {availableCourses.slice(0, 4).map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/courses/${course.slug || course.id}`}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200 group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-5 h-5 text-cyan-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white text-sm truncate group-hover:text-cyan-300 transition-colors">{course.title}</p>
                                                    <p className="text-xs text-white/40 mt-1">{course.category ?? 'Course'} · ${course.price ?? 0}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                        <div className="space-y-3">
                            {[
                                { href: '/courses', icon: BookOpen, label: 'Browse Courses', desc: 'Explore our course catalog', color: 'text-blue-400' },
                                { href: '/dashboard', icon: BarChart3, label: 'View Progress', desc: 'Track your learning journey', color: 'text-emerald-400' },
                                { href: '/courses', icon: Target, label: 'Continue Learning', desc: 'Pick up where you left off', color: 'text-violet-400' },
                            ].map((action) => (
                                <Link
                                    key={action.href + action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <action.icon className={`w-4 h-4 ${action.color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white group-hover:text-white/90">{action.label}</p>
                                        <p className="text-xs text-white/40 truncate">{action.desc}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto flex-shrink-0 transition-colors" />
                                </Link>
                            ))}
                        </div>

                        {/* Learning streak */}
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="w-4 h-4 text-blue-400" />
                                <h3 className="text-sm font-semibold text-white">Learning Goals</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Courses enrolled', value: courseIds.length },
                                    { label: 'Overall progress', value: `${totalProgress}%` },
                                    { label: 'Keep going!', value: '🔥' },
                                ].map((m) => (
                                    <div key={m.label} className="flex items-center justify-between">
                                        <span className="text-xs text-white/40">{m.label}</span>
                                        <span className="text-sm font-bold text-blue-300">{m.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
