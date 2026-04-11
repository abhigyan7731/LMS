import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import {
    BookOpen, Users, DollarSign, TrendingUp,
    Plus, ArrowRight, Video, Clock, Star, Upload, UserCheck, Sparkles
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
            glow: 'glow-border-blue',
        },
        {
            label: 'Revenue Earned',
            value: `$${revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            glow: 'glow-border-emerald',
        },
        {
            label: 'Published Courses',
            value: publishedCount,
            icon: BookOpen,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
            glow: 'glow-border-violet',
        },
        {
            label: 'Total Lectures',
            value: totalChapters,
            icon: Video,
            color: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
            glow: 'glow-border-amber',
        },
    ];

    return (
        <div className="space-y-8 relative">
            {/* 3D Holographic Header */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-indigo-600/10 backdrop-blur-xl p-6 sm:p-8 tilt-in" style={{ transformStyle: 'preserve-3d' }}>
                {/* Scan line */}
                <div className="absolute inset-0 holo-scanline pointer-events-none" />
                <div className="absolute inset-0 holo-shimmer pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                            <h1 className="text-3xl font-bold text-white" style={{ transform: 'translateZ(15px)' }}>
                                Welcome back, {profile.full_name?.split(' ')[0] ?? 'Teacher'}! 👋
                            </h1>
                        </div>
                        <p className="text-white/40 mt-1 ml-7" style={{ transform: 'translateZ(5px)' }}>Here's an overview of your teaching activity</p>
                    </div>
                    <Link
                        href="/teacher/courses/new"
                        className="btn-3d flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 w-fit"
                    >
                        <Plus className="w-4 h-4" />
                        Create Course
                    </Link>
                </div>
            </div>

            {/* 3D Floating Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div
                        key={stat.label}
                        className={`rounded-2xl border p-5 ${stat.bg} backdrop-blur-sm card-3d ${stat.glow} tilt-in group`}
                        style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-white/50 uppercase tracking-wider" style={{ transform: 'translateZ(5px)' }}>{stat.label}</span>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg depth-breathe`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white" style={{ transform: 'translateZ(10px)' }}>{stat.value}</div>
                        {/* Orbit ring hover */}
                        <div className="absolute -inset-0.5 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 orbit-ring transition-opacity" />
                    </div>
                ))}
            </div>

            {/* Revenue Growth Visual — 3D CSS Bar Chart */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 glass-card glow-border-emerald tilt-in">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Revenue Overview</h3>
                </div>
                <div className="flex items-end gap-2 h-24">
                    {[35, 52, 41, 67, 58, 73, 85, 62, 78, 91, 68, revenue > 0 ? 100 : 45].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600/60 to-emerald-400/30 transition-all duration-500 hover:from-emerald-500/80 hover:to-emerald-300/50"
                                style={{
                                    height: `${val}%`,
                                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.2)',
                                    animationDelay: `${i * 0.05}s`,
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-white/25">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
            </div>

            {/* Courses Overview — 3D Cards */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            Your Courses
                        </h2>
                        <Link href="/teacher/courses" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-all hover:translate-x-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {courses && courses.length > 0 ? (
                        <div className="space-y-3">
                            {courses.slice(0, 5).map((course, idx) => (
                                <Link
                                    key={course.id}
                                    href={`/teacher/courses/${course.id}`}
                                    className="flex items-center gap-4 p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                    style={{ animationDelay: `${idx * 0.06}s`, transformStyle: 'preserve-3d' }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 flex-shrink-0 overflow-hidden shadow-lg" style={{ transform: 'translateZ(10px)' }}>
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="w-6 h-6 text-violet-400 m-3" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0" style={{ transform: 'translateZ(5px)' }}>
                                        <p className="font-medium text-white truncate group-hover:text-violet-300 transition-colors">{course.title}</p>
                                        <p className="text-sm text-white/40">${course.price} · {new Date(course.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                        course.is_published
                                            ? 'bg-emerald-500/20 text-emerald-400 glow-border-emerald'
                                            : 'bg-yellow-500/20 text-yellow-400 glow-border-amber'
                                    }`} style={{ transform: 'translateZ(8px)' }}>
                                        {course.is_published ? '● Published' : '○ Draft'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center glass-card">
                            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3 depth-breathe" />
                            <p className="text-white/40 mb-4">No courses yet. Create your first course!</p>
                            <Link
                                href="/teacher/courses/new"
                                className="btn-3d inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-xl shadow-glow-violet"
                            >
                                <Plus className="w-4 h-4" /> New Course
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions — 3D Side Panel */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { href: '/teacher/courses/new', icon: Plus, label: 'Create New Course', desc: 'Build a new course from scratch', color: 'text-violet-400' },
                            { href: '/teacher/courses', icon: BookOpen, label: 'Manage Courses', desc: `${courses?.length ?? 0} courses · ${draftCount} drafts`, color: 'text-blue-400' },
                            { href: '/teacher/students', icon: Users, label: 'View Students', desc: `${studentsCount} enrolled students`, color: 'text-emerald-400' },
                            { href: '/teacher/upload', icon: Upload, label: 'Upload Lecture', desc: 'Add video content to courses', color: 'text-orange-400' },
                        ].map((action, idx) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-3 p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                style={{ animationDelay: `${idx * 0.06}s`, transformStyle: 'preserve-3d' }}
                            >
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors" style={{ transform: 'translateZ(8px)' }}>
                                    <action.icon className={`w-4 h-4 ${action.color}`} />
                                </div>
                                <div className="min-w-0" style={{ transform: 'translateZ(4px)' }}>
                                    <p className="text-sm font-medium text-white group-hover:text-white/90">{action.label}</p>
                                    <p className="text-xs text-white/40 truncate">{action.desc}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto flex-shrink-0 transition-all group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </div>

                    {/* Teaching Stats — 3D Holographic */}
                    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-5 backdrop-blur-sm glow-border-violet relative overflow-hidden">
                        <div className="absolute inset-0 holo-shimmer pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 text-violet-400" />
                                <h3 className="text-sm font-semibold text-white">Teaching Stats</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Published courses', value: publishedCount },
                                    { label: 'Draft courses', value: draftCount },
                                    { label: 'Total lectures', value: totalChapters },
                                    { label: 'Total students', value: studentsCount },
                                ].map((m) => (
                                    <div key={m.label} className="flex items-center justify-between">
                                        <span className="text-xs text-white/40">{m.label}</span>
                                        <span className="text-sm font-bold text-violet-300">{m.value}</span>
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
