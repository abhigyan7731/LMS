import { redirect, notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TeacherCourseEditor } from '@/components/teacher/teacher-course-editor';

export async function generateMetadata({ params }) {
    return { title: 'Manage Course – Teacher Portal' };
}

export default async function TeacherCourseDetailPage({ params }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('teacher_id', profile.id)
        .single();

    if (!course) notFound();

    const { data: chapters } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', id)
        .order('position');

    const { count: enrollmentCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/teacher/courses"
                    className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Courses
                </Link>
                <span className="text-white/20">/</span>
                <span className="text-sm text-white/60 truncate">{course.title}</span>
            </div>
            <TeacherCourseEditor
                course={course}
                chapters={chapters ?? []}
                enrollmentCount={enrollmentCount ?? 0}
            />
        </div>
    );
}
