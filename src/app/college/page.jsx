import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import {
    Users, BookOpen, GraduationCap, TrendingUp,
    ArrowRight, School, BarChart3, Award, Sparkles, Activity
} from 'lucide-react';
import { ActivityFeed } from '@/components/ui/3d-effects';

export default async function CollegePage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();

    // Fetch platform-wide stats
    const [
        { count: totalTeachers },
        { count: totalStudents },
        { count: totalCourses },
        { count: totalEnrollments },
        { data: recentTeachers },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, created_at')
            .eq('role', 'teacher')
            .order('created_at', { ascending: false })
            .limit(6),
    ]);

    // For each teacher, get their course/student counts
    const teacherIds = recentTeachers?.map((t) => t.id) ?? [];
    const teacherStats = {};

    if (teacherIds.length > 0) {
        const { data: teacherCourses } = await supabase
            .from('courses')
            .select('teacher_id, id, is_published')
            .in('teacher_id', teacherIds);

        for (const id of teacherIds) {
            const courses = teacherCourses?.filter((c) => c.teacher_id === id) ?? [];
            teacherStats[id] = {
                courses: courses.length,
                published: courses.filter((c) => c.is_published).length,
            };
        }

        const courseIds = teacherCourses?.map((c) => c.id) ?? [];
        if (courseIds.length > 0) {
            const { data: enrollData } = await supabase
                .from('enrollments')
                .select('course_id')
                .in('course_id', courseIds);

            for (const id of teacherIds) {
                const courses = teacherCourses?.filter((c) => c.teacher_id === id).map((c) => c.id) ?? [];
                teacherStats[id].students = enrollData?.filter((e) => courses.includes(e.course_id)).length ?? 0;
            }
        } else {
            for (const id of teacherIds) teacherStats[id].students = 0;
        }
    }

    const stats = [
        {
            label: 'Total Teachers',
            value: (totalTeachers ?? 0).toLocaleString(),
            icon: GraduationCap,
            color: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-500/10 border-amber-500/20',
            glow: 'glow-border-amber',
            href: '/college/teachers',
        },
        {
            label: 'Total Students',
            value: (totalStudents ?? 0).toLocaleString(),
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
            glow: 'glow-border-blue',
            href: '/college/students',
        },
        {
            label: 'Total Courses',
            value: (totalCourses ?? 0).toLocaleString(),
            icon: BookOpen,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
            glow: 'glow-border-violet',
            href: '/college/courses',
        },
        {
            label: 'Total Enrollments',
            value: (totalEnrollments ?? 0).toLocaleString(),
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            glow: 'glow-border-emerald',
            href: '/college/students',
        },
    ];

    const quickActions = [
        { href: '/college/teachers', icon: GraduationCap, label: 'Manage Teachers', desc: `${totalTeachers ?? 0} faculty members`, color: 'text-amber-400' },
        { href: '/college/students', icon: Users, label: 'Manage Students', desc: `${totalStudents ?? 0} enrolled students`, color: 'text-blue-400' },
        { href: '/college/courses', icon: BookOpen, label: 'All Courses', desc: `${totalCourses ?? 0} courses on platform`, color: 'text-violet-400' },
    ];

    return (
        <div className="space-y-8 relative">
            {/* 3D Holographic Header — Gold/Amber theme */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-600/10 via-orange-600/5 to-amber-600/10 backdrop-blur-xl p-6 sm:p-8 tilt-in" style={{ transformStyle: 'preserve-3d' }}>
                {/* Scan line */}
                <div className="absolute inset-0 holo-scanline pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(245,158,11,0.03) 45%, rgba(245,158,11,0.08) 50%, rgba(245,158,11,0.03) 55%, transparent 100%)' }} />
                <div className="absolute inset-0 holo-shimmer pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-glow-amber depth-breathe">
                                <School className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white" style={{ transform: 'translateZ(15px)' }}>Dean's Overview</h1>
                        </div>
                        <p className="text-white/40 mt-1 ml-12" style={{ transform: 'translateZ(5px)' }}>Platform-wide management dashboard</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm glow-border-amber">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-amber-300">Administrator Access</span>
                    </div>
                </div>
            </div>

            {/* 3D Floating Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className={`rounded-2xl border p-5 ${stat.bg} backdrop-blur-sm card-3d ${stat.glow} group tilt-in`}
                        style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-white/50 uppercase tracking-wider" style={{ transform: 'translateZ(5px)' }}>{stat.label}</span>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg depth-breathe`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white" style={{ transform: 'translateZ(10px)' }}>{stat.value}</div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-white/25 group-hover:text-white/50 transition-colors" style={{ transform: 'translateZ(5px)' }}>
                            <span>View details</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                        {/* Orbit ring on hover */}
                        <div className="absolute -inset-0.5 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 orbit-ring transition-opacity" />
                    </Link>
                ))}
            </div>

            {/* Platform Overview — 3D Visual */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 glass-card glow-border-amber tilt-in">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-white">Platform Distribution</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Teachers', value: totalTeachers ?? 0, pct: Math.min(100, ((totalTeachers ?? 0) / Math.max(1, (totalTeachers ?? 0) + (totalStudents ?? 0))) * 100), color: 'from-amber-500 to-orange-500', glow: 'rgba(245, 158, 11, 0.3)' },
                        { label: 'Students', value: totalStudents ?? 0, pct: Math.min(100, ((totalStudents ?? 0) / Math.max(1, (totalTeachers ?? 0) + (totalStudents ?? 0))) * 100), color: 'from-blue-500 to-cyan-500', glow: 'rgba(59, 130, 246, 0.3)' },
                        { label: 'Courses', value: totalCourses ?? 0, pct: 100, color: 'from-violet-500 to-purple-500', glow: 'rgba(139, 92, 246, 0.3)' },
                    ].map((item) => (
                        <div key={item.label} className="text-center">
                            <div className="relative mx-auto mb-3" style={{ width: 64, height: 64 }}>
                                <svg width={64} height={64} className="transform -rotate-90" style={{ filter: `drop-shadow(0 0 6px ${item.glow})` }}>
                                    <circle cx={32} cy={32} r={27} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
                                    <circle cx={32} cy={32} r={27} fill="none" stroke="url(#grad)" strokeWidth={4}
                                        strokeDasharray={2 * Math.PI * 27} strokeDashoffset={2 * Math.PI * 27 * (1 - item.pct / 100)}
                                        strokeLinecap="round" className={`bg-gradient-to-br ${item.color}`}
                                        style={{ stroke: item.label === 'Teachers' ? '#f59e0b' : item.label === 'Students' ? '#3b82f6' : '#8b5cf6' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                </div>
                            </div>
                            <span className="text-xs text-white/40">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Teachers — 3D Cards */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Recent Faculty
                        </h2>
                        <Link href="/college/teachers" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-all hover:translate-x-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentTeachers && recentTeachers.length > 0 ? (
                        <div className="space-y-3">
                            {recentTeachers.map((teacher, idx) => {
                                const ts = teacherStats[teacher.id] ?? { courses: 0, published: 0, students: 0 };
                                const initials = teacher.full_name
                                    ? teacher.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                                    : '??';
                                return (
                                    <div
                                        key={teacher.id}
                                        className="flex items-center gap-4 p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                        style={{ animationDelay: `${idx * 0.06}s`, transformStyle: 'preserve-3d' }}
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-300 shadow-lg relative" style={{ transform: 'translateZ(10px)' }}>
                                            {teacher.avatar_url ? (
                                                <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : initials}
                                            {/* Avatar glow ring */}
                                            <div className="absolute -inset-0.5 rounded-xl border border-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)' }} />
                                        </div>
                                        <div className="flex-1 min-w-0" style={{ transform: 'translateZ(5px)' }}>
                                            <p className="font-medium text-white truncate group-hover:text-amber-300 transition-colors">{teacher.full_name ?? 'Unnamed'}</p>
                                            <p className="text-sm text-white/40 truncate">{teacher.email}</p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-4 text-xs text-white/40 flex-shrink-0">
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                                <BookOpen className="w-3 h-3" />{ts.courses} courses
                                            </span>
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                                <Users className="w-3 h-3" />{ts.students} students
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center glass-card">
                            <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-3 depth-breathe" />
                            <p className="text-white/40">No teachers registered yet.</p>
                        </div>
                    )}
                </div>

                {/* Right Panel — Quick Actions + Activity Feed */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action, idx) => (
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

                    {/* Live Activity Feed — NEW FEATURE */}
                    <ActivityFeed />

                    {/* Platform Health — 3D Holographic */}
                    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5 backdrop-blur-sm glow-border-amber relative overflow-hidden">
                        <div className="absolute inset-0 holo-shimmer pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <BarChart3 className="w-4 h-4 text-amber-400" />
                                <h3 className="text-sm font-semibold text-white">Platform Health</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    {
                                        label: 'Avg. courses per teacher',
                                        value: totalTeachers ? ((totalCourses ?? 0) / totalTeachers).toFixed(1) : '0',
                                    },
                                    {
                                        label: 'Avg. enrollments per student',
                                        value: totalStudents ? ((totalEnrollments ?? 0) / totalStudents).toFixed(1) : '0',
                                    },
                                    {
                                        label: 'Avg. students per course',
                                        value: totalCourses ? ((totalEnrollments ?? 0) / totalCourses).toFixed(1) : '0',
                                    },
                                ].map((m) => (
                                    <div key={m.label} className="flex items-center justify-between">
                                        <span className="text-xs text-white/40">{m.label}</span>
                                        <span className="text-sm font-bold text-amber-300">{m.value}</span>
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
