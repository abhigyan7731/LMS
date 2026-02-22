import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';

export const metadata = {
    title: "All Courses – Dean's Portal",
};

export default async function CollegeCoursesPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();

    // All courses with teacher info
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, slug, is_published, price, created_at, thumbnail_url, teacher_id, profiles!courses_teacher_id_fkey(full_name, email)')
        .order('created_at', { ascending: false });

    const courseIds = courses?.map((c) => c.id) ?? [];
    const enrollCounts = {};

    if (courseIds.length > 0) {
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('course_id')
            .in('course_id', courseIds);

        for (const id of courseIds) {
            enrollCounts[id] = enrollments?.filter((e) => e.course_id === id).length ?? 0;
        }
    }

    const totalCourses = courses?.length ?? 0;
    const published = courses?.filter((c) => c.is_published).length ?? 0;
    const totalEnrollments = Object.values(enrollCounts).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">All Courses</h1>
                </div>
                <p className="text-white/50 mt-1 ml-10">Every course on the platform</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Courses', value: totalCourses, icon: BookOpen, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10 border-violet-500/20' },
                    { label: 'Published', value: published, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Total Enrollments', value: totalEnrollments, icon: Users, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 border-blue-500/20' },
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
                    <h2 className="text-sm font-semibold text-white">Course Catalogue</h2>
                    <span className="text-xs text-white/40">{totalCourses} total</span>
                </div>

                {courses && courses.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {/* Header row */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">
                            <div className="col-span-5">Course</div>
                            <div className="col-span-3">Teacher</div>
                            <div className="col-span-1 text-center">Price</div>
                            <div className="col-span-1 text-center">Students</div>
                            <div className="col-span-2 text-center">Status</div>
                        </div>
                        {courses.map((course) => {
                            const enrollCount = enrollCounts[course.id] ?? 0;
                            const teacher = course.profiles;

                            return (
                                <div
                                    key={course.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors"
                                >
                                    {/* Course */}
                                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {course.thumbnail_url
                                                ? <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                : <BookOpen className="w-4 h-4 text-violet-400" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{course.title}</p>
                                            <p className="text-xs text-white/30 truncate">/{course.slug}</p>
                                        </div>
                                    </div>

                                    {/* Teacher */}
                                    <div className="col-span-3 min-w-0">
                                        <p className="text-sm text-white/70 truncate">{teacher?.full_name ?? 'Unknown'}</p>
                                        <p className="text-xs text-white/30 truncate">{teacher?.email}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-1 text-center">
                                        <span className="text-sm font-semibold text-white">
                                            {Number(course.price) === 0 ? 'Free' : `$${Number(course.price).toFixed(0)}`}
                                        </span>
                                    </div>

                                    {/* Students */}
                                    <div className="col-span-1 text-center">
                                        <span className="text-sm text-blue-300 font-semibold">{enrollCount}</span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${course.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {course.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40">No courses on the platform yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
