import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import { Plus, BookOpen, Video, Users, Edit3, Eye, Globe, Lock } from 'lucide-react';

export const metadata = { title: 'My Courses – Teacher Portal' };

export default async function TeacherCoursesPage() {
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
        .select('id, title, slug, is_published, price, thumbnail_url, description, created_at')
        .eq('teacher_id', profile.id)
        .order('created_at', { ascending: false });

    // Fetch chapter counts and enrollment counts for each course
    const courseIds = courses?.map((c) => c.id) ?? [];

    let chapterCounts = {};
    let enrollmentCounts = {};

    if (courseIds.length > 0) {
        const { data: chaptersData } = await supabase
            .from('chapters')
            .select('course_id')
            .in('course_id', courseIds);

        const { data: enrollmentsData } = await supabase
            .from('enrollments')
            .select('course_id')
            .in('course_id', courseIds);

        (chaptersData ?? []).forEach((ch) => {
            chapterCounts[ch.course_id] = (chapterCounts[ch.course_id] ?? 0) + 1;
        });
        (enrollmentsData ?? []).forEach((en) => {
            enrollmentCounts[en.course_id] = (enrollmentCounts[en.course_id] ?? 0) + 1;
        });
    }

    const publishedCount = courses?.filter((c) => c.is_published).length ?? 0;
    const draftCount = (courses?.length ?? 0) - publishedCount;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Courses</h1>
                    <p className="text-white/40 text-sm mt-1">
                        {courses?.length ?? 0} total · {publishedCount} published · {draftCount} drafts
                    </p>
                </div>
                <Link
                    href="/teacher/courses/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25 w-fit"
                >
                    <Plus className="w-4 h-4" />
                    New Course
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['All', 'Published', 'Drafts'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === 'All'
                                ? 'bg-violet-600 text-white'
                                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Courses Grid */}
            {courses && courses.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {/* Add New Card */}
                    <Link
                        href="/teacher/courses/new"
                        className="rounded-2xl border-2 border-dashed border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-200 flex flex-col items-center justify-center p-10 gap-3 group min-h-[260px]"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                            <Plus className="w-7 h-7 text-white/30 group-hover:text-violet-400 transition-colors" />
                        </div>
                        <p className="text-white/40 group-hover:text-violet-400 font-medium text-sm transition-colors">Create New Course</p>
                    </Link>

                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-200 flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex-shrink-0 overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <BookOpen className="w-10 h-10 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                                {/* Status badge */}
                                <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${course.is_published
                                        ? 'bg-emerald-500/90 text-white'
                                        : 'bg-yellow-500/90 text-black'
                                    }`}>
                                    {course.is_published ? (
                                        <><Globe className="w-3 h-3" /> Published</>
                                    ) : (
                                        <><Lock className="w-3 h-3" /> Draft</>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-semibold text-white line-clamp-1 mb-1">{course.title}</h3>
                                <p className="text-xs text-white/40 line-clamp-2 mb-3 flex-1">
                                    {course.description || 'No description'}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Video className="w-3 h-3" />
                                        {chapterCounts[course.id] ?? 0} lectures
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {enrollmentCounts[course.id] ?? 0} students
                                    </span>
                                    <span className="ml-auto font-semibold text-white/70">${course.price}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/teacher/courses/${course.id}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 text-xs font-medium transition-colors"
                                    >
                                        <Edit3 className="w-3 h-3" /> Manage
                                    </Link>
                                    {course.slug && (
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 text-xs font-medium transition-colors"
                                        >
                                            <Eye className="w-3 h-3" /> Preview
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
                    <p className="text-white/40 text-sm mb-6">Create your first course and start teaching!</p>
                    <Link
                        href="/teacher/courses/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create Your First Course
                    </Link>
                </div>
            )}
        </div>
    );
}
