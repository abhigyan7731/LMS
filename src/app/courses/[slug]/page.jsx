import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrollButton } from '@/components/course/enroll-button';
import dynamic from 'next/dynamic'
const CertificateButton = dynamic(() => import('@/components/course/certificate-button').then((m) => m.CertificateButton), { ssr: false })

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const { userId } = await auth();
  const DEAN_EMAIL = 'abhigyankumar268@gmail.com';

  const supabase = createAdminClient();
  let profile = null;
  if (userId) {
    const { data } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('clerk_user_id', userId)
      .single();
    profile = data;
  }

  let courseQuery = supabase
    .from('courses')
    .select('*')
    .eq('slug', slug);

  const isDean = profile?.email === DEAN_EMAIL;
  if (isDean) {
    // dean can preview any draft or published course
  } else if (profile?.id) {
    // creator can preview their own draft course
    courseQuery = courseQuery.or(`is_published.eq.true,teacher_id.eq.${profile.id}`);
  } else {
    // public users can only open published courses
    courseQuery = courseQuery.eq('is_published', true);
  }

  const { data: course } = await courseQuery.single();

  if (!course) notFound();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, position')
    .eq('course_id', course.id)
    .order('position');

  let isEnrolled = false;
  let enrollmentId = null;
  let isCompleted = false;
  if (profile?.id) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', profile?.id)
        .eq('course_id', course.id)
        .single();
      isEnrolled = !!enrollment;
      enrollmentId = enrollment?.id ?? null;

      if (enrollmentId) {
        const { data: chapters } = await supabase
          .from('chapters')
          .select('id')
          .eq('course_id', course.id)

        const { data: completed } = await supabase
          .from('progress')
          .select('id')
          .eq('enrollment_id', enrollmentId)
          .eq('completed', true)

        const totalChapters = (chapters ?? []).length
        const completedCount = (completed ?? []).length
        isCompleted = totalChapters > 0 && completedCount === totalChapters
      }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <a href="/courses">← Courses</a>
          <a href="/dashboard">Dashboard</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>
            <Card glass>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {chapters?.map((ch, i) => (
                    <li key={ch.id} className="flex items-center gap-2">
                      <span className="text-muted-foreground">{i + 1}.</span>
                      {ch.title}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card glass className="sticky top-24">
              <CardHeader>
                <CardTitle>
                  {Number(course.price) === 0 ? 'Free' : `$${course.price}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnrollButton
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  slug={course.slug}
                  price={course.price}
                />
                <div className="mt-4">
                  <CertificateButton courseId={course.id} enrollmentId={enrollmentId} slug={course.slug} isCompleted={isCompleted} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
