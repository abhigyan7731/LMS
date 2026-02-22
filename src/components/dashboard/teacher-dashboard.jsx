import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Plus,
} from 'lucide-react';

export async function TeacherDashboard({ userId }) {
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  const teacherId = profile?.id;
  if (!teacherId) return null;

  const { data: courses } = await supabase
    .from('courses')
    .select('id')
    .eq('teacher_id', teacherId);

  const courseIds = courses?.map((c) => c.id) ?? [];
  let studentsCount = 0;
  let revenue = 0;

  if (courseIds.length > 0) {
    const { count } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .in('course_id', courseIds);
    studentsCount = count ?? 0;

    const { data: enrollmentsWithPrice } = await supabase
      .from('enrollments')
      .select('course_id')
      .in('course_id', courseIds);

    const { data: coursePrices } = await supabase
      .from('courses')
      .select('id, price')
      .in('id', courseIds);

    const priceMap = new Map((coursePrices ?? []).map((c) => [c.id, Number(c.price) ?? 0]));
    revenue = (enrollmentsWithPrice ?? []).reduce(
      (acc, e) => acc + (priceMap.get(e.course_id) ?? 0),
      0
    );
  }

  const publishedCount = courses?.length ?? 0;

  const stats = [
    { label: 'Total Students', value: studentsCount ?? 0, icon: Users },
    { label: 'Revenue', value: `$${revenue.toFixed(0)}`, icon: DollarSign },
    { label: 'Courses', value: publishedCount, icon: BookOpen },
    { label: 'Completion Rate', value: '—', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/teacher/courses/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} glass>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card glass>
          <CardHeader>
            <CardTitle>Course Creation</CardTitle>
            <CardDescription>Create a new course or use AI to generate a syllabus</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild variant="outline">
              <Link href="/dashboard/teacher/courses/new">Manual Course</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/teacher/ai-course">AI Course Generator</Link>
            </Button>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>View and manage enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/students">View Students</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
