import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import AuthButtons from './auth-buttons';
import UpgradeProButton from '@/components/upgrade-pro-button';
import {
  Sparkles, BookOpen, GraduationCap, Zap, BarChart3, Users,
  Star, ArrowRight, Play, CheckCircle, ChevronRight,
  Brain, MessageSquare, Trophy, Rocket, Shield, Clock,
  Github, Twitter, Linkedin, BookMarked, Globe, Cpu, Code2,
  Layers, ArrowUpRight, Hexagon, Triangle,
} from 'lucide-react';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Course Generator',
    desc: 'Enter any topic and LearnHub instantly builds a structured syllabus, chapters, and rich descriptions — ready to publish.',
    color: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139,92,246,0.4)',
    iconBg: 'from-violet-500/20 to-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Auto Quiz Generation',
    desc: 'Our AI reads your video transcripts and generates smart multiple-choice quizzes in seconds, no manual work needed.',
    color: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(245,158,11,0.4)',
    iconBg: 'from-amber-500/20 to-orange-500/20',
  },
  {
    icon: MessageSquare,
    title: 'AI Study Assistant',
    desc: 'A context-aware chat assistant answers learner questions based on exactly what they\'re watching — like a tutor, 24/7.',
    color: 'from-sky-500 to-blue-600',
    glowColor: 'rgba(59,130,246,0.4)',
    iconBg: 'from-sky-500/20 to-blue-500/20',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    desc: 'Students and instructors get real-time dashboards showing completion rates, quiz scores, and engagement trends.',
    color: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.4)',
    iconBg: 'from-emerald-500/20 to-teal-500/20',
    badge: 'New',
  },
  {
    icon: Users,
    title: 'Instructor Tools',
    desc: 'Manage students, view revenue, and create courses with a clean teacher dashboard built for productivity.',
    color: 'from-pink-500 to-rose-500',
    glowColor: 'rgba(236,72,153,0.4)',
    iconBg: 'from-pink-500/20 to-rose-500/20',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    desc: 'Enterprise-grade auth with Clerk, row-level security on Supabase, and fast global edge delivery.',
    color: 'from-indigo-500 to-violet-500',
    glowColor: 'rgba(99,102,241,0.4)',
    iconBg: 'from-indigo-500/20 to-violet-500/20',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Computer Science Student',
    avatar: 'PS',
    color: 'from-violet-400 to-purple-500',
    quote: 'LearnHub helped me pass my algorithms exam. The AI quiz generator found gaps in my knowledge I didn\'t even know I had.',
    stars: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Online Instructor',
    avatar: 'MC',
    color: 'from-sky-400 to-blue-500',
    quote: 'I went from idea to published course in under an hour. The AI structure was better than anything I could write manually.',
    stars: 5,
  },
  {
    name: 'Aisha Okonkwo',
    role: 'UX Design Student',
    avatar: 'AO',
    color: 'from-amber-400 to-orange-500',
    quote: 'The study assistant is unreal. I asked it to explain a concept from the lecture and got a perfect, tailored answer instantly.',
    stars: 5,
  },
  {
    name: 'James O\'Brien',
    role: 'Full-Stack Developer & Instructor',
    avatar: 'JO',
    color: 'from-emerald-400 to-teal-500',
    quote: 'My student completion rate jumped from 18% to 52% after switching to LearnHub. The auto-quizzes keep learners engaged.',
    stars: 5,
  },
];

const STEPS = [
  {
    num: '01',
    icon: BookOpen,
    title: 'Choose your topic',
    desc: 'Type any subject — from "Python for beginners" to "Advanced Figma prototyping". LearnHub handles everything else.',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'AI builds your course',
    desc: 'Chapters, descriptions, quizzes, and a study assistant are generated automatically and ready in minutes.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Learn & track progress',
    desc: 'Enroll, study at your pace, earn quiz badges, and watch your progress dashboard light up.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
  },
];

const FREE_FEATURES = [
  '5 AI-generated courses',
  'Auto quiz generation',
  'Study assistant (limited)',
  'Basic progress tracking',
  'Browse course library',
];

const PRO_FEATURES = [
  'Unlimited AI courses',
  'Advanced quiz analytics',
  'Unlimited study assistant',
  'Full analytics dashboard',
  'Instructor revenue tracking',
  'Priority support',
  'Custom branding',
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   STAT COUNTER DISPLAY
───────────────────────────────────────── */
const STATS = [
  { value: '1,200+', label: 'Active Learners', icon: Users },
  { value: '500+', label: 'Courses Created', icon: BookOpen },
  { value: '35%', label: 'Higher Completion', icon: TrendingUp },
  { value: '4.9/5', label: 'Average Rating', icon: Star },
];

function TrendingUp() { return null; } // placeholder, we use the icon directly

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default async function HomePage() {
  let userId = null;
  try {
    const r = await auth();
    userId = r?.userId || null;
  } catch (e) {
    console.error('Homepage auth error:', e);
    userId = null;
  }

  return (
    <div className="min-h-screen bg-[#06060f] text-white overflow-x-hidden" style={{ perspective: '1200px' }}>

      {/* ══════════════════════════════════════
          ANIMATED BACKGROUND — Full page
      ══════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Gradient mesh */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(139,92,246,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(59,130,246,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 50% 80%, rgba(6,182,212,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 70% 70%, rgba(236,72,153,0.05) 0%, transparent 50%)
          `
        }} />
        {/* Perspective grid */}
        <div className="absolute inset-0 perspective-grid" />
        {/* Animated particles */}
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full particle-float"
            style={{
              left: `${(i * 31 + 17) % 100}%`,
              top: `${(i * 47 + 11) % 100}%`,
              width: (i % 4) + 1,
              height: (i % 4) + 1,
              backgroundColor: i % 4 === 0 ? 'rgba(139,92,246,0.5)' : i % 4 === 1 ? 'rgba(59,130,246,0.4)' : i % 4 === 2 ? 'rgba(6,182,212,0.4)' : 'rgba(236,72,153,0.3)',
              animationDelay: `${(i * 0.6) % 8}s`,
              animationDuration: `${6 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════
          3D NAVBAR — Floating Holographic Glass
      ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full" style={{ perspective: '1200px' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <div className="relative flex h-16 items-center justify-between rounded-2xl bg-white/[0.03] backdrop-blur-2xl px-6 navbar-3d navbar-depth-shadow navbar-inner-glow navbar-reflection"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(0)',
            }}
          >
            {/* Holographic shimmer sweep */}
            <div className="absolute inset-0 rounded-2xl holo-shimmer pointer-events-none" />

            {/* Animated edge glow particles */}
            <div className="absolute -top-px left-[20%] w-16 h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)',
                animation: 'border-gradient-shift 4s ease infinite',
                filter: 'blur(0.5px)',
              }}
            />
            <div className="absolute -top-px right-[30%] w-12 h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)',
                animation: 'border-gradient-shift 5s ease infinite 1s',
                filter: 'blur(0.5px)',
              }}
            />

            {/* Logo — 3D Rotating Cube */}
            <Link href="/" className="flex items-center gap-3.5 font-bold text-lg shrink-0 group relative z-10">
              <div className="relative">
                {/* 3D Cube */}
                <div className="cube-logo-wrapper">
                  <div className="cube-logo">
                    {/* Front face */}
                    <div className="cube-face cube-face-front">
                      <GraduationCap className="h-5 w-5 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
                    </div>
                    {/* Back face */}
                    <div className="cube-face cube-face-back">
                      <BookMarked className="h-5 w-5 text-white/90" />
                    </div>
                    {/* Right face */}
                    <div className="cube-face cube-face-right">
                      <Sparkles className="h-5 w-5 text-white/90" />
                    </div>
                    {/* Left face */}
                    <div className="cube-face cube-face-left">
                      <Brain className="h-5 w-5 text-white/90" />
                    </div>
                    {/* Top face */}
                    <div className="cube-face cube-face-top">
                      <Rocket className="h-5 w-5 text-white/90" />
                    </div>
                    {/* Bottom face */}
                    <div className="cube-face cube-face-bottom">
                      <Code2 className="h-5 w-5 text-white/80" />
                    </div>
                  </div>
                </div>
                {/* Shadow under cube */}
                <div className="cube-shadow" />
                {/* Orbiting ring on hover */}
                <div className="absolute -inset-2 rounded-xl border border-violet-500/20 opacity-0 group-hover:opacity-100 orbit-ring transition-opacity duration-500" />
              </div>

              {/* Brand text with 3D depth */}
              <div className="flex flex-col" style={{ transform: 'translateZ(8px)' }}>
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{
                  filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.3))',
                }}>
                  LearnHub
                </span>
                <span className="text-[9px] text-white/25 -mt-0.5 tracking-[0.25em] uppercase font-semibold flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                  AI Learning
                </span>
              </div>
            </Link>

            {/* Nav links — 3D hover with neon underline */}
            <nav className="hidden md:flex items-center gap-0.5 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
              {[
                { label: 'Features', icon: Layers },
                { label: 'How it works', icon: Cpu },
                { label: 'Pricing', icon: Zap },
                { label: 'Testimonials', icon: MessageSquare },
              ].map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                  className="nav-link-3d group flex items-center gap-1.5 text-sm text-white/40 hover:text-white font-medium px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-300"
                >
                  <Icon className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-all duration-300 -ml-1 group-hover:ml-0" />
                  {label}
                </a>
              ))}
              <Link
                href="/courses"
                className="nav-link-3d group flex items-center gap-1.5 text-sm text-white/40 hover:text-white font-medium px-3.5 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-300 ml-1"
              >
                <BookOpen className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-all duration-300 -ml-1 group-hover:ml-0" />
                Courses
                <ArrowUpRight className="h-3 w-3 opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </Link>
            </nav>

            {/* Auth */}
            <div className="relative z-10" style={{ transform: 'translateZ(5px)' }}>
              <AuthButtons userId={userId} />
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO — Cinematic 3D with floating cards
      ══════════════════════════════════════ */}
      <section className="relative pt-16 pb-32 sm:pt-24 sm:pb-40 overflow-hidden">
        {/* Extra depth blurs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-float-3d" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[100px] animate-float-3d-delayed" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Copy */}
            <div className="max-w-xl">
              {/* Badge — holographic pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-8 backdrop-blur-sm glow-border-violet tilt-in" style={{ animationDelay: '0.1s' }}>
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Learning Platform
                <span className="ml-1 flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-7 tilt-in" style={{ animationDelay: '0.2s' }}>
                <span className="text-white">Build, learn,</span><br />
                <span className="text-white">and </span>
                <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))' }}>
                  teach with AI
                </span>
              </h1>

              <p className="text-lg text-white/40 leading-relaxed mb-10 tilt-in" style={{ animationDelay: '0.3s' }}>
                LearnHub turns any topic into a structured course, auto-generates quizzes from your videos, and gives every student a personal AI study assistant — all in one platform.
              </p>

              {/* CTAs — 3D buttons */}
              <div className="flex flex-wrap gap-4 mb-10 tilt-in" style={{ animationDelay: '0.4s' }}>
                <Link
                  href={userId ? '/dashboard' : '/sign-up'}
                  className="btn-3d group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                >
                  <Rocket className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Start learning free
                  <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/courses"
                  className="btn-3d group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-7 py-4 text-sm font-bold text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <Play className="h-4 w-4 fill-current text-violet-400" />
                  Browse courses
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/30 tilt-in" style={{ animationDelay: '0.5s' }}>
                {['No credit card required', 'Free forever plan', 'Loved by 1,200+ learners'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — 3D Floating Dashboard Preview */}
            <div className="relative hidden lg:block" style={{ perspective: '1200px' }}>
              {/* Floating stat card — top left */}
              <div className="absolute -top-8 -left-10 z-30 float-3d">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-4 py-3 shadow-depth-2" style={{ boxShadow: '0 0 30px rgba(139,92,246,0.15), 0 8px 30px rgba(0,0,0,0.3)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Active learners</div>
                    <div className="font-bold text-sm text-white">+1,200 this month</div>
                  </div>
                </div>
              </div>

              {/* Floating stat card — bottom right */}
              <div className="absolute -bottom-6 -right-8 z-30 float-3d-delayed">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-4 py-3 shadow-depth-2" style={{ boxShadow: '0 0 30px rgba(16,185,129,0.15), 0 8px 30px rgba(0,0,0,0.3)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Completion rate</div>
                    <div className="font-bold text-sm text-emerald-400">↑ 35% higher</div>
                  </div>
                </div>
              </div>

              {/* Main preview card — 3D tilted with neon border */}
              <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-depth-3 overflow-hidden card-3d" style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 0 0 1px rgba(139,92,246,0.1), 0 20px 60px -10px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.05)',
              }}>
                {/* Top bar — mock browser */}
                <div className="flex items-center gap-1.5 px-5 py-3 border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                  <span className="ml-3 text-[10px] text-white/20 font-mono">learnhub.app/dashboard</span>
                </div>

                {/* Holographic overlay */}
                <div className="absolute inset-0 holo-shimmer pointer-events-none" />

                <div className="p-5 space-y-3 relative z-10">
                  {/* Course cards */}
                  {[
                    { title: 'React Fundamentals', progress: 72, color: 'from-violet-500 to-purple-600', emoji: '⚛️' },
                    { title: 'TypeScript Mastery', progress: 38, color: 'from-blue-500 to-cyan-500', emoji: '💙' },
                    { title: 'UI/UX Design Basics', progress: 91, color: 'from-pink-500 to-rose-500', emoji: '🎨' },
                  ].map((c) => (
                    <div key={c.title} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 hover:bg-white/[0.06] transition-all duration-300 group">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${c.color} text-lg shadow-lg`}>
                        {c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white/80 mb-1 truncate">{c.title}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-white/30">{c.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* AI chat bubble */}
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-3 glow-border-violet">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-black text-white shadow-lg shadow-violet-500/30">AI</div>
                      <div>
                        <p className="text-[10px] font-semibold text-violet-400 mb-0.5">Study Assistant</p>
                        <p className="text-[10px] text-white/40">"A React hook is a function that lets you 'hook into' React state and lifecycle features…"</p>
                      </div>
                    </div>
                  </div>

                  {/* Quiz pill */}
                  <div className="flex items-center gap-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-3">
                    <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-amber-400">Quick quiz ready!</p>
                      <p className="text-[10px] text-white/30">5 questions · Generated from Chapter 3</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400/60">Take it →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR — Glowing counters
      ══════════════════════════════════════ */}
      <section className="relative py-12 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1,200+', label: 'Active Learners', color: 'text-violet-400' },
              { value: '500+', label: 'Courses Created', color: 'text-cyan-400' },
              { value: '35%', label: 'Higher Completion', color: 'text-emerald-400' },
              { value: '4.9/5', label: 'Average Rating', color: 'text-amber-400' },
            ].map((stat, idx) => (
              <div key={stat.label} className="text-center tilt-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={`text-3xl sm:text-4xl font-extrabold ${stat.color} mb-1`} style={{ filter: `drop-shadow(0 0 20px currentColor)` }}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/30 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — 3D Holographic Cards
      ══════════════════════════════════════ */}
      <section id="features" className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Layers className="w-3 h-3" /> Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">learn with AI</span>.
            </h2>
            <p className="text-white/40 text-lg">One platform for students, instructors, and lifelong learners. No extra tools needed.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, idx) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 card-3d glass-card-hover tilt-in overflow-hidden"
                style={{ animationDelay: `${idx * 0.08}s`, transformStyle: 'preserve-3d' }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ boxShadow: `inset 0 0 40px ${f.glowColor}, 0 0 30px ${f.glowColor}` }}
                />
                {/* Holo line */}
                <div className="absolute inset-0 holo-shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                {f.badge && (
                  <span className="absolute top-4 right-4 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                    {f.badge}
                  </span>
                )}

                <div className="relative z-10">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-lg mb-5 group-hover:scale-110 group-hover:shadow-depth-2 transition-all duration-500 depth-breathe`} style={{ transform: 'translateZ(20px)' }}>
                    <f.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white" style={{ transform: 'translateZ(10px)' }}>{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed" style={{ transform: 'translateZ(5px)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — 3D Timeline
      ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Cpu className="w-3 h-3" /> How it works
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
              From idea to course in{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">minutes</span>.
            </h2>
            <p className="text-white/40 text-lg">No experience required. LearnHub does the heavy lifting so you can focus on learning.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative" style={{ perspective: '1200px' }}>
            {/* Connector line with glow */}
            <div className="hidden md:block absolute top-20 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px" style={{
              background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(6,182,212,0.5), rgba(16,185,129,0.3))',
              boxShadow: '0 0 15px rgba(6,182,212,0.3)',
            }} />

            {STEPS.map((s, idx) => (
              <div key={s.num} className="relative flex flex-col items-center text-center group tilt-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="relative mb-8">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${s.color} shadow-depth-2 group-hover:scale-110 group-hover:shadow-depth-3 transition-all duration-500 depth-breathe`} style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: `0 0 40px ${s.glow}, 0 20px 40px rgba(0,0,0,0.3)`,
                  }}>
                    <s.icon className="h-10 w-10 text-white" style={{ transform: 'translateZ(12px)' }} />
                  </div>
                  {/* Number badge */}
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#0c0c1a] border border-white/10 text-xs font-black text-white shadow-depth-1">{s.num.slice(-1)}</span>
                  {/* Orbiting ring */}
                  <div className="absolute -inset-3 rounded-3xl border border-white/[0.06] opacity-0 group-hover:opacity-100 orbit-ring transition-opacity" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS — Floating Glass Cards
      ══════════════════════════════════════ */}
      <section id="testimonials" className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <MessageSquare className="w-3 h-3" /> Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
              Loved by students &{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">instructors</span>.
            </h2>
          </div>

          {/* Social proof bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-14 text-sm text-white/40">
            <div className="flex items-center gap-1.5">
              <Stars count={5} />
              <span className="font-bold text-white ml-1">4.9 / 5</span>
            </div>
            <span className="text-white/10">|</span>
            <span>From <strong className="text-white">500+</strong> learners</span>
            <span className="text-white/10">|</span>
            <span><strong className="text-white">1,200+</strong> courses created</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 card-3d glass-card-hover tilt-in"
                style={{ animationDelay: `${idx * 0.1}s`, transformStyle: 'preserve-3d' }}
              >
                <Stars count={t.stars} />
                <p className="mt-4 text-sm text-white/50 leading-relaxed flex-1" style={{ transform: 'translateZ(5px)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} text-white text-xs font-bold shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING — 3D Holographic Cards
      ══════════════════════════════════════ */}
      <section id="pricing" className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
              Start free.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Upgrade when ready.</span>
            </h2>
            <p className="text-white/40 text-lg">No surprises. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto" style={{ perspective: '1200px' }}>
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 card-3d glass-card" style={{ transformStyle: 'preserve-3d' }}>
              <div className="mb-8" style={{ transform: 'translateZ(10px)' }}>
                <h3 className="text-xl font-bold text-white mb-1">Free</h3>
                <p className="text-white/30 text-sm">Perfect for getting started</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-white">$0</span>
                  <span className="text-white/30 mb-1.5">/ month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8" style={{ transform: 'translateZ(5px)' }}>
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/50">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="btn-3d flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
              >
                Get started free
              </Link>
            </div>

            {/* Pro — Holographic */}
            <div className="relative rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-600/20 to-purple-700/10 p-8 card-3d glow-pulse overflow-hidden" style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 0 0 1px rgba(139,92,246,0.2)',
            }}>
              {/* Holographic effects */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="holo-scanline absolute inset-0" />
                <div className="holo-shimmer absolute inset-0" />
              </div>

              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-depth-2">
                  ✦ MOST POPULAR
                </span>
              </div>

              <div className="relative z-10">
                <div className="mb-8" style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                  <p className="text-violet-300/60 text-sm">For serious learners & instructors</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-5xl font-extrabold text-white">$19</span>
                    <span className="text-violet-300/40 mb-1.5">/ month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8" style={{ transform: 'translateZ(8px)' }}>
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-violet-200/60">
                      <CheckCircle className="h-4 w-4 text-violet-300/60 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <UpgradeProButton userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA — Cinematic 3D
      ══════════════════════════════════════ */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1), rgba(6,182,212,0.08))',
            border: '1px solid rgba(139,92,246,0.15)',
            boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 40px 80px -20px rgba(0,0,0,0.5)',
          }}>
            {/* Background effects */}
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-violet-500/10 blur-[80px] animate-float-3d" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-cyan-500/8 blur-[80px] animate-float-3d-delayed" />
            <div className="absolute inset-0 holo-shimmer pointer-events-none" />
            <div className="absolute inset-0 perspective-grid pointer-events-none opacity-30" />

            <div className="relative z-10 px-8 py-20 text-center">
              <div className="flex justify-center mb-6">
                <div className="depth-breathe">
                  <GraduationCap className="h-16 w-16 text-violet-400" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.5))' }} />
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-white" style={{ transform: 'translateZ(20px)' }}>
                Ready to learn smarter?
              </h2>
              <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                Join 1,200+ students and instructors building the future of education with AI. Start free, no credit card needed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={userId ? '/dashboard' : '/sign-up'}
                  className="btn-3d inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
                >
                  <Rocket className="h-4 w-4" />
                  Get started with LearnHub
                </Link>
                <Link
                  href="/courses"
                  className="btn-3d inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-8 py-4 text-sm font-bold text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  Browse courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER — Immersive 3D Holographic
      ══════════════════════════════════════ */}
      <footer className="relative overflow-hidden" style={{ perspective: '1200px' }}>
        {/* ── Top divider — animated gradient line ── */}
        <div className="relative h-px w-full">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 20%, rgba(6,182,212,0.3) 40%, rgba(236,72,153,0.3) 60%, rgba(139,92,246,0.4) 80%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'border-gradient-shift 6s ease infinite',
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.2) 20%, rgba(6,182,212,0.15) 50%, rgba(139,92,246,0.2) 80%, transparent 100%)',
            filter: 'blur(4px)',
          }} />
        </div>

        {/* ── Background effects ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Perspective grid floor */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'perspective(400px) rotateX(45deg)',
            transformOrigin: 'center bottom',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)',
          }} />

          {/* Floating glow orbs */}
          <div className="absolute bottom-[-20%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,1), transparent 70%)', animation: 'float-3d 10s ease-in-out infinite' }} />
          <div className="absolute bottom-[-10%] right-[15%] w-[350px] h-[350px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,1), transparent 70%)', animation: 'float-3d-delayed 12s ease-in-out infinite' }} />
          <div className="absolute top-[20%] left-[50%] w-[300px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, rgba(236,72,153,1), transparent 70%)', animation: 'float-3d 8s ease-in-out infinite 2s' }} />

          {/* Floating particles */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full particle-float"
              style={{
                left: `${(i * 23 + 8) % 100}%`,
                top: `${(i * 37 + 15) % 100}%`,
                width: (i % 3) + 1.5,
                height: (i % 3) + 1.5,
                backgroundColor: i % 3 === 0 ? 'rgba(139,92,246,0.4)' : i % 3 === 1 ? 'rgba(6,182,212,0.35)' : 'rgba(236,72,153,0.3)',
                animationDelay: `${(i * 0.8) % 6}s`,
                animationDuration: `${7 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        {/* ── Footer content ── */}
        <div className="relative z-10 pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* ── Brand Column — 3D Glass Card ── */}
            <div className="relative">
              {/* Glassmorphic card wrapper */}
              <div className="rounded-2xl p-6 -m-2 relative overflow-hidden" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
                {/* Holo shimmer */}
                <div className="absolute inset-0 holo-shimmer pointer-events-none rounded-2xl" />

                {/* Logo with mini 3D cube */}
                <Link href="/" className="flex items-center gap-3 font-bold text-lg mb-5 group">
                  <div className="relative">
                    <div className="cube-logo-wrapper" style={{ width: '36px', height: '36px' }}>
                      <div className="cube-logo" style={{ width: '36px', height: '36px' }}>
                        <div className="cube-face cube-face-front" style={{ width: '36px', height: '36px', borderRadius: '8px', transform: 'translateZ(18px)' }}>
                          <GraduationCap className="h-4.5 w-4.5 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }} />
                        </div>
                        <div className="cube-face cube-face-back" style={{ width: '36px', height: '36px', borderRadius: '8px', transform: 'rotateY(180deg) translateZ(18px)' }}>
                          <BookMarked className="h-4 w-4 text-white/90" />
                        </div>
                        <div className="cube-face cube-face-right" style={{ width: '36px', height: '36px', borderRadius: '8px', transform: 'rotateY(90deg) translateZ(18px)' }}>
                          <Sparkles className="h-4 w-4 text-white/90" />
                        </div>
                        <div className="cube-face cube-face-left" style={{ width: '36px', height: '36px', borderRadius: '8px', transform: 'rotateY(-90deg) translateZ(18px)' }}>
                          <Brain className="h-4 w-4 text-white/90" />
                        </div>
                        <div className="cube-face cube-face-top" style={{ width: '36px', height: '36px', borderRadius: '8px', transform: 'rotateX(90deg) translateZ(18px)' }}>
                          <Rocket className="h-4 w-4 text-white/90" />
                        </div>
                        <div className="cube-face cube-face-bottom" style={{ width: '36px', height: '36px', borderRadius: '8px', transform: 'rotateX(-90deg) translateZ(18px)' }}>
                          <Code2 className="h-4 w-4 text-white/80" />
                        </div>
                      </div>
                    </div>
                    <div className="cube-shadow" style={{ width: '24px' }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-extrabold tracking-tight" style={{ filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.3))' }}>
                      LearnHub
                    </span>
                    <span className="text-[8px] text-white/25 -mt-0.5 tracking-[0.2em] uppercase font-semibold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                      AI Learning Platform
                    </span>
                  </div>
                </Link>

                <p className="text-sm text-white/30 leading-relaxed mb-6">
                  AI-powered learning management for the modern learner and instructor.
                </p>

                {/* Social links — 3D press buttons */}
                <div className="flex gap-2.5">
                  {[
                    { Icon: Twitter, glow: 'rgba(59,130,246,0.4)', hoverBg: 'rgba(59,130,246,0.15)', hoverBorder: 'rgba(59,130,246,0.3)' },
                    { Icon: Github, glow: 'rgba(255,255,255,0.3)', hoverBg: 'rgba(255,255,255,0.08)', hoverBorder: 'rgba(255,255,255,0.2)' },
                    { Icon: Linkedin, glow: 'rgba(59,130,246,0.4)', hoverBg: 'rgba(59,130,246,0.15)', hoverBorder: 'rgba(59,130,246,0.3)' },
                  ].map(({ Icon, glow, hoverBg, hoverBorder }, i) => (
                    <a
                      key={i}
                      href="#"
                      className="btn-3d flex h-10 w-10 items-center justify-center rounded-xl text-white/30 hover:text-white transition-all duration-300 group"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Link Columns — 3D Hover Links ── */}
            {[
              { title: 'Product', icon: Layers, links: ['Features', 'Pricing', 'Changelog', 'Roadmap'], color: 'violet' },
              { title: 'Resources', icon: BookOpen, links: ['Docs', 'Blog', 'Tutorials', 'Support'], color: 'cyan' },
              { title: 'Legal', icon: Shield, links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'], color: 'pink' },
            ].map(({ title, icon: SectionIcon, links, color }) => {
              const colorMap = {
                violet: { accent: 'rgba(139,92,246,', text: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/10' },
                cyan: { accent: 'rgba(6,182,212,', text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
                pink: { accent: 'rgba(236,72,153,', text: 'text-pink-400', border: 'border-pink-500/20', bg: 'bg-pink-500/10' },
              };
              const c = colorMap[color];
              return (
                <div key={title}>
                  {/* Section header with icon */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg} border ${c.border}`}
                      style={{ boxShadow: `0 0 12px ${c.accent}0.15)` }}>
                      <SectionIcon className={`h-3.5 w-3.5 ${c.text}`} />
                    </div>
                    <h4 className={`text-xs font-bold uppercase tracking-[0.2em] ${c.text}`}>
                      {title}
                    </h4>
                  </div>

                  {/* Links with 3D hover */}
                  <ul className="space-y-1">
                    {links.map((l, li) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="group flex items-center gap-2 text-sm text-white/30 hover:text-white py-2 px-3 -mx-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                          style={{
                            transformStyle: 'preserve-3d',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {/* Animated dash indicator */}
                          <span
                            className="w-0 group-hover:w-4 h-px transition-all duration-300 flex-shrink-0"
                            style={{ background: `${c.accent}0.6)`, boxShadow: `0 0 6px ${c.accent}0.3)` }}
                          />
                          <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                            {l}
                          </span>
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-40 -ml-1 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* ── Newsletter CTA — Glassmorphic ── */}
          <div className="relative rounded-2xl p-8 mb-12 overflow-hidden" style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(139,92,246,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2), 0 0 40px rgba(139,92,246,0.04)',
            backdropFilter: 'blur(20px)',
          }}>
            <div className="absolute inset-0 holo-shimmer pointer-events-none rounded-2xl" />
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, transparent 50%, rgba(6,182,212,0.03) 100%)',
            }} />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg depth-breathe"
                  style={{ boxShadow: '0 0 25px rgba(139,92,246,0.3), 0 8px 20px rgba(0,0,0,0.3)' }}>
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5">Stay in the loop</h3>
                  <p className="text-sm text-white/30">Get the latest updates on new courses, features, and AI tools.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 sm:w-56 px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <button className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg transition-all"
                  style={{ boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom bar — 3D floating ── */}
          <div className="relative rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            {/* Subtle top glow line */}
            <div className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{
              background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(6,182,212,0.15), rgba(139,92,246,0.2), transparent)',
            }} />

            <span className="text-xs text-white/25 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              © 2026 LearnHub. All rights reserved.
            </span>

            <div className="flex items-center gap-4 text-xs text-white/20">
              <span className="flex items-center gap-1.5">
                Built with
                <span className="relative inline-block">
                  <span className="text-rose-400 text-sm" style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.5))' }}>♥</span>
                </span>
                for learners everywhere.
              </span>
              <span className="text-white/10">|</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-violet-400" />
                <span className="text-violet-400/60 font-medium">Powered by AI</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
