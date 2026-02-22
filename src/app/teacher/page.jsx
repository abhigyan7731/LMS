import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import {
    BookOpen, Users, DollarSign, TrendingUp,
    Plus, ArrowRight, Video, Clock, Star
} from 'lucide-react';

export default async function TeacherPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    const teacherId = profile.id;

    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, slug, is_published, price, thumbnail_url, created_at')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

    const courseIds = courses?.map((c) => c.id) ?? [];
    let studentsCount = 0;
    let revenue = 0;
    let totalChapters = 0;

    if (courseIds.length > 0) {
        const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .in('course_id', courseIds);
        studentsCount = count ?? 0;

        const { data: coursePrices } = await supabase
            .from('courses')
            .select('id, price')
            .in('id', courseIds);

        const { data: enrollmentsData } = await supabase
            .from('enrollments')
            .select('course_id')
            .in('course_id', courseIds);

        const priceMap = new Map((coursePrices ?? []).map((c) => [c.id, Number(c.price) ?? 0]));
        revenue = (enrollmentsData ?? []).reduce((acc, e) => acc + (priceMap.get(e.course_id) ?? 0), 0);

        const { count: chaptersCount } = await supabase
            .from('chapters')
            .select('*', { count: 'exact', head: true })
            .in('course_id', courseIds);
        totalChapters = chaptersCount ?? 0;
    }

    const publishedCount = courses?.filter((c) => c.is_published).length ?? 0;
    const draftCount = (courses?.length ?? 0) - publishedCount;

    const stats = [
        {
            label: 'Total Students',
            value: studentsCount.toLocaleString(),
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
        },
        {
            label: 'Revenue Earned',
            value: `$${revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
        },
        {
            label: 'Published Courses',
            value: publishedCount,
            icon: BookOpen,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
        },
        {
            label: 'Total Lectures',
            value: totalChapters,
            icon: Video,
            color: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, {profile.full_name?.split(' ')[0] ?? 'Teacher'}! 👋
                    </h1>
                    <p className="text-white/50 mt-1">Here's an overview of your teaching activity</p>
                </div>
                <Link
                    href="/teacher/courses/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    Create Course
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

            {/* Courses Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Your Courses</h2>
                        <Link href="/teacher/courses" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {courses && courses.length > 0 ? (
                        <div className="space-y-3">
                            {courses.slice(0, 5).map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/teacher/courses/${course.id}`}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-200 group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex-shrink-0 overflow-hidden">
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="w-6 h-6 text-violet-400 m-3" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate group-hover:text-violet-300 transition-colors">{course.title}</p>
                                        <p className="text-sm text-white/40">${course.price} · {new Date(course.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${course.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {course.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40 mb-4">No courses yet. Create your first course!</p>
                            <Link
                                href="/teacher/courses/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-500 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> New Course
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { href: '/teacher/courses/new', icon: Plus, label: 'Create New Course', desc: 'Build a new course from scratch', color: 'text-violet-400' },
                            { href: '/teacher/courses', icon: BookOpen, label: 'Manage Courses', desc: `${courses?.length ?? 0} courses · ${draftCount} drafts`, color: 'text-blue-400' },
                            { href: '/teacher/students', icon: Users, label: 'View Students', desc: `${studentsCount} enrolled students`, color: 'text-emerald-400' },
                        ].map((action) => (
                            <Link
                                key={action.href}
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
                </div>
            </div>
        </div>
    );
}
