import { TeacherCourseForm } from '@/components/teacher/teacher-course-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Create Course – Teacher Portal' };

export default function TeacherNewCoursePage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/teacher/courses"
                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Courses
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-white">Create New Course</h1>
                <p className="text-white/40 text-sm mt-1">Fill in the details to create your new course</p>
            </div>
            <TeacherCourseForm />
        </div>
    );
}
