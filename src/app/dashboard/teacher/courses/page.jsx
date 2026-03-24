import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function TeacherCoursesPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('teacher_id', profile?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button asChild>
          <Link href="/dashboard/teacher/courses/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card glass className="overflow-hidden border-dashed">
          <Link href="/dashboard/teacher/courses/new">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-2 min-h-[200px] hover:bg-accent/10 transition-colors">
              <Plus className="h-12 w-12 text-muted-foreground" />
              <span className="text-muted-foreground">Create new course</span>
            </CardContent>
          </Link>
        </Card>
        {courses?.map((c) => (
          <Card key={c.id} glass className="overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
              {c.thumbnail_url && (
                <img
                  src={c.thumbnail_url}
                  alt=""
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{c.title}</CardTitle>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{c.is_published ? 'Published' : 'Draft'}</span>
                <span>${c.price}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/dashboard/teacher/courses/${c.id}/edit`}>Edit</Link>
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/courses/${c.slug}`}>View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
