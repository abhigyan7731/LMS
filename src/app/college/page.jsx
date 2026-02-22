import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import {
    Users, BookOpen, GraduationCap, TrendingUp,
    ArrowRight, School, BarChart3, Award
} from 'lucide-react';

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
            href: '/college/teachers',
        },
        {
            label: 'Total Students',
            value: (totalStudents ?? 0).toLocaleString(),
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
            href: '/college/students',
        },
        {
            label: 'Total Courses',
            value: (totalCourses ?? 0).toLocaleString(),
            icon: BookOpen,
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
            href: '/college/courses',
        },
        {
            label: 'Total Enrollments',
            value: (totalEnrollments ?? 0).toLocaleString(),
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            href: '/college/students',
        },
    ];

    const quickActions = [
        { href: '/college/teachers', icon: GraduationCap, label: 'Manage Teachers', desc: `${totalTeachers ?? 0} faculty members`, color: 'text-amber-400' },
        { href: '/college/students', icon: Users, label: 'Manage Students', desc: `${totalStudents ?? 0} enrolled students`, color: 'text-blue-400' },
        { href: '/college/courses', icon: BookOpen, label: 'All Courses', desc: `${totalCourses ?? 0} courses on platform`, color: 'text-violet-400' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <School className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Dean's Overview</h1>
                    </div>
                    <p className="text-white/50 mt-1 ml-10">Platform-wide management dashboard</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-300">Administrator Access</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className={`rounded-2xl border p-5 ${stat.bg} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200 group`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-white/30 group-hover:text-white/50 transition-colors">
                            <span>View details</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Teachers */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Faculty</h2>
                        <Link href="/college/teachers" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentTeachers && recentTeachers.length > 0 ? (
                        <div className="space-y-3">
                            {recentTeachers.map((teacher) => {
                                const ts = teacherStats[teacher.id] ?? { courses: 0, published: 0, students: 0 };
                                const initials = teacher.full_name
                                    ? teacher.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                                    : '??';
                                return (
                                    <div
                                        key={teacher.id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-300">
                                            {teacher.avatar_url ? (
                                                <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{teacher.full_name ?? 'Unnamed'}</p>
                                            <p className="text-sm text-white/40 truncate">{teacher.email}</p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-4 text-xs text-white/40 flex-shrink-0">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />{ts.courses} courses
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />{ts.students} students
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                            <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40">No teachers registered yet.</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action) => (
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

                    {/* Platform health */}
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-5">
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
    );
}
