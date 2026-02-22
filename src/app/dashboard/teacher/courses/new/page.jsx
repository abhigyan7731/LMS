import { CourseForm } from '@/components/course/course-form';

export default function NewCoursePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Create New Course</h1>
      <CourseForm />
    </div>
  );
}
