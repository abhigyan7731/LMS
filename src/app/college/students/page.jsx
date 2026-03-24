import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { Users, BookOpen, TrendingUp } from 'lucide-react';

export const metadata = {
    title: "Students – Dean's Portal",
};

export default async function CollegeStudentsPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();

    // All students
    const { data: students } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

    const studentIds = students?.map((s) => s.id) ?? [];
    const studentStats = {};

    if (studentIds.length > 0) {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('student_id, course_id')
            .in('student_id', studentIds);

        for (const id of studentIds) {
            studentStats[id] = {
                enrollments: enrollments?.filter((e) => e.student_id === id).length ?? 0,
            };
        }
    }

    const totalStudents = students?.length ?? 0;
    const totalEnrollments = Object.values(studentStats).reduce((a, s) => a + s.enrollments, 0);
    const activeStudents = Object.values(studentStats).filter((s) => s.enrollments > 0).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Students</h1>
                </div>
                <p className="text-white/50 mt-1 ml-10">All learners registered on the platform</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Students', value: totalStudents, icon: Users, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 border-blue-500/20' },
                    { label: 'Active Learners', value: activeStudents, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Total Enrollments', value: totalEnrollments, icon: BookOpen, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10 border-violet-500/20' },
                ].map((s) => (
                    <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{s.label}</span>
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                                <s.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{s.value.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">All Students</h2>
                    <span className="text-xs text-white/40">{totalStudents} total</span>
                </div>

                {students && students.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {/* Header row */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">
                            <div className="col-span-6">Student</div>
                            <div className="col-span-3 text-center">Enrollments</div>
                            <div className="col-span-3 text-center">Joined</div>
                        </div>
                        {students.map((student) => {
                            const ss = studentStats[student.id] ?? { enrollments: 0 };
                            const initials = student.full_name
                                ? student.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                                : '??';
                            const joinDate = new Date(student.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            });

                            return (
                                <div
                                    key={student.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors"
                                >
                                    {/* Student info */}
                                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-300 overflow-hidden">
                                            {student.avatar_url
                                                ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                                                : initials}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{student.full_name ?? 'Unnamed Student'}</p>
                                            <p className="text-xs text-white/40 truncate">{student.email}</p>
                                        </div>
                                    </div>

                                    {/* Enrollments */}
                                    <div className="col-span-3 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ss.enrollments > 0 ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-white/30'}`}>
                                            {ss.enrollments} {ss.enrollments === 1 ? 'course' : 'courses'}
                                        </span>
                                    </div>

                                    {/* Join date */}
                                    <div className="col-span-3 text-center">
                                        <span className="text-xs text-white/30">{joinDate}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40">No students registered yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
