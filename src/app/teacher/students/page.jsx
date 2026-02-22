import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Users, BookOpen, Calendar, Search } from 'lucide-react';

export const metadata = { title: 'Students – Teacher Portal' };

export default async function TeacherStudentsPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('teacher_id', profile.id);

    const courseIds = courses?.map((c) => c.id) ?? [];
    const courseMap = Object.fromEntries(courses?.map((c) => [c.id, c.title]) ?? []);

    const { data: enrollments } = courseIds.length
        ? await supabase
            .from('enrollments')
            .select('id, student_id, course_id, enrolled_at')
            .in('course_id', courseIds)
            .order('enrolled_at', { ascending: false })
        : { data: [] };

    const studentIds = [...new Set((enrollments ?? []).map((e) => e.student_id))];

    const { data: studentProfiles } = studentIds.length
        ? await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, created_at')
            .in('id', studentIds)
        : { data: [] };

    const profileMap = new Map((studentProfiles ?? []).map((p) => [p.id, p]));

    // Group enrollments by student
    const studentEnrollments = {};
    (enrollments ?? []).forEach((e) => {
        if (!studentEnrollments[e.student_id]) {
            studentEnrollments[e.student_id] = [];
        }
        studentEnrollments[e.student_id].push(e);
    });

    const totalEnrollments = enrollments?.length ?? 0;
    const uniqueStudents = studentIds.length;

    // Course enrollment stats
    const courseStats = courses?.map((c) => ({
        ...c,
        count: (enrollments ?? []).filter((e) => e.course_id === c.id).length,
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Student Management</h1>
                <p className="text-white/40 text-sm mt-1">
                    {uniqueStudents} unique students · {totalEnrollments} total enrollments
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Students', value: uniqueStudents, icon: Users, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 border-blue-500/20' },
                    { label: 'Total Enrollments', value: totalEnrollments, icon: BookOpen, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10 border-violet-500/20' },
                    { label: 'This Month', value: (enrollments ?? []).filter(e => new Date(e.enrolled_at) > new Date(Date.now() - 30 * 86400000)).length, icon: Calendar, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl border p-5 ${stat.bg}`}>
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

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Students Table */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Enrolled Students</h2>

                    {studentIds.length > 0 ? (
                        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-xs font-semibold text-white/30 uppercase tracking-wider">
                                <span>Student</span>
                                <span className="text-center">Courses</span>
                                <span>Joined</span>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-white/5">
                                {studentIds.map((studentId) => {
                                    const p = profileMap.get(studentId);
                                    const studentCourses = studentEnrollments[studentId] ?? [];
                                    const initials = (p?.full_name ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                                    return (
                                        <div key={studentId} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 hover:bg-white/5 transition-colors items-center">
                                            {/* Student Info */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                                    {p?.avatar_url ? (
                                                        <img src={p.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{p?.full_name ?? 'Unknown Student'}</p>
                                                    <p className="text-xs text-white/40 truncate">{p?.email ?? '—'}</p>
                                                </div>
                                            </div>

                                            {/* Course Count */}
                                            <div className="text-center">
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold">
                                                    {studentCourses.length}
                                                </span>
                                            </div>

                                            {/* Enrolled Date */}
                                            <span className="text-xs text-white/40 whitespace-nowrap">
                                                {studentCourses[0]?.enrolled_at
                                                    ? new Date(studentCourses[0].enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/40">No students enrolled yet</p>
                            <p className="text-white/25 text-sm mt-1">Publish a course to start getting students</p>
                        </div>
                    )}
                </div>

                {/* Course Performance */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">By Course</h2>
                    <div className="space-y-2">
                        {courseStats && courseStats.length > 0 ? courseStats.map((course) => (
                            <div key={course.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-sm font-medium text-white truncate mb-2">{course.title}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 bg-white/10 rounded-full h-1.5 mr-3">
                                        <div
                                            className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
                                            style={{ width: `${totalEnrollments > 0 ? (course.count / totalEnrollments) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-white/50 flex-shrink-0">{course.count} students</span>
                                </div>
                            </div>
                        )) : (
                            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                                <p className="text-white/30 text-sm">No courses yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
