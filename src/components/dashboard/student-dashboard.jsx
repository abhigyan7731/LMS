import { createAdminClient } from '@/lib/supabase/admin';
import { StudentDashboardUI } from './student-dashboard-ui';

export async function StudentDashboard({ userId }) {
  const supabase = createAdminClient();

  // 1. Get student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, email')
    .eq('clerk_user_id', userId)
    .single();

  if (!profile) return null;
  const studentId = profile.id;

  // 2. Get all enrollments with course data
  const { data: rawEnrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      enrolled_at,
      course_id,
      courses (
        id,
        title,
        slug,
        description,
        thumbnail_url,
        price,
        is_published
      )
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false });

  if (!rawEnrollments || rawEnrollments.length === 0) {
    return (
      <StudentDashboardUI
        profile={profile}
        enrolledCourses={[]}
        stats={{ total: 0, inProgress: 0, completed: 0 }}
      />
    );
  }

  // 3. Enrich each enrollment with progress data (batch-friendly)
  const courseIds = rawEnrollments.map((e) => e.course_id);

  // Get all chapters for enrolled courses in one query
  const { data: allChapters } = await supabase
    .from('chapters')
    .select('id, course_id')
    .in('course_id', courseIds);

  // Get all completed progress records for this student in one query
  const enrollmentIds = rawEnrollments.map((e) => e.id);
  const { data: allProgress } = await supabase
    .from('progress')
    .select('enrollment_id, chapter_id, completed')
    .in('enrollment_id', enrollmentIds)
    .eq('completed', true);

  // Build lookup maps
  const chaptersByCourse = {};
  (allChapters ?? []).forEach((ch) => {
    if (!chaptersByCourse[ch.course_id]) chaptersByCourse[ch.course_id] = [];
    chaptersByCourse[ch.course_id].push(ch.id);
  });

  const completedByEnrollment = {};
  (allProgress ?? []).forEach((p) => {
    if (!completedByEnrollment[p.enrollment_id]) completedByEnrollment[p.enrollment_id] = 0;
    completedByEnrollment[p.enrollment_id]++;
  });

  // Compose enriched enrollment objects
  const enrolledCourses = rawEnrollments.map((e) => {
    const totalChapters = chaptersByCourse[e.course_id]?.length ?? 0;
    const completedChapters = completedByEnrollment[e.id] ?? 0;
    const progress = totalChapters > 0
      ? Math.min(100, Math.round((completedChapters / totalChapters) * 100))
      : 0;

    return {
      id: e.id,
      enrolledAt: e.enrolled_at,
      course_id: e.course_id,
      course: e.courses,
      totalChapters,
      completedChapters,
      progress,
    };
  });

  // 4. Compute stats
  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter((e) => e.progress > 0 && e.progress < 100).length,
    completed: enrolledCourses.filter((e) => e.progress === 100).length,
  };

  return (
    <StudentDashboardUI
      profile={profile}
      enrolledCourses={enrolledCourses}
      stats={stats}
    />
  );
}
