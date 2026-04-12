'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    Search, SlidersHorizontal, X, Star, Clock, BookOpen,
    Users, TrendingUp, Sparkles, Zap, ChevronRight,
    MessageSquare, Send, Bot, GraduationCap, Flame,
    Code2, Palette, Brain, Database, Globe, Shield,
    ArrowUpRight, Play, Award, Layers, Box
} from 'lucide-react';

// ─── Static metadata per course slug ────────────────────────────────────────
const COURSE_META = {
    'intro-react-demo': {
        category: 'Development',
        level: 'Beginner',
        lessons: 24,
        duration: '6h 30m',
        rating: 4.8,
        reviews: 3200,
        students: 18400,
        tags: ['Trending', 'Top Rated'],
        icon: '⚛️',
        gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
        accent: '#06b6d4',
        accentRGB: '6, 182, 212',
        instructor: 'Alex Rivera',
    },
    'typescript-essentials-demo': {
        category: 'Development',
        level: 'Intermediate',
        lessons: 32,
        duration: '8h 15m',
        rating: 4.7,
        reviews: 2100,
        students: 11200,
        tags: ['Top Rated'],
        icon: '🔷',
        gradient: 'from-blue-400 via-blue-500 to-blue-700',
        accent: '#3b82f6',
        accentRGB: '59, 130, 246',
        instructor: 'Sam Chen',
    },
    'fullstack-nextjs-demo': {
        category: 'Development',
        level: 'Advanced',
        lessons: 48,
        duration: '14h 20m',
        rating: 4.9,
        reviews: 980,
        students: 5600,
        tags: ['New', 'Recommended'],
        icon: '▲',
        gradient: 'from-gray-700 via-gray-800 to-black',
        accent: '#6366f1',
        accentRGB: '99, 102, 241',
        instructor: 'Jordan Park',
    },
    'python-data-science-demo': {
        category: 'AI',
        level: 'Intermediate',
        lessons: 36,
        duration: '10h 45m',
        rating: 4.6,
        reviews: 4800,
        students: 24000,
        tags: ['Trending', 'Popular'],
        icon: '🐍',
        gradient: 'from-yellow-400 via-green-400 to-teal-500',
        accent: '#22c55e',
        accentRGB: '34, 197, 94',
        instructor: 'Priya Sharma',
    },
    'uiux-design-demo': {
        category: 'Design',
        level: 'Beginner',
        lessons: 28,
        duration: '7h 50m',
        rating: 4.5,
        reviews: 1600,
        students: 8900,
        tags: ['New'],
        icon: '🎨',
        gradient: 'from-pink-400 via-purple-400 to-violet-500',
        accent: '#a855f7',
        accentRGB: '168, 85, 247',
        instructor: 'Maya Torres',
    },
};

const DEFAULT_META = {
    category: 'Development',
    level: 'Beginner',
    lessons: 20,
    duration: '5h 00m',
    rating: 4.0,
    reviews: 500,
    students: 2000,
    tags: [],
    icon: '📚',
    gradient: 'from-indigo-400 via-purple-400 to-pink-400',
    accent: '#6366f1',
    accentRGB: '99, 102, 241',
    instructor: 'Instructor',
};

const CATEGORIES = ['All', 'Development', 'Design', 'AI', 'Business', 'Security'];
const SORT_OPTIONS = ['Popular', 'New', 'Top Rated'];

const CATEGORY_ICONS = {
    All: <GraduationCap className="h-4 w-4" />,
    Development: <Code2 className="h-4 w-4" />,
    Design: <Palette className="h-4 w-4" />,
    AI: <Brain className="h-4 w-4" />,
    Business: <Globe className="h-4 w-4" />,
    Security: <Shield className="h-4 w-4" />,
};

const TAG_STYLES = {
    Trending: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Top Rated': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    New: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Recommended: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    Popular: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const TAG_ICONS = {
    Trending: <Flame className="h-3 w-3" />,
    'Top Rated': <Award className="h-3 w-3" />,
    New: <Sparkles className="h-3 w-3" />,
    Recommended: <Zap className="h-3 w-3" />,
    Popular: <TrendingUp className="h-3 w-3" />,
};

// ─── Star Rating component ───────────────────────────────────────────────────
function StarRating({ rating, reviews, students }) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < full ? 'text-amber-400 fill-amber-400' :
                                i === full && half ? 'text-amber-400 fill-amber-200' :
                                    'text-gray-600 fill-gray-700'
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs font-semibold text-amber-400">{rating.toFixed(1)}</span>
            <span className="text-xs text-white/40">({(reviews / 1000).toFixed(1)}k)</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/40 flex items-center gap-0.5">
                <Users className="h-3 w-3" />
                {(students / 1000).toFixed(1)}k
            </span>
        </div>
    );
}

// ─── 3D Skeleton card for loading ────────────────────────────────────────────
function SkeletonCard({ index }) {
    return (
        <div
            className="rounded-2xl overflow-hidden border border-white/10 animate-pulse"
            style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                animation: `tilt-in 0.6s ease-out both`,
                animationDelay: `${(index || 0) * 0.1}s`,
                transformStyle: 'preserve-3d',
            }}
        >
            <div className="h-52 relative overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'holo-shimmer 2s linear infinite',
                }} />
            </div>
            <div className="p-5 space-y-3">
                <div className="h-3 bg-white/5 rounded w-1/4" />
                <div className="h-5 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-5/6" />
                <div className="pt-2 flex justify-between">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}

// ─── 3D Course Card with Mouse-Tracking Tilt ─────────────────────────────────
function CourseCard3D({ course, index }) {
    const meta = COURSE_META[course.slug] ?? DEFAULT_META;
    const cardRef = useRef(null);
    const glareRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [appeared, setAppeared] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAppeared(true), 100 + index * 80);
        return () => clearTimeout(timer);
    }, [index]);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;

        if (glareRef.current) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
            glareRef.current.style.opacity = '1';
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHovered(false);
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
        }
        if (glareRef.current) {
            glareRef.current.style.opacity = '0';
        }
    }, []);

    return (
        <Link href={`/courses/${course.slug}`} className="group block">
            <div
                ref={cardRef}
                className="relative rounded-2xl overflow-hidden h-full flex flex-col"
                style={{
                    transformStyle: 'preserve-3d',
                    transition: hovered ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, opacity 0.6s ease',
                    transform: appeared
                        ? 'perspective(800px) rotateX(0) rotateY(0) translateZ(0) scale(1)'
                        : 'perspective(800px) rotateX(8deg) translateY(40px) translateZ(-30px) scale(0.95)',
                    opacity: appeared ? 1 : 0,
                    background: 'rgba(15, 15, 35, 0.8)',
                    backdropFilter: 'blur(24px)',
                    border: `1px solid rgba(${meta.accentRGB}, ${hovered ? 0.5 : 0.15})`,
                    boxShadow: hovered
                        ? `0 25px 60px -12px rgba(${meta.accentRGB}, 0.35), 0 0 0 1px rgba(${meta.accentRGB}, 0.4), 0 0 40px rgba(${meta.accentRGB}, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)`
                        : `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Glare overlay */}
                <div
                    ref={glareRef}
                    className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
                    style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                />

                {/* Holo scanline */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, rgba(${meta.accentRGB}, 0.03) 45%, rgba(${meta.accentRGB}, 0.08) 50%, rgba(${meta.accentRGB}, 0.03) 55%, transparent 100%)`,
                            animation: 'holo-scan 4s linear infinite',
                        }}
                    />
                </div>

                {/* Edge glow on hover */}
                {hovered && (
                    <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl" style={{
                        boxShadow: `inset 0 0 30px rgba(${meta.accentRGB}, 0.1)`,
                    }} />
                )}

                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />
                    {course.thumbnail_url && (
                        <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                            style={{
                                transform: hovered ? 'scale(1.15) translateZ(10px)' : 'scale(1) translateZ(0)',
                            }}
                        />
                    )}
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,15,35,1)] via-[rgba(15,15,35,0.3)] to-transparent" />

                    {/* Floating 3D price badge */}
                    <div className="absolute top-3 right-3 z-20" style={{ transform: 'translateZ(30px)' }}>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border ${Number(course.price) === 0
                                ? 'bg-emerald-500/80 text-white border-emerald-400/50'
                                : 'bg-white/10 text-white border-white/30'
                            }`}
                            style={{
                                boxShadow: Number(course.price) === 0
                                    ? '0 4px 20px rgba(34,197,94,0.4)'
                                    : '0 4px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            {Number(course.price) === 0 ? '✦ FREE' : `$${Number(course.price).toFixed(2)}`}
                        </span>
                    </div>

                    {/* Tags */}
                    {meta.tags.length > 0 && (
                        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1" style={{ transform: 'translateZ(25px)' }}>
                            {meta.tags.slice(0, 1).map(tag => (
                                <span
                                    key={tag}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-md ${TAG_STYLES[tag] ?? 'bg-gray-100/20 text-gray-300'}`}
                                >
                                    {TAG_ICONS[tag]}
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 3D Play button on hover */}
                    <div
                        className="absolute inset-0 flex items-center justify-center z-20 transition-all duration-500"
                        style={{
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateZ(40px) scale(1)' : 'translateZ(20px) scale(0.7)',
                        }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: `rgba(${meta.accentRGB}, 0.3)`,
                                backdropFilter: 'blur(16px)',
                                border: `2px solid rgba(${meta.accentRGB}, 0.6)`,
                                boxShadow: `0 0 30px rgba(${meta.accentRGB}, 0.4), inset 0 0 20px rgba(${meta.accentRGB}, 0.1)`,
                            }}
                        >
                            <Play className="h-7 w-7 text-white fill-white ml-1" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }} />
                        </div>
                    </div>

                    {/* Bottom info bar — course icon + category */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between" style={{ transform: 'translateZ(15px)' }}>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>{meta.icon}</span>
                            <span className="text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                                {meta.category}
                            </span>
                        </div>
                        <span className="text-xs text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                            {meta.level}
                        </span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 relative" style={{ transform: 'translateZ(5px)' }}>
                    {/* Instructor */}
                    <p className="text-[11px] uppercase tracking-widest font-semibold mb-1.5"
                        style={{ color: meta.accent }}>
                        {meta.instructor}
                    </p>

                    {/* Title */}
                    <h3
                        className="font-bold text-base text-white line-clamp-2 leading-snug mb-2 transition-colors duration-300"
                        style={{ color: hovered ? meta.accent : 'white' }}
                    >
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/40 line-clamp-2 leading-relaxed flex-1 mb-3">
                        {course.description ?? 'No description available.'}
                    </p>

                    {/* Rating row */}
                    <StarRating rating={meta.rating} reviews={meta.reviews} students={meta.students} />

                    {/* 3D Slide-up details on hover */}
                    <div
                        className="overflow-hidden transition-all duration-500 ease-out"
                        style={{
                            maxHeight: hovered ? '70px' : '0px',
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateZ(10px) translateY(0)' : 'translateZ(0) translateY(10px)',
                        }}
                    >
                        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-white/10 text-xs text-white/50 flex-wrap">
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" style={{ color: meta.accent }} />
                                {meta.lessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-purple-400" />
                                {meta.duration}
                            </span>
                            <span className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5 text-amber-400" />
                                Certificate
                            </span>
                        </div>
                    </div>

                    {/* Footer: 3D Enroll button */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <div className="text-xs text-white/30">
                            {meta.lessons} lessons · {meta.duration}
                        </div>
                        <button
                            className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all duration-300 overflow-hidden relative"
                            style={{
                                background: `linear-gradient(135deg, rgba(${meta.accentRGB}, 0.8), rgba(${meta.accentRGB}, 0.5))`,
                                border: `1px solid rgba(${meta.accentRGB}, 0.4)`,
                                transform: hovered ? 'translateZ(15px) translateY(-1px)' : 'translateZ(0)',
                                boxShadow: hovered
                                    ? `0 8px 25px rgba(${meta.accentRGB}, 0.4), 0 0 15px rgba(${meta.accentRGB}, 0.2)`
                                    : `0 4px 12px rgba(0,0,0,0.3)`,
                            }}
                        >
                            <span className="relative z-10">Enroll</span>
                            <ChevronRight
                                className="h-3.5 w-3.5 relative z-10 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                            />
                            <div
                                className="absolute inset-0 bg-white/10 transition-opacity duration-300"
                                style={{ opacity: hovered ? 1 : 0 }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── Ask AI Floating Panel ───────────────────────────────────────────────────
function AskAIPanel() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hi! I'm your AI learning advisor. Tell me your goals and I'll recommend the perfect course for you. 🎯" }
    ]);
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);

    const SUGGESTIONS = [
        "I want to learn web development",
        "Help me get into AI/ML",
        "Best course for beginners?",
    ];

    const AI_RESPONSES = {
        default: "Based on your interest, I'd recommend starting with **Introduction to React** if you're new to web dev, or **Python for Data Science** if you want to dive into AI. Both are highly rated by our community! 🚀",
        web: "Great choice! **Introduction to React** (FREE) is perfect for web dev beginners. After that, level up with **TypeScript Essentials** and **Full-Stack Next.js Development** for a complete stack skillset.",
        ai: "For AI/ML, **Python for Data Science** is your starting point — covers NumPy, Pandas, Matplotlib, and Scikit-learn. Pair it with **TypeScript Essentials** for building AI-powered apps.",
        beginner: "For absolute beginners, **Introduction to React** (FREE) or **UI/UX Design Fundamentals** ($19.99) are perfect entry points. Both have structured paths from zero to job-ready.",
    };

    function getResponse(msg) {
        const lower = msg.toLowerCase();
        if (lower.includes('web') || lower.includes('react') || lower.includes('frontend')) return AI_RESPONSES.web;
        if (lower.includes('ai') || lower.includes('ml') || lower.includes('data') || lower.includes('python')) return AI_RESPONSES.ai;
        if (lower.includes('begin') || lower.includes('start') || lower.includes('new')) return AI_RESPONSES.beginner;
        return AI_RESPONSES.default;
    }

    async function send(text) {
        const msg = text || input.trim();
        if (!msg) return;
        setMessages(m => [...m, { role: 'user', text: msg }]);
        setInput('');
        setTyping(true);
        await new Promise(r => setTimeout(r, 1200));
        setMessages(m => [...m, { role: 'ai', text: getResponse(msg) }]);
        setTyping(false);
    }

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.5), 0 0 20px rgba(168,85,247,0.3)',
                }}
                aria-label="Ask AI for course help"
            >
                {open
                    ? <X className="h-6 w-6 text-white" />
                    : <MessageSquare className="h-6 w-6 text-white" />
                }
                {!open && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0f0c29] animate-pulse" />
                )}
            </button>

            {/* Panel */}
            <div
                className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out"
                style={{
                    transform: open ? 'scale(1) translateY(0) perspective(800px) rotateX(0)' : 'scale(0.9) translateY(24px) perspective(800px) rotateX(10deg)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'all' : 'none',
                    background: 'rgba(10, 10, 30, 0.95)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(99,102,241,0.15)',
                }}
            >
                {/* Header */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                        style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                        <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">AI Course Advisor</p>
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                            Online · Instant recommendations
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role === 'ai' && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                    <Sparkles className="h-3 w-3 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                        : 'bg-white/10 text-gray-100 rounded-bl-sm border border-white/5'
                                    }`}
                            >
                                {m.text.replace(/\*\*/g, '')}
                            </div>
                        </div>
                    ))}
                    {typing && (
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 border border-white/5">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Quick suggestions */}
                <div className="px-4 pb-2 flex gap-2 flex-wrap">
                    {SUGGESTIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => send(s)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all border border-white/10 hover:border-indigo-500/30"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="px-4 pb-4 flex gap-2">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Ask about courses..."
                        className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
                    />
                    <button
                        onClick={() => send()}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-indigo-500/40 hover:scale-105 transition-all"
                        style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
                    >
                        <Send className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── 3D Floating Particle ────────────────────────────────────────────────────
function FloatingParticle({ style, size = 4, color = 'rgba(99,102,241,0.3)', delay = 0 }) {
    return (
        <div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                background: color,
                filter: `blur(${size > 6 ? 2 : 1}px)`,
                animation: `particle-float ${8 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                ...style,
            }}
        />
    );
}

// ─── Main Client Component ───────────────────────────────────────────────────
export default function CoursesClient({ courses, fetchError }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('Popular');
    const [loading, setLoading] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    // Simulate initial load shimmer
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    // Track mouse for hero parallax
    const handleHeroMouse = useCallback((e) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePos({ x, y });
    }, []);

    const filtered = useMemo(() => {
        let list = courses.map(c => ({ ...c, _meta: COURSE_META[c.slug] ?? DEFAULT_META }));

        // Filter by category
        if (category !== 'All') {
            list = list.filter(c => c._meta.category === category);
        }

        // Filter by search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                c.title.toLowerCase().includes(q) ||
                (c.description ?? '').toLowerCase().includes(q) ||
                c._meta.category.toLowerCase().includes(q)
            );
        }

        // Sort
        if (sort === 'Popular') list.sort((a, b) => b._meta.students - a._meta.students);
        if (sort === 'New') list.sort((a, b) => (a._meta.tags.includes('New') ? -1 : 1));
        if (sort === 'Top Rated') list.sort((a, b) => b._meta.rating - a._meta.rating);

        return list;
    }, [courses, category, search, sort]);

    return (
        <div className="min-h-screen relative" style={{
            background: 'linear-gradient(135deg, #050510 0%, #0a0a2e 25%, #12123a 50%, #0a0a2e 75%, #050510 100%)',
        }}>

            {/* ── Injected 3D keyframes ──────────────────────────────────── */}
            <style>{`
                @keyframes shimmer-3d {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes float-hero {
                    0%, 100% { transform: translateY(0) translateZ(0); }
                    50% { transform: translateY(-20px) translateZ(30px); }
                }
                @keyframes orbit-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes grid-perspective {
                    0%, 100% { opacity: 0.04; }
                    50% { opacity: 0.08; }
                }
                @keyframes text-shimmer {
                    0% { background-position: -100% center; }
                    100% { background-position: 200% center; }
                }
                .hero-text-3d {
                    text-shadow: 
                        0 1px 0 rgba(255,255,255,0.05),
                        0 2px 0 rgba(255,255,255,0.02),
                        0 4px 8px rgba(0,0,0,0.4),
                        0 8px 16px rgba(0,0,0,0.3),
                        0 16px 32px rgba(0,0,0,0.2);
                }
                .depth-layer-1 { transform: translateZ(60px); }
                .depth-layer-2 { transform: translateZ(40px); }
                .depth-layer-3 { transform: translateZ(20px); }
            `}</style>

            {/* ── 3D Perspective Grid Background ──────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Perspective grid floor */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                    transform: 'perspective(400px) rotateX(65deg)',
                    transformOrigin: 'center top',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%)',
                    animation: 'grid-perspective 8s ease-in-out infinite',
                }} />

                {/* Floating particles */}
                <FloatingParticle style={{ top: '10%', left: '8%' }} size={6} color="rgba(99,102,241,0.4)" delay={0} />
                <FloatingParticle style={{ top: '25%', right: '12%' }} size={4} color="rgba(168,85,247,0.3)" delay={1.5} />
                <FloatingParticle style={{ top: '45%', left: '20%' }} size={8} color="rgba(6,182,212,0.25)" delay={3} />
                <FloatingParticle style={{ top: '60%', right: '25%' }} size={5} color="rgba(139,92,246,0.35)" delay={2} />
                <FloatingParticle style={{ top: '75%', left: '40%' }} size={3} color="rgba(236,72,153,0.3)" delay={4} />
                <FloatingParticle style={{ top: '15%', left: '55%' }} size={7} color="rgba(59,130,246,0.3)" delay={1} />
                <FloatingParticle style={{ top: '80%', right: '8%' }} size={4} color="rgba(16,185,129,0.3)" delay={2.5} />
                <FloatingParticle style={{ top: '35%', left: '70%' }} size={5} color="rgba(245,158,11,0.25)" delay={3.5} />

                {/* Large ambient glow orbs */}
                <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)',
                        animation: 'float-hero 8s ease-in-out infinite',
                    }} />
                <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-15"
                    style={{
                        background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
                        animation: 'float-hero 10s ease-in-out infinite 2s',
                    }} />
                <div className="absolute top-[40%] left-[45%] w-[500px] h-[500px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)',
                        animation: 'float-hero 12s ease-in-out infinite 4s',
                    }} />

                {/* Orbiting ring */}
                <div className="absolute top-[20%] right-[15%] w-48 h-48" style={{
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '50%',
                    animation: 'orbit-slow 20s linear infinite',
                }}>
                    <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-indigo-400" style={{
                        boxShadow: '0 0 10px rgba(99,102,241,0.6)',
                        animation: 'pulse-glow 2s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* ── Sticky 3D Navbar ────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-white/8"
                style={{
                    background: 'rgba(5, 5, 16, 0.8)',
                    backdropFilter: 'blur(24px) saturate(1.5)',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.05)',
                }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                            style={{
                                boxShadow: '0 4px 15px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                transformStyle: 'preserve-3d',
                            }}>
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                            LearnHub
                        </span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/15 hover:border-indigo-400/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                        style={{ backdropFilter: 'blur(12px)' }}
                    >
                        Dashboard <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            {/* ── 3D Hero / Search Section ─────────────────────────────────── */}
            <section
                ref={heroRef}
                onMouseMove={handleHeroMouse}
                className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center"
                style={{ perspective: '1200px' }}
            >
                {/* 3D Layered content */}
                <div style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${mousePos.x * 3}deg) rotateX(${mousePos.y * -3}deg)`,
                    transition: 'transform 0.15s ease-out',
                }}>
                    {/* AI tagline chip — Layer 3 (furthest forward) */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold mb-8 border transition-all duration-300"
                        style={{
                            background: 'rgba(99,102,241,0.12)',
                            borderColor: 'rgba(99,102,241,0.35)',
                            color: '#a5b4fc',
                            transform: `translateZ(60px) translateX(${mousePos.x * 15}px) translateY(${mousePos.y * 15}px)`,
                            boxShadow: '0 4px 20px rgba(99,102,241,0.15)',
                            backdropFilter: 'blur(12px)',
                        }}>
                        <Sparkles className="h-3.5 w-3.5" />
                        AI-Powered Recommendations
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    {/* 3D Hero Title — Layer 2 */}
                    <h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5 leading-tight hero-text-3d"
                        style={{
                            transform: `translateZ(40px) translateX(${mousePos.x * 8}px) translateY(${mousePos.y * 8}px)`,
                        }}
                    >
                        Browse{' '}
                        <span
                            className="relative inline-block"
                            style={{
                                background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc, #f472b6, #818cf8)',
                                backgroundSize: '300% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'text-shimmer 4s linear infinite',
                            }}
                        >
                            Courses
                        </span>
                    </h1>

                    {/* Subtitle — Layer 1 */}
                    <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-12"
                        style={{
                            transform: `translateZ(20px) translateX(${mousePos.x * 4}px) translateY(${mousePos.y * 4}px)`,
                        }}>
                        Personalized course recommendations generated in real time — based on your skills, goals,
                        and what top learners are doing right now.
                    </p>
                </div>

                {/* ── 3D Search Bar ────────────────────────────────────────── */}
                <div
                    className="relative max-w-2xl mx-auto mb-10 group"
                    style={{
                        perspectiveOrigin: 'center',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <div className="relative" style={{
                        transform: search ? 'translateZ(10px)' : 'translateZ(0)',
                        transition: 'transform 0.3s ease',
                    }}>
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-indigo-400 transition-colors z-10" />
                        <input
                            id="course-search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search courses, topics, skills..."
                            className="w-full pl-14 pr-14 py-5 rounded-2xl text-white placeholder:text-white/25 text-base outline-none transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: search ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: search
                                    ? '0 0 0 4px rgba(99,102,241,0.15), 0 8px 32px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    : '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── 3D Category Filters ──────────────────────────────────── */}
                <div className="flex flex-wrap justify-center gap-2.5 mb-8" style={{ perspective: '800px' }}>
                    {CATEGORIES.map((cat, i) => (
                        <button
                            key={cat}
                            id={`cat-${cat.toLowerCase()}`}
                            onClick={() => setCategory(cat)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                            style={category === cat
                                ? {
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9))',
                                    color: 'white',
                                    boxShadow: '0 8px 25px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                                    transform: 'translateZ(10px) translateY(-2px)',
                                    border: '1px solid transparent',
                                }
                                : {
                                    background: 'rgba(255,255,255,0.04)',
                                    color: 'rgba(255,255,255,0.5)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    transform: 'translateZ(0)',
                                    backdropFilter: 'blur(12px)',
                                }
                            }
                        >
                            {CATEGORY_ICONS[cat]}
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── 3D Sort Toggle ───────────────────────────────────────── */}
                <div className="inline-flex rounded-2xl overflow-hidden border border-white/8 p-1.5"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.2)',
                    }}>
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            id={`sort-${opt.toLowerCase().replace(' ', '-')}`}
                            onClick={() => setSort(opt)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                            style={sort === opt
                                ? {
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.3))',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                }
                                : { color: 'rgba(255,255,255,0.4)' }
                            }
                        >
                            {opt === 'Popular' && <TrendingUp className="h-4 w-4" />}
                            {opt === 'New' && <Sparkles className="h-4 w-4" />}
                            {opt === 'Top Rated' && <Star className="h-4 w-4" />}
                            {opt}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── 3D Course Grid ────────────────────────────────────────────── */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

                {/* Results count */}
                {!loading && (
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-white/8"
                            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
                            <Layers className="h-4 w-4 text-indigo-400" />
                            <span className="text-white/40">
                                {filtered.length === 0
                                    ? 'No courses match your filters.'
                                    : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} found${category !== 'All' ? ` in ${category}` : ''}${search ? ` for "${search}"` : ''}`
                                }
                            </span>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {fetchError && (
                    <div className="mb-8 p-5 rounded-2xl text-sm border"
                        style={{
                            background: 'rgba(239,68,68,0.08)',
                            borderColor: 'rgba(239,68,68,0.25)',
                            color: '#fca5a5',
                            boxShadow: '0 4px 20px rgba(239,68,68,0.1)',
                        }}>
                        ⚠️ {fetchError}
                    </div>
                )}

                {/* 3D Skeleton grid */}
                {loading && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: '1200px' }}>
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && !fetchError && (
                    <div className="text-center py-28" style={{ perspective: '800px' }}>
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                                transform: 'perspective(800px) rotateX(5deg)',
                                animation: 'float-3d 6s ease-in-out infinite',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <BookOpen className="h-12 w-12 text-white/15" />
                        </div>
                        <h2 className="text-xl font-semibold text-white/50 mb-3">No courses found</h2>
                        <p className="text-white/25 mb-8">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearch(''); setCategory('All'); }}
                            className="px-8 py-3 rounded-xl text-sm font-medium text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/15 transition-all duration-300"
                            style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.15)' }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* 3D Course Cards Grid */}
                {!loading && filtered.length > 0 && (
                    <div
                        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                        style={{ perspective: '1200px' }}
                    >
                        {filtered.map((course, index) => (
                            <CourseCard3D key={course.id} course={course} index={index} />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Ask AI Floating Button ─────────────────────────────────── */}
            <AskAIPanel />
        </div>
    );
}
