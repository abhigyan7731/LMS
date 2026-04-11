import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import {
    BookOpen, Users, TrendingUp, Clock,
    ArrowRight, GraduationCap, Award, BarChart3,
    PlayCircle, Target, Sparkles, Brain
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
    let completedCount = 0;

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

        completedCount = progressData?.filter((p) => p.is_completed)?.length ?? 0;
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
            glow: 'glow-border-blue',
            glowColor: 'shadow-glow-blue',
        },
        {
            label: 'Overall Progress',
            value: `${totalProgress}%`,
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            glow: 'glow-border-emerald',
            glowColor: 'shadow-glow-emerald',
        },
        {
            label: 'Completed Chapters',
            value: completedCount,
            icon: Award,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
            glow: 'glow-border-violet',
            glowColor: 'shadow-glow-violet',
        },
        {
            label: 'Hours Learned',
            value: '0h',
            icon: Clock,
            color: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
            glow: 'glow-border-amber',
            glowColor: 'shadow-glow-amber',
        },
    ];

    // SVG Progress Ring helper
    const ringSize = 72;
    const ringStroke = 5;
    const ringRadius = (ringSize - ringStroke) / 2;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference - (totalProgress / 100) * ringCircumference;

    return (
        <div className="min-h-screen gradient-mesh-blue text-white relative overflow-hidden">
            {/* Floating particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {Array.from({ length: 20 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-blue-400 particle-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            opacity: Math.random() * 0.4 + 0.1,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${Math.random() * 6 + 6}s`,
                        }}
                    />
                ))}
            </div>

            {/* Perspective grid */}
            <div className="fixed inset-0 perspective-grid pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
                {/* 3D Holographic Header */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-600/5 to-blue-600/10 backdrop-blur-xl p-6 sm:p-8 tilt-in" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Scan line */}
                    <div className="absolute inset-0 holo-scanline pointer-events-none" />
                    <div className="absolute inset-0 holo-shimmer pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-glow-blue depth-breathe">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white" style={{ transform: 'translateZ(15px)' }}>
                                    Welcome back, {profile.full_name?.split(' ')[0] ?? 'Student'}! 👋
                                </h1>
                            </div>
                            <p className="text-white/40 mt-1 ml-12" style={{ transform: 'translateZ(5px)' }}>Your learning dashboard</p>
                        </div>
                        <Link
                            href="/courses"
                            className="btn-3d flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 w-fit"
                        >
                            <BookOpen className="w-4 h-4" />
                            Browse Courses
                        </Link>
                    </div>
                </div>

                {/* 3D Floating Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div
                            key={stat.label}
                            className={`rounded-2xl border p-5 ${stat.bg} backdrop-blur-sm card-3d ${stat.glow} tilt-in`}
                            style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-white/50 uppercase tracking-wider" style={{ transform: 'translateZ(5px)' }}>{stat.label}</span>
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg depth-breathe`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white" style={{ transform: 'translateZ(10px)' }}>{stat.value}</div>
                            {/* Orbiting ring on hover */}
                            <div className={`absolute -inset-0.5 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 orbit-ring transition-opacity`} />
                        </div>
                    ))}
                </div>

                {/* Main content — 3D Depth */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Enrolled Courses — 3D Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                My Courses
                            </h2>
                            <Link href="/courses" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all hover:translate-x-1">
                                Browse all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        {enrolledCourses.length > 0 ? (
                            <div className="space-y-3">
                                {enrolledCourses.map((course, idx) => (
                                    <Link
                                        key={course.id}
                                        href={`/courses/${course.slug || course.id}`}
                                        className="flex items-center gap-4 p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                        style={{ animationDelay: `${idx * 0.06}s`, transformStyle: 'preserve-3d' }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex-shrink-0 overflow-hidden shadow-lg" style={{ transform: 'translateZ(10px)' }}>
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen className="w-6 h-6 text-blue-400 m-3" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0" style={{ transform: 'translateZ(5px)' }}>
                                            <p className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">{course.title}</p>
                                            <p className="text-sm text-white/40">{course.category ?? 'Course'}</p>
                                        </div>
                                        <PlayCircle className="w-5 h-5 text-white/20 group-hover:text-blue-400 flex-shrink-0 transition-all group-hover:scale-110" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center glass-card">
                                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3 depth-breathe" />
                                <p className="text-white/40 mb-4">You haven't enrolled in any courses yet.</p>
                                <Link
                                    href="/courses"
                                    className="btn-3d inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl shadow-glow-blue"
                                >
                                    <BookOpen className="w-4 h-4" /> Browse Courses
                                </Link>
                            </div>
                        )}

                        {/* Available Courses — 3D Grid */}
                        {availableCourses.length > 0 && (
                            <div className="space-y-4 mt-6">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    Recommended For You
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {availableCourses.slice(0, 4).map((course, idx) => (
                                        <Link
                                            key={course.id}
                                            href={`/courses/${course.slug || course.id}`}
                                            className="p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                            style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-lg" style={{ transform: 'translateZ(8px)' }}>
                                                    <BookOpen className="w-5 h-5 text-cyan-400" />
                                                </div>
                                                <div className="min-w-0" style={{ transform: 'translateZ(4px)' }}>
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

                    {/* Right Sidebar — Quick Actions + 3D Progress */}
                    <div className="space-y-4">
                        {/* 3D Progress Ring */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center glass-card glow-border-blue tilt-in">
                            <h3 className="text-sm font-semibold text-white/60 mb-4">Overall Progress</h3>
                            <div className="flex justify-center mb-3">
                                <div className="relative inline-flex items-center justify-center" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))' }}>
                                    <svg width={ringSize} height={ringSize} className="transform -rotate-90">
                                        <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={ringStroke} />
                                        <circle
                                            cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none"
                                            stroke="#3b82f6" strokeWidth={ringStroke}
                                            strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-white">{totalProgress}%</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-white/30">{completedCount} chapters completed</p>
                        </div>

                        {/* Quick Actions — 3D */}
                        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                        <div className="space-y-3">
                            {[
                                { href: '/student/skill-quiz', icon: Brain, label: 'AI Skill Quiz', desc: 'Test knowledge & get course recs', color: 'text-violet-400' },
                                { href: '/courses', icon: BookOpen, label: 'Browse Courses', desc: 'Explore our course catalog', color: 'text-blue-400' },
                                { href: '/dashboard', icon: BarChart3, label: 'View Progress', desc: 'Track your learning journey', color: 'text-emerald-400' },
                                { href: '/courses', icon: Target, label: 'Continue Learning', desc: 'Pick up where you left off', color: 'text-violet-400' },
                            ].map((action, idx) => (
                                <Link
                                    key={action.href + action.label}
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

                        {/* AI Skill Quiz — Promo Card */}
                        <Link href="/student/skill-quiz" className="block group rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-5 backdrop-blur-sm glow-border-violet relative overflow-hidden hover:border-violet-500/40 transition-all">
                            <div className="absolute inset-0 holo-shimmer pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg depth-breathe">
                                        <Brain className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">AI Skill Assessment</h3>
                                </div>
                                <p className="text-xs text-white/40 mb-3">Take an AI quiz to discover your skill level and get personalized course recommendations</p>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
                                    Start Quiz <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>

                        {/* Learning Goals — 3D Holographic */}
                        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-5 backdrop-blur-sm glow-border-blue relative overflow-hidden">
                            <div className="absolute inset-0 holo-shimmer pointer-events-none" />
                            <div className="relative z-10">
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
        </div>
    );
}
