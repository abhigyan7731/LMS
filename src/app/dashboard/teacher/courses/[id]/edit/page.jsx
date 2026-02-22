import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { CourseEditor } from '@/components/course/course-editor';

export default async function CourseEditPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('teacher_id', profile?.id)
    .single();

  if (!course) notFound();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', id)
    .order('position');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Edit Course: {course.title}</h1>
      <CourseEditor course={course} chapters={chapters ?? []} />
    </div>
  );
}
