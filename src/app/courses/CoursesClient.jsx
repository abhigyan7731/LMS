'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Search, SlidersHorizontal, X, Star, Clock, BookOpen,
    Users, TrendingUp, Sparkles, Zap, ChevronRight,
    MessageSquare, Send, Bot, GraduationCap, Flame,
    Code2, Palette, Brain, Database, Globe, Shield,
    ArrowUpRight, Play, Award
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
    Trending: 'bg-orange-100 text-orange-700 border-orange-200',
    'Top Rated': 'bg-amber-100 text-amber-700 border-amber-200',
    New: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Recommended: 'bg-violet-100 text-violet-700 border-violet-200',
    Popular: 'bg-rose-100 text-rose-700 border-rose-200',
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
                                    'text-gray-300 fill-gray-200'
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs font-semibold text-amber-600">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({(reviews / 1000).toFixed(1)}k)</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <Users className="h-3 w-3" />
                {(students / 1000).toFixed(1)}k
            </span>
        </div>
    );
}

// ─── Skeleton card for loading ───────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
            <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shimmer" />
            <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="pt-2 flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}

// ─── Course Card ─────────────────────────────────────────────────────────────
function CourseCard({ course }) {
    const meta = COURSE_META[course.slug] ?? DEFAULT_META;
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={`/courses/${course.slug}`} className="group block">
            <div
                className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/60 shadow-md transition-all duration-300 ease-out h-full flex flex-col"
                style={{
                    transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                    boxShadow: hovered
                        ? `0 20px 40px -8px ${meta.accent}33, 0 8px 16px -4px rgba(0,0,0,0.12), 0 0 0 1px ${meta.accent}40`
                        : '0 4px 12px -2px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />
                    {course.thumbnail_url && (
                        <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                            style={{ transform: hovered ? 'scale(1.12)' : 'scale(1)' }}
                        />
                    )}
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Price badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border ${Number(course.price) === 0
                                ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                                : 'bg-white/95 text-gray-900 border-white/50'
                            }`}>
                            {Number(course.price) === 0 ? '✦ FREE' : `$${Number(course.price).toFixed(2)}`}
                        </span>
                    </div>

                    {/* Tags */}
                    {meta.tags.length > 0 && (
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                            {meta.tags.slice(0, 1).map(tag => (
                                <span
                                    key={tag}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border shadow-sm backdrop-blur-sm ${TAG_STYLES[tag] ?? 'bg-gray-100 text-gray-600'}`}
                                >
                                    {TAG_ICONS[tag]}
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Play button on hover */}
                    <div
                        className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300"
                        style={{ opacity: hovered ? 1 : 0 }}
                    >
                        <div
                            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xl transition-transform duration-300"
                            style={{ transform: hovered ? 'scale(1)' : 'scale(0.8)' }}
                        >
                            <Play className="h-6 w-6 text-white fill-white ml-1" />
                        </div>
                    </div>

                    {/* Bottom info bar — course icon + category */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl drop-shadow-lg">{meta.icon}</span>
                            <span className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                {meta.category}
                            </span>
                        </div>
                        <span className="text-xs text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {meta.level}
                        </span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                    {/* Instructor */}
                    <p className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold mb-1.5">
                        {meta.instructor}
                    </p>

                    {/* Title */}
                    <h3
                        className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2 transition-colors duration-200"
                        style={{ color: hovered ? meta.accent : undefined }}
                    >
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1 mb-3">
                        {course.description ?? 'No description available.'}
                    </p>

                    {/* Rating row */}
                    <StarRating rating={meta.rating} reviews={meta.reviews} students={meta.students} />

                    {/* Hover info slide-up */}
                    <div
                        className="overflow-hidden transition-all duration-300 ease-out"
                        style={{ maxHeight: hovered ? '60px' : '0px', opacity: hovered ? 1 : 0 }}
                    >
                        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
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

                    {/* Footer: Enroll button */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-400">
                            {meta.lessons} lessons · {meta.duration}
                        </div>

                        <button
                            className="group/btn flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-md transition-all duration-300 overflow-hidden relative"
                            style={{ background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}bb)` }}
                        >
                            <span className="relative z-10">Enroll</span>
                            <ChevronRight
                                className="h-3.5 w-3.5 relative z-10 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                            />
                            {/* Ripple overlay */}
                            <div
                                className="absolute inset-0 bg-white/20 transition-opacity duration-300"
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
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                aria-label="Ask AI for course help"
            >
                {open
                    ? <X className="h-6 w-6 text-white" />
                    : <MessageSquare className="h-6 w-6 text-white" />
                }
                {!open && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* Panel */}
            <div
                className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-300 ease-out"
                style={{
                    transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'all' : 'none',
                    background: 'rgba(15, 15, 30, 0.95)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Header */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10"
                    style={{ background: 'linear-gradient(135deg, #6366f130, #a855f730)' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
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
                                        : 'bg-white/10 text-gray-100 rounded-bl-sm'
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
                            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
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
                            className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-gray-300 hover:bg-indigo-500/30 hover:text-white transition-colors border border-white/10"
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
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-indigo-400 transition-colors"
                    />
                    <button
                        onClick={() => send()}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-indigo-500/40 hover:scale-105 transition-all"
                    >
                        <Send className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main Client Component ───────────────────────────────────────────────────
export default function CoursesClient({ courses, fetchError }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('Popular');
    const [loading, setLoading] = useState(true);

    // Simulate initial load shimmer
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
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
        <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 70%, #1a1a2e 100%)',
        }}>

            {/* Global shimmer keyframe */}
            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .float-slow { animation: float 6s ease-in-out infinite; }
        .float-mid  { animation: float 4.5s ease-in-out infinite 1s; }
      `}</style>

            {/* ── Decorative background blobs ───────────────────────────── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
                <div className="float-slow absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
                <div className="float-mid absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
                <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
            </div>

            {/* ── Sticky Navbar ─────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-white/10"
                style={{ background: 'rgba(15, 12, 41, 0.85)', backdropFilter: 'blur(20px)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            LearnHub
                        </span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/80 border border-white/20 hover:border-indigo-400/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Dashboard <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            {/* ── Hero / Search Section ───────────────────────────────────── */}
            <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                {/* AI tagline chip */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
                    style={{ background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
                    <Sparkles className="h-3.5 w-3.5" />
                    AI-Powered Recommendations
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                    Browse{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Courses
                    </span>
                </h1>

                <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10">
                    Personalized course recommendations generated in real time — based on your skills, goals,
                    and what top learners are doing right now.
                </p>

                {/* ── Big Search Bar ─────────────────────────────────────────── */}
                <div className="relative max-w-2xl mx-auto mb-8 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        id="course-search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search courses, topics, skills..."
                        className="w-full pl-12 pr-12 py-4 rounded-2xl text-white placeholder:text-gray-500 text-base outline-none transition-all duration-300"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1.5px solid rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: search ? '0 0 0 3px rgba(99,102,241,0.3)' : 'none',
                            borderColor: search ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.12)',
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* ── Category Filters ──────────────────────────────────────── */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            id={`cat-${cat.toLowerCase()}`}
                            onClick={() => setCategory(cat)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                            style={category === cat
                                ? { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }
                                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }
                            }
                        >
                            {CATEGORY_ICONS[cat]}
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── Sort Toggle ───────────────────────────────────────────── */}
                <div className="inline-flex rounded-xl overflow-hidden border border-white/10 p-1"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            id={`sort-${opt.toLowerCase().replace(' ', '-')}`}
                            onClick={() => setSort(opt)}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            style={sort === opt
                                ? { background: 'rgba(99,102,241,0.3)', color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }
                                : { color: 'rgba(255,255,255,0.5)' }
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

            {/* ── Course Grid ─────────────────────────────────────────────── */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

                {/* Results count */}
                {!loading && (
                    <p className="text-sm text-white/40 mb-6">
                        {filtered.length === 0
                            ? 'No courses match your filters.'
                            : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} found${category !== 'All' ? ` in ${category}` : ''}${search ? ` for "${search}"` : ''}`
                        }
                    </p>
                )}

                {/* Error state */}
                {fetchError && (
                    <div className="mb-6 p-4 rounded-2xl text-sm border"
                        style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                        ⚠️ {fetchError}
                    </div>
                )}

                {/* Skeleton grid */}
                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && !fetchError && (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="h-10 w-10 text-white/20" />
                        </div>
                        <h2 className="text-xl font-semibold text-white/60 mb-2">No courses found</h2>
                        <p className="text-white/30 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearch(''); setCategory('All'); }}
                            className="px-6 py-2 rounded-xl text-sm font-medium text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/20 transition-all"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Course cards */}
                {!loading && filtered.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Ask AI Floating Button ─────────────────────────────────── */}
            <AskAIPanel />
        </div>
    );
}
