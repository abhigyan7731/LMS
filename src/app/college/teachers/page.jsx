import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { GraduationCap, BookOpen, Users, TrendingUp, Search } from 'lucide-react';

export const metadata = {
    title: "Teachers – Dean's Portal",
};

export default async function CollegeTeachersPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();

    // All teachers
    const { data: teachers } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, created_at')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });

    const teacherIds = teachers?.map((t) => t.id) ?? [];
    const teacherStats = {};

    if (teacherIds.length > 0) {
        const { data: allCourses } = await supabase
            .from('courses')
            .select('id, teacher_id, is_published, title')
            .in('teacher_id', teacherIds);

        const courseIds = allCourses?.map((c) => c.id) ?? [];

        let enrollData = [];
        if (courseIds.length > 0) {
            const { data } = await supabase
                .from('enrollments')
                .select('course_id')
                .in('course_id', courseIds);
            enrollData = data ?? [];
        }

        for (const id of teacherIds) {
            const courses = allCourses?.filter((c) => c.teacher_id === id) ?? [];
            const courseIdSet = new Set(courses.map((c) => c.id));
            teacherStats[id] = {
                courses: courses.length,
                published: courses.filter((c) => c.is_published).length,
                students: enrollData.filter((e) => courseIdSet.has(e.course_id)).length,
            };
        }
    }

    const totalTeachers = teachers?.length ?? 0;
    const totalPublished = Object.values(teacherStats).reduce((a, s) => a + s.published, 0);
    const totalStudents = Object.values(teacherStats).reduce((a, s) => a + s.students, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Teachers</h1>
                </div>
                <p className="text-white/50 mt-1 ml-10">All faculty members on the platform</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Faculty', value: totalTeachers, icon: GraduationCap, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { label: 'Published Courses', value: totalPublished, icon: BookOpen, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10 border-violet-500/20' },
                    { label: 'Students Taught', value: totalStudents, icon: Users, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 border-blue-500/20' },
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
                    <h2 className="text-sm font-semibold text-white">All Faculty Members</h2>
                    <span className="text-xs text-white/40">{totalTeachers} total</span>
                </div>

                {teachers && teachers.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {/* Header row */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">
                            <div className="col-span-5">Teacher</div>
                            <div className="col-span-2 text-center">Courses</div>
                            <div className="col-span-2 text-center">Published</div>
                            <div className="col-span-2 text-center">Students</div>
                            <div className="col-span-1 text-center">Joined</div>
                        </div>
                        {teachers.map((teacher) => {
                            const ts = teacherStats[teacher.id] ?? { courses: 0, published: 0, students: 0 };
                            const initials = teacher.full_name
                                ? teacher.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                                : '??';
                            const joinDate = new Date(teacher.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                            });

                            return (
                                <div
                                    key={teacher.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors"
                                >
                                    {/* Teacher info */}
                                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-300 overflow-hidden">
                                            {teacher.avatar_url
                                                ? <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover" />
                                                : initials}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{teacher.full_name ?? 'Unnamed Teacher'}</p>
                                            <p className="text-xs text-white/40 truncate">{teacher.email}</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-sm font-semibold text-white">{ts.courses}</span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ts.published > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                                            {ts.published}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="text-sm font-semibold text-blue-300">{ts.students}</span>
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <span className="text-xs text-white/30">{joinDate}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40">No teachers registered yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
