'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
    BookOpen, Users, TrendingUp, Clock,
    ArrowRight, GraduationCap, Award, BarChart3,
    PlayCircle, Target, Sparkles, Brain, LayoutGrid, Cpu, Trophy
} from 'lucide-react';
// Dynamic imports for 3D components to prevent SSR issues
const SkillMap = dynamic(() => import('@/components/3d/skill-map'), { ssr: false });
const TrophyVault = dynamic(() => import('@/components/3d/trophy-vault'), { ssr: false });

export default function DashboardClient({ profile, enrollments, enrolledCourses, completedCourses, totalProgress, completedCount, availableCourses, stats }) {
    const [viewMode, setViewMode] = useState('standard'); // 'standard', 'spatial', or 'vault'

    const getIcon = (iconName) => {
        const icons = { BookOpen, TrendingUp, Award, Trophy };
        const Icon = icons[iconName] || BookOpen;
        return <Icon className="w-4 h-4 text-white" />;
    };

    // SVG Progress Ring helper
    const ringSize = 72;
    const ringStroke = 5;
    const ringRadius = (ringSize - ringStroke) / 2;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const ringOffset = ringCircumference - (totalProgress / 100) * ringCircumference;

    return (
        <div className="min-h-screen gradient-mesh-blue text-white relative overflow-hidden pb-20">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
                {Array.from({ length: 20 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-blue-400 particle-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            opacity: Math.random() * 0.4 + 0.1,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${Math.random() * 6 + 6}s`,
                        }}
                    />
                ))}
            </div>

            <div className="fixed inset-0 perspective-grid pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
                {/* 3D Holographic Header */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-600/5 to-blue-600/10 backdrop-blur-xl p-6 sm:p-8 tilt-in" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="absolute inset-0 holo-scanline pointer-events-none" />
                    <div className="absolute inset-0 holo-shimmer pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-glow-blue depth-breathe">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Welcome back, {profile.full_name?.split(' ')[0] ?? 'Student'}! 👋
                                </h1>
                            </div>
                            <p className="text-white/40 mt-1 ml-12">System Online · Neural Synapse Ready</p>
                        </div>
                        
                        {/* View Mode Toggle */}
                        <div className="flex items-center p-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-inner overflow-hidden">
                            <button 
                                onClick={() => setViewMode('standard')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'standard' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                Grid
                            </button>
                            <button 
                                onClick={() => setViewMode('spatial')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'spatial' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Cpu className="w-3.5 h-3.5" />
                                Neural Map
                            </button>
                            <button 
                                onClick={() => setViewMode('vault')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'vault' ? 'bg-amber-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Award className="w-3.5 h-3.5" />
                                Trophy Vault
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'spatial' ? (
                    <div className="tilt-in">
                        <SkillMap courses={enrolledCourses} />
                    </div>
                ) : viewMode === 'vault' ? (
                    <div className="tilt-in">
                        <TrophyVault completedCourses={completedCourses} />
                    </div>
                ) : (
                    <>
                        {/* 3D Floating Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {stats.map((stat, idx) => (
                                <div
                                    key={stat.label}
                                    className={`relative group rounded-2xl border p-5 ${stat.bg} backdrop-blur-sm card-3d ${stat.glow} tilt-in`}
                                    style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{stat.label}</span>
                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg depth-breathe`}>
                                            {getIcon(stat.icon)}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                                    <div className={`absolute -inset-0.5 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 orbit-ring transition-opacity`} />
                                </div>
                            ))}
                        </div>

                        {/* Main content */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                        My Courses
                                    </h2>
                                    <Link href="/courses" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all hover:translate-x-1">
                                        Browse all <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                
                                {enrolledCourses.length > 0 ? (
                                    <div className="space-y-3">
                                        {enrolledCourses.map((course, idx) => (
                                            <Link
                                                key={course.id}
                                                href={`/courses/${course.slug || course.id}`}
                                                className="flex items-center gap-4 p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                                style={{ animationDelay: `${idx * 0.06}s`, transformStyle: 'preserve-3d' }}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex-shrink-0 overflow-hidden shadow-lg">
                                                    {course.thumbnail_url ? (
                                                        <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen className="w-6 h-6 text-blue-400 m-3" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">{course.title}</p>
                                                    <p className="text-sm text-white/40">{course.category ?? 'Course'}</p>
                                                </div>
                                                <PlayCircle className="w-5 h-5 text-white/20 group-hover:text-blue-400 flex-shrink-0 transition-all group-hover:scale-110" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center glass-card">
                                        <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3 depth-breathe" />
                                        <p className="text-white/40 mb-4">You haven't enrolled in any courses yet.</p>
                                        <Link
                                            href="/courses"
                                            className="btn-3d inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl shadow-glow-blue"
                                        >
                                            <BookOpen className="w-4 h-4" /> Browse Courses
                                        </Link>
                                    </div>
                                )}

                                {/* Available Courses */}
                                {availableCourses.length > 0 && (
                                    <div className="space-y-4 mt-6">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-cyan-400" />
                                            Recommended For You
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {availableCourses.slice(0, 4).map((course, idx) => (
                                                <Link
                                                    key={course.id}
                                                    href={`/courses/${course.slug || course.id}`}
                                                    className="p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                                    style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                                                            <BookOpen className="w-5 h-5 text-cyan-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-white text-sm truncate group-hover:text-cyan-300 transition-colors">{course.title}</p>
                                                            <p className="text-xs text-white/40 mt-1">{course.category ?? 'Course'} · ${course.price ?? 0}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 text-center glass-card glow-border-blue tilt-in">
                                    <h3 className="text-sm font-semibold text-white/60 mb-4">Overall Progress</h3>
                                    <div className="flex justify-center mb-3">
                                        <div className="relative inline-flex items-center justify-center" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))' }}>
                                            <svg width={ringSize} height={ringSize} className="transform -rotate-90">
                                                <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={ringStroke} />
                                                <circle
                                                    cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none"
                                                    stroke="#3b82f6" strokeWidth={ringStroke}
                                                    strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-lg font-bold text-white">{totalProgress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/30">{completedCount} chapters completed</p>
                                </div>

                                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                                <div className="space-y-3">
                                    {[
                                        { href: '/student/skill-quiz', icon: Brain, label: 'AI Skill Quiz', desc: 'Test knowledge & get course recs', color: 'text-violet-400' },
                                        { href: '/courses', icon: BookOpen, label: 'Browse Courses', desc: 'Explore our course catalog', color: 'text-blue-400' },
                                        { href: '/dashboard', icon: BarChart3, label: 'View Progress', desc: 'Track your learning journey', color: 'text-emerald-400' },
                                        { href: '/courses', icon: Target, label: 'Continue Learning', desc: 'Pick up where you left off', color: 'text-violet-400' },
                                    ].map((action, idx) => (
                                        <Link
                                            key={action.href + action.label}
                                            href={action.href}
                                            className="flex items-center gap-3 p-4 rounded-xl glass-card glass-card-hover group tilt-in"
                                            style={{ animationDelay: `${idx * 0.06}s`, transformStyle: 'preserve-3d' }}
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                                                <action.icon className={`w-4 h-4 ${action.color}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white group-hover:text-white/90">{action.label}</p>
                                                <p className="text-xs text-white/40 truncate">{action.desc}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto flex-shrink-0 transition-all group-hover:translate-x-1" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
