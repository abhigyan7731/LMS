import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { notFound } from 'next/navigation';
import { LearnView } from '@/components/learn/learn-view';

export default async function LearnPage({ params }) {
  const { slug } = await params;
  const { userId } = await auth();
  const DEAN_EMAIL = 'abhigyankumar268@gmail.com';

  const supabase = createAdminClient();
  const { data: profile } = userId
    ? await supabase
        .from('profiles')
        .select('id, email')
        .eq('clerk_user_id', userId)
        .single()
    : { data: null };

  let courseQuery = supabase
    .from('courses')
    .select('*')
    .eq('slug', slug);

  const isDean = profile?.email === DEAN_EMAIL;
  if (isDean) {
    // dean can access any course for review/testing
  } else if (profile?.id) {
    // allow teacher to access own draft course in learn mode
    courseQuery = courseQuery.or(`is_published.eq.true,teacher_id.eq.${profile.id}`);
  } else {
    courseQuery = courseQuery.eq('is_published', true);
  }

  const { data: course } = await courseQuery.single();

  if (!course) notFound();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', course.id)
    .order('position');

  let enrollmentId = null;
  const progressMap = {};

  if (profile?.id) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', profile.id)
      .eq('course_id', course.id)
      .single();
    enrollmentId = enrollment?.id ?? null;

    if (enrollmentId) {
      const { data: progress } = await supabase
        .from('progress')
        .select('chapter_id, completed')
        .eq('enrollment_id', enrollmentId);
      progress?.forEach((p) => {
        progressMap[p.chapter_id] = p.completed;
      });
    }
  }

  return (
    <LearnView
      course={course}
      chapters={chapters ?? []}
      enrollmentId={enrollmentId}
      progressMap={progressMap}
      isEnrolled={!!enrollmentId}
      profileId={profile?.id ?? null}
    />
  );
}
