import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default async function StudentsPage() {
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
    .select('id, title')
    .eq('teacher_id', profile?.id);

  const courseIds = courses?.map((c) => c.id) ?? [];
  const { data: enrollments } = courseIds.length
    ? await supabase
        .from('enrollments')
        .select('id, student_id, course_id, enrolled_at')
        .in('course_id', courseIds)
        .order('enrolled_at', { ascending: false })
    : { data: [] };

  const studentIds = [...new Set((enrollments ?? []).map((e) => e.student_id))];
  const { data: profiles } = studentIds.length
    ? await supabase.from('profiles').select('id, full_name, email').in('id', studentIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const courseMap = Object.fromEntries(courses?.map((c) => [c.id, c.title]) ?? []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Student Management</h1>
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrolled Students
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Students enrolled in your courses
          </p>
        </CardHeader>
        <CardContent>
          {enrollments?.length ? (
            <div className="space-y-2">
              {enrollments.map((e) => {
                const p = profileMap.get(e.student_id);
                return (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{p?.full_name ?? 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{p?.email ?? ''}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{courseMap[e.course_id] ?? '—'}</p>
                      <p className="text-muted-foreground">
                        {new Date(e.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No students enrolled yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
