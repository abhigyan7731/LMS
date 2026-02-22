'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    BookOpen, CheckCircle2, Clock, Flame, PlayCircle,
    ChevronRight, GraduationCap, Trophy, Zap, BarChart3,
} from 'lucide-react';

function ProgressBar({ value, className = '' }) {
    const pct = Math.min(100, Math.max(0, value));
    return (
        <div className={`h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden ${className}`}>
            <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-700"
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

function StatusBadge({ progress }) {
    if (progress === 100) return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Completed
        </span>
    );
    if (progress > 0) return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400">
            <Clock className="h-3 w-3" /> In Progress
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <BookOpen className="h-3 w-3" /> Not Started
        </span>
    );
}

const COURSE_GRADIENTS = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-indigo-500 to-blue-600',
];

function CourseThumbnail({ course, index, size = 'md' }) {
    const gradient = COURSE_GRADIENTS[index % COURSE_GRADIENTS.length];
    const h = size === 'sm' ? 'h-16 w-16 rounded-xl text-2xl' : 'aspect-video rounded-t-xl text-3xl';
    if (course.thumbnail_url) {
        return (
            <div className={`${size === 'sm' ? 'h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden' : 'aspect-video rounded-t-xl overflow-hidden'}`}>
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
            </div>
        );
    }
    return (
        <div className={`${h} bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white flex-shrink-0`}>
            {course.title?.[0] ?? '📚'}
        </div>
    );
}

const TABS = ['All', 'In Progress', 'Completed'];

export function StudentDashboardUI({ profile, enrolledCourses, stats }) {
    const [activeTab, setActiveTab] = useState('All');

    const filtered = enrolledCourses.filter(e => {
        if (activeTab === 'In Progress') return e.progress > 0 && e.progress < 100;
        if (activeTab === 'Completed') return e.progress === 100;
        return true;
    });

    const continueLearning = enrolledCourses
        .filter(e => e.progress > 0 && e.progress < 100)
        .slice(0, 4);

    const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

    const statCards = [
        {
            label: 'Enrolled Courses',
            value: stats.total,
            icon: BookOpen,
            gradient: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            text: 'text-violet-600 dark:text-violet-400',
        },
        {
            label: 'In Progress',
            value: stats.inProgress,
            icon: Zap,
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: Trophy,
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            text: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Completion Rate',
            value: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '—',
            icon: BarChart3,
            gradient: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400',
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* ── Welcome Banner ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-purple-400/20 blur-2xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Student Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}! 👋</h1>
                    <p className="text-white/70 text-sm max-w-md">
                        {stats.inProgress > 0
                            ? `You have ${stats.inProgress} course${stats.inProgress > 1 ? 's' : ''} in progress. Keep going!`
                            : stats.total > 0
                                ? 'All caught up! Ready to start a new course?'
                                : 'Ready to start your learning journey? Browse courses below.'}
                    </p>
                </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s) => (
                    <div
                        key={s.label}
                        className={`rounded-2xl border border-border ${s.bg} p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-md`}>
                            <s.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <div className={`text-3xl font-extrabold ${s.text}`}>{s.value}</div>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Continue Learning ── */}
            {continueLearning.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-500" /> Continue Learning
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                        {continueLearning.map((e, i) => (
                            <div key={e.id} className="group relative rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <CourseThumbnail course={e.course} index={i} />
                                <div className="p-4 space-y-3">
                                    <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{e.course.title}</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{e.completedChapters}/{e.totalChapters} chapters</span>
                                            <span className="font-semibold text-violet-600 dark:text-violet-400">{e.progress}%</span>
                                        </div>
                                        <ProgressBar value={e.progress} />
                                    </div>
                                    <Link
                                        href={`/courses/${e.course.slug}`}
                                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white hover:from-violet-700 hover:to-purple-700 transition-all"
                                    >
                                        <PlayCircle className="h-3.5 w-3.5" /> Resume
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── All Courses with Tabs ── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Your Courses</h2>
                    <Link href="/courses" className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-medium">
                        Browse More <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-6">
                    {TABS.map((tab) => {
                        const count = tab === 'All' ? enrolledCourses.length
                            : tab === 'In Progress' ? stats.inProgress
                                : stats.completed;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-white dark:bg-gray-900 text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab}
                                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/20'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Empty state */}
                {enrolledCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-5">
                            <GraduationCap className="h-10 w-10 text-violet-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                            You haven't enrolled in any courses. Explore our library and start learning today!
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900/40"
                        >
                            <BookOpen className="h-4 w-4" /> Browse Courses
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border py-12 text-center">
                        <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No {activeTab.toLowerCase()} courses.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((e, i) => (
                            <Link key={e.id} href={`/courses/${e.course.slug}`}>
                                <div className="group rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                                    <CourseThumbnail course={e.course} index={i} />
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                {e.course.title}
                                            </h3>
                                            <StatusBadge progress={e.progress} />
                                        </div>
                                        {e.course.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">{e.course.description}</p>
                                        )}
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{e.completedChapters} of {e.totalChapters} chapters</span>
                                                <span className="font-bold text-foreground">{e.progress}%</span>
                                            </div>
                                            <ProgressBar value={e.progress} />
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {Number(e.course.price) === 0 ? '🆓 Free' : `$${e.course.price}`}
                                            </span>
                                            <span className="text-xs font-medium text-violet-600 dark:text-violet-400 flex items-center gap-1">
                                                {e.progress === 100 ? 'Review' : e.progress > 0 ? 'Resume' : 'Start'}
                                                <ChevronRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Browse CTA (when enrolled) ── */}
            {enrolledCourses.length > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-lg">Discover more courses</h3>
                        <p className="text-sm text-muted-foreground">Expand your skills with our full course library.</p>
                    </div>
                    <Link
                        href="/courses"
                        className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
                    >
                        <BookOpen className="h-4 w-4" /> Browse All Courses
                    </Link>
                </div>
            )}
        </div>
    );
}
