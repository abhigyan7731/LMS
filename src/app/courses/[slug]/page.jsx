import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrollButton } from '@/components/course/enroll-button';

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const { userId } = await auth();

  const supabase = createAdminClient();
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!course) notFound();

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, position')
    .eq('course_id', course.id)
    .order('position');

  let isEnrolled = false;
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();
    if (profile) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', profile.id)
        .eq('course_id', course.id)
        .single();
      isEnrolled = !!enrollment;
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/courses">← Courses</Link>
          <Link href="/dashboard">Dashboard</Link>
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
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
