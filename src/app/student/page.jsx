import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin-cjs';
import Link from 'next/link';
import {
    BookOpen, Users, TrendingUp, Clock,
    ArrowRight, GraduationCap, Award, BarChart3,
    PlayCircle, Target, Sparkles, Brain
} from 'lucide-react';

export default async function StudentPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('clerk_user_id', userId)
        .single();

    if (!profile) redirect('/onboarding');

    const studentId = profile.id;

    // Fetch enrolled courses
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id, created_at')
        .eq('user_id', studentId)
        .order('created_at', { ascending: false });

    const courseIds = enrollments?.map((e) => e.course_id) ?? [];
    let enrolledCourses = [];
    let totalProgress = 0;
    let completedCount = 0;

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from('courses')
            .select('id, title, slug, thumbnail_url, price, category')
            .in('id', courseIds.slice(0, 10));

        enrolledCourses = courses ?? [];

        // Fetch chapters to calculate per-course progress
        const { data: chapters } = await supabase
            .from('chapters')
            .select('id, course_id')
            .in('course_id', courseIds);

        const { data: progressData } = await supabase
            .from('progress')
            .select('chapter_id, is_completed')
            .eq('user_id', studentId)
            .eq('is_completed', true);

        const completedChapterIds = new Set(progressData?.map(p => p.chapter_id) ?? []);

        // Attach progress to courses
        enrolledCourses = enrolledCourses.map(course => {
            const courseChapters = chapters?.filter(ch => ch.course_id === course.id) ?? [];
            const courseCompletedCount = courseChapters.filter(ch => completedChapterIds.has(ch.id)).length;
            const progress = courseChapters.length > 0 ? Math.round((courseCompletedCount / courseChapters.length) * 100) : 0;
            return { ...course, progress, isCompleted: progress === 100 && courseChapters.length > 0 };
        });

        completedCount = progressData?.length ?? 0;
        totalProgress = enrolledCourses.length > 0
            ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
            : 0;
    }

    const completedCourses = enrolledCourses.filter(c => c.isCompleted);

    // Fetch available courses (not enrolled)
    const { data: allCourses } = await supabase
        .from('courses')
        .select('id, title, slug, thumbnail_url, price, category')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

    const availableCourses = (allCourses ?? []).filter(
        (c) => !courseIds.includes(c.id)
    );

    const stats = [
        {
            label: 'Enrolled Courses',
            value: courseIds.length,
            icon: 'BookOpen',
            color: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
            glow: 'glow-border-blue',
            glowColor: 'shadow-glow-blue',
        },
        {
            label: 'Overall Progress',
            value: `${totalProgress}%`,
            icon: 'TrendingUp',
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            glow: 'glow-border-emerald',
            glowColor: 'shadow-glow-emerald',
        },
        {
            label: 'Completed Chapters',
            value: completedCount,
            icon: 'Award',
            color: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-500/10 border-violet-500/20',
            glow: 'glow-border-violet',
            glowColor: 'shadow-glow-violet',
        },
        {
            label: 'Trophies Earned',
            value: completedCourses.length,
            icon: 'Trophy',
            color: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-500/10 border-orange-500/20',
            glow: 'glow-border-amber',
            glowColor: 'shadow-glow-amber',
        },
    ];

    // SVG Progress Ring helper
    const ringSize = 72;
    const ringStroke = 5;
    const ringRadius = (ringSize - ringStroke) / 2;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference - (totalProgress / 100) * ringCircumference;

    return (
        <DashboardClient
            profile={profile}
            enrollments={enrollments}
            enrolledCourses={enrolledCourses}
            completedCourses={completedCourses}
            totalProgress={totalProgress}
            completedCount={completedCount}
            availableCourses={availableCourses}
            stats={stats}
        />
    );
}

import DashboardClient from './DashboardClient';

