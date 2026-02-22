import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignOutButton } from '@clerk/nextjs';
import {
  Sparkles, BookOpen, GraduationCap, Zap, BarChart3, Users,
  Star, ArrowRight, Play, CheckCircle, ChevronRight,
  Brain, MessageSquare, Trophy, Rocket, Shield, Clock,
  Github, Twitter, Linkedin, BookMarked,
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
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: Zap,
    title: 'Auto Quiz Generation',
    desc: 'Our AI reads your video transcripts and generates smart multiple-choice quizzes in seconds, no manual work needed.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: MessageSquare,
    title: 'AI Study Assistant',
    desc: 'A context-aware chat assistant answers learner questions based on exactly what they\'re watching — like a tutor, 24/7.',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    desc: 'Students and instructors get real-time dashboards showing completion rates, quiz scores, and engagement trends.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    badge: 'New',
  },
  {
    icon: Users,
    title: 'Instructor Tools',
    desc: 'Manage students, view revenue, and create courses with a clean teacher dashboard built for productivity.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    desc: 'Enterprise-grade auth with Clerk, row-level security on Supabase, and fast global edge delivery.',
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    badge: 'Coming soon',
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
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'AI builds your course',
    desc: 'Chapters, descriptions, quizzes, and a study assistant are generated automatically and ready in minutes.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Learn & track progress',
    desc: 'Enroll, study at your pace, earn quiz badges, and watch your progress dashboard light up.',
    color: 'from-emerald-500 to-teal-500',
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

/* ─────────────────────────────────────────
   HELPER: Stars
───────────────────────────────────────── */
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
   PAGE
───────────────────────────────────────── */
export default async function HomePage() {
  let userId = null;
  try {
    const r = await auth();
    userId = r.userId;
  } catch { /* public */ }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 shadow-md">
              <GraduationCap className="h-4.5 w-4.5 text-white h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">LearnHub</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'How it works', 'Pricing', 'Testimonials'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {link}
              </a>
            ))}
            <Link
              href="/courses"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Courses
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {userId ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <SignOutButton>
                  <button className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-violet-200 dark:hover:shadow-violet-900/40">
                    Sign Out
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-violet-200 dark:hover:shadow-violet-900/40"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Background glows */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-400/5 to-purple-400/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="max-w-xl">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30 px-4 py-1.5 text-sm font-medium text-violet-700 dark:text-violet-300 mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Learning Platform
                <span className="ml-1 flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
                Build, learn, and{' '}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  teach with AI
                </span>{' '}
                courses.
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                LearnHub turns any topic into a structured course, auto-generates quizzes from your videos, and gives every student a personal AI study assistant — all in one platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href={userId ? '/dashboard' : '/sign-up'}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-300/40 dark:hover:shadow-violet-900/40 hover:-translate-y-0.5"
                >
                  <Rocket className="h-4 w-4" />
                  Start learning free
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-violet-300 dark:hover:border-violet-600 transition-all hover:-translate-y-0.5"
                >
                  <Play className="h-4 w-4 fill-current text-violet-600" />
                  Browse courses
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                {['No credit card required', 'Free forever plan', 'Loved by 1,200+ learners'].map((t, i) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — App Preview Mock */}
            <div className="relative hidden lg:block">
              {/* Floating stat cards */}
              <div className="absolute -top-6 -left-8 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3 shadow-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active learners</div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white">+1,200 this month</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-6 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3 shadow-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Avg. completion rate</div>
                    <div className="font-bold text-sm text-emerald-600">↑ 35% higher</div>
                  </div>
                </div>
              </div>

              {/* Main card mock */}
              <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                {/* Mock top bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-gray-400">learnhub.app/dashboard</span>
                </div>
                <div className="p-5 space-y-4">
                  {/* Course cards */}
                  {[
                    { title: 'React Fundamentals', progress: 72, color: 'from-violet-500 to-purple-600', emoji: '⚛️' },
                    { title: 'TypeScript Mastery', progress: 38, color: 'from-blue-500 to-cyan-500', emoji: '💙' },
                    { title: 'UI/UX Design Basics', progress: 91, color: 'from-pink-500 to-rose-500', emoji: '🎨' },
                  ].map((c) => (
                    <div key={c.title} className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-3.5">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-lg shadow`}>
                        {c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold mb-1.5 truncate">{c.title}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-500 shrink-0">{c.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* AI chat bubble */}
                  <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-4">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold">AI</div>
                      <div>
                        <p className="text-xs font-medium text-violet-700 dark:text-violet-300 mb-0.5">Study Assistant</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          "A React hook is a function that lets you 'hook into' React state and lifecycle features from functional components…"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quiz pill */}
                  <div className="flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3.5">
                    <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Quick quiz ready!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">5 questions · Generated from Chapter 3</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">Take it →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">Features</span>
            <h2 className="text-4xl font-extrabold mb-4">Everything you need to learn with AI.</h2>
            <p className="text-gray-600 dark:text-gray-400">One platform for students, instructors, and lifelong learners. No extra tools needed.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`relative rounded-2xl border border-gray-200 dark:border-gray-800 ${f.bg} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                {f.badge && (
                  <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full ${f.badge === 'New'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {f.badge}
                  </span>
                )}
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">How it works</span>
            <h2 className="text-4xl font-extrabold mb-4">From idea to course in minutes.</h2>
            <p className="text-gray-600 dark:text-gray-400">No experience required. LearnHub does the heavy lifting so you can focus on learning.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-violet-200 via-purple-300 to-violet-200 dark:from-violet-800 dark:via-purple-700 dark:to-violet-800" />

            {STEPS.map((s) => (
              <div key={s.num} className="relative flex flex-col items-center text-center group">
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-xl mb-6 group-hover:scale-110 transition-transform`}>
                  <s.icon className="h-8 w-8 text-white" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-xs font-black text-gray-700 dark:text-gray-200">
                    {s.num.slice(-1)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">Testimonials</span>
            <h2 className="text-4xl font-extrabold mb-4">Loved by students & instructors.</h2>
          </div>

          {/* Social proof bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-14 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Stars count={5} />
              <span className="font-bold text-gray-900 dark:text-white ml-1">4.9 / 5</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>From <strong className="text-gray-900 dark:text-white">500+</strong> learners</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span><strong className="text-gray-900 dark:text-white">1,200+</strong> courses created</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow">
                <Stars count={t.stars} />
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-white text-xs font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">Pricing</span>
            <h2 className="text-4xl font-extrabold mb-4">Start free. Upgrade when ready.</h2>
            <p className="text-gray-600 dark:text-gray-400">No surprises. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Perfect for getting started</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-gray-500 mb-1">/ month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-violet-400 hover:text-violet-600 transition-all"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-violet-500 bg-gradient-to-b from-violet-600 to-purple-700 p-8 text-white shadow-2xl shadow-violet-200 dark:shadow-violet-900/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-md">
                  ✦ MOST POPULAR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <p className="text-violet-200 text-sm">For serious learners & instructors</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">$19</span>
                  <span className="text-violet-200 mb-1">/ month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-violet-100">
                    <CheckCircle className="h-4 w-4 text-violet-200 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-all shadow-md"
              >
                Upgrade to Pro
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 px-8 py-20 text-center text-white overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <GraduationCap className="h-14 w-14 text-white/80" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
                Ready to learn smarter?
              </h2>
              <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto">
                Join 1,200+ students and instructors building the future of education with AI. Start free, no credit card needed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={userId ? '/dashboard' : '/sign-up'}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  <Rocket className="h-4 w-4" />
                  Get started with LearnHub
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all hover:-translate-y-0.5"
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
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">LearnHub</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                AI-powered learning management for the modern learner and instructor.
              </p>
              <div className="flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-violet-600 hover:border-violet-300 transition-colors">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2.5">
                {['Features', 'Pricing', 'Changelog', 'Roadmap'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {['Docs', 'Blog', 'Tutorials', 'Support'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span>© 2026 LearnHub. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Built with <span className="text-rose-500 mx-0.5">♥</span> for learners everywhere.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
