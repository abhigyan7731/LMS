'use client';

import Link from 'next/link';
import { GraduationCap, Home, BookOpen, Code2, Brain, LayoutDashboard, ArrowRight } from 'lucide-react';

// ─── Inline SVG: Astronaut with floating laptop & graduation cap ──────────────
function AstronautIllustration() {
    return (
        <svg
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
        >
            {/* Glow beneath */}
            <ellipse cx="160" cy="295" rx="80" ry="14" fill="url(#glowGrad)" opacity="0.5" />

            {/* ── Body / suit ── */}
            <rect x="108" y="170" width="104" height="90" rx="28" fill="url(#suitGrad)" />
            {/* Suit highlight */}
            <rect x="120" y="178" width="40" height="6" rx="3" fill="white" opacity="0.18" />

            {/* Belt pack */}
            <rect x="128" y="228" width="64" height="22" rx="10" fill="url(#packGrad)" />
            <circle cx="160" cy="239" r="7" fill="url(#btnGrad)" />
            <circle cx="160" cy="239" r="3.5" fill="white" opacity="0.6" />

            {/* ── Helmet ── */}
            <circle cx="160" cy="145" r="52" fill="url(#helmetGrad)" />
            {/* Visor */}
            <path d="M120 135 Q160 175 200 135" fill="url(#visorGrad)" opacity="0.85" />
            <path d="M120 135 Q160 175 200 135" stroke="white" strokeWidth="1.5" opacity="0.3" />
            {/* Helmet ring */}
            <circle cx="160" cy="145" r="52" stroke="url(#ringGrad)" strokeWidth="4" />
            {/* Helmet shine */}
            <ellipse cx="143" cy="123" rx="14" ry="9" fill="white" opacity="0.12" transform="rotate(-30 143 123)" />

            {/* ── Face inside visor ── */}
            {/* Eyes */}
            <circle cx="148" cy="140" r="4.5" fill="white" opacity="0.9" />
            <circle cx="172" cy="140" r="4.5" fill="white" opacity="0.9" />
            <circle cx="149.5" cy="141" r="2" fill="#312e81" />
            <circle cx="173.5" cy="141" r="2" fill="#312e81" />
            <circle cx="150.5" cy="140" r="0.8" fill="white" />
            <circle cx="174.5" cy="140" r="0.8" fill="white" />
            {/* Smile */}
            <path d="M150 152 Q160 159 170 152" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

            {/* ── Arms ── */}
            {/* Left arm */}
            <rect x="72" y="176" width="38" height="22" rx="11" fill="url(#suitGrad)" transform="rotate(15 72 176)" />
            <circle cx="70" cy="205" r="14" fill="url(#gloveGrad)" />
            {/* Right arm */}
            <rect x="188" y="176" width="38" height="22" rx="11" fill="url(#suitGrad)" transform="rotate(-15 226 176)" />
            <circle cx="248" cy="205" r="14" fill="url(#gloveGrad)" />

            {/* ── Legs ── */}
            <rect x="126" y="252" width="28" height="42" rx="14" fill="url(#suitGrad)" />
            <rect x="166" y="252" width="28" height="42" rx="14" fill="url(#suitGrad)" />
            <rect x="120" y="283" width="38" height="18" rx="9" fill="url(#bootGrad)" />
            <rect x="160" y="283" width="38" height="18" rx="9" fill="url(#bootGrad)" />

            {/* ── Floating laptop (left) ── */}
            <g className="laptop-float">
                <rect x="34" y="120" width="64" height="44" rx="6" fill="#1e1b4b" />
                <rect x="37" y="123" width="58" height="36" rx="4" fill="#312e81" />
                {/* Screen code lines */}
                <rect x="42" y="128" width="28" height="3" rx="1.5" fill="#818cf8" opacity="0.7" />
                <rect x="42" y="134" width="20" height="3" rx="1.5" fill="#a5b4fc" opacity="0.5" />
                <rect x="42" y="140" width="34" height="3" rx="1.5" fill="#818cf8" opacity="0.4" />
                <rect x="42" y="146" width="16" height="3" rx="1.5" fill="#c4b5fd" opacity="0.6" />
                {/* Cursor blink */}
                <rect x="42" y="152" width="8" height="3" rx="1.5" fill="#a5b4fc" opacity="0.9" />
                {/* Hinge */}
                <rect x="30" y="163" width="72" height="6" rx="3" fill="#0f0a2a" />
            </g>

            {/* ── Floating graduation cap (right) ── */}
            <g className="cap-float">
                {/* Board */}
                <rect x="220" y="84" width="58" height="12" rx="3" fill="url(#capGrad)" transform="rotate(-8 220 84)" />
                {/* Top hat base */}
                <rect x="233" y="69" width="36" height="20" rx="4" fill="url(#capGrad)" transform="rotate(-8 233 69)" />
                {/* Tassel */}
                <line x1="275" y1="76" x2="283" y2="100" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="284" cy="103" r="5" fill="#fbbf24" />
                {/* Cap shine */}
                <rect x="237" y="73" width="12" height="4" rx="2" fill="white" opacity="0.2" transform="rotate(-8 237 73)" />
            </g>

            {/* ── Stars / sparkles ── */}
            <circle cx="52" cy="72" r="2.5" fill="white" opacity="0.7" />
            <circle cx="88" cy="46" r="1.5" fill="white" opacity="0.5" />
            <circle cx="240" cy="52" r="2" fill="white" opacity="0.6" />
            <circle cx="274" cy="138" r="1.5" fill="white" opacity="0.4" />
            <circle cx="296" cy="86" r="2" fill="white" opacity="0.5" />
            <circle cx="30" cy="168" r="1.5" fill="white" opacity="0.35" />

            {/* ── Defs ── */}
            <defs>
                <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0e7ff" />
                    <stop offset="100%" stopColor="#c7d2fe" />
                </linearGradient>
                <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dde5ff" />
                    <stop offset="100%" stopColor="#bfcbff" />
                </linearGradient>
                <linearGradient id="visorGrad" x1="0%" y1="70%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="gloveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c7d2fe" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                </linearGradient>
                <linearGradient id="packGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="bootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4338ca" />
                    <stop offset="100%" stopColor="#3730a3" />
                </linearGradient>
                <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function NotFound() {
    return (
        <div
            className="relative min-h-screen flex flex-col overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0a0818 0%, #0f0c29 25%, #1a1040 50%, #0d1b3e 75%, #060d1f 100%)',
            }}
        >
            {/* ── Animated CSS ─────────────────────────────────────────────── */}
            <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(1.5deg); }
          66%       { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes float-laptop {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50%       { transform: translateY(-14px) rotate(-4deg); }
        }
        @keyframes float-cap {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50%       { transform: translateY(-20px) rotate(7deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.06); }
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-20px, 15px) scale(0.97); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes num-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        .astronaut-float { animation: float-gentle 6s ease-in-out infinite; }
        .laptop-float    { animation: float-laptop 4.5s ease-in-out infinite 0.5s; }
        .cap-float       { animation: float-cap 5s ease-in-out infinite 1s; }
        .num-float       { animation: num-float 3.5s ease-in-out infinite; }
        .blob-drift      { animation: drift 18s ease-in-out infinite; }
        .blob-drift-2    { animation: drift 24s ease-in-out infinite reverse; }
        .blob-drift-3    { animation: drift 14s ease-in-out infinite 4s; }

        .star-1 { animation: twinkle 2.4s ease-in-out infinite; }
        .star-2 { animation: twinkle 3.1s ease-in-out infinite 0.8s; }
        .star-3 { animation: twinkle 1.8s ease-in-out infinite 1.4s; }
        .star-4 { animation: twinkle 2.9s ease-in-out infinite 0.3s; }
        .star-5 { animation: twinkle 2.2s ease-in-out infinite 1.9s; }

        .fade-in-1 { animation: slide-up 0.6s ease-out 0.1s both; }
        .fade-in-2 { animation: slide-up 0.6s ease-out 0.25s both; }
        .fade-in-3 { animation: slide-up 0.6s ease-out 0.4s both; }
        .fade-in-4 { animation: slide-up 0.6s ease-out 0.55s both; }
        .fade-in-5 { animation: slide-up 0.6s ease-out 0.7s both; }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
        }
        .btn-primary:hover {
          transform: scale(1.055) translateY(-2px);
          box-shadow: 0 12px 36px -6px rgba(99,102,241,0.6), 0 4px 12px rgba(99,102,241,0.3);
          filter: brightness(1.1);
        }
        .btn-secondary {
          transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
        }
        .btn-secondary:hover {
          transform: scale(1.04) translateY(-1px);
          background: rgba(255,255,255,0.1);
          border-color: rgba(165,180,252,0.6);
        }
        .quick-link {
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .quick-link:hover {
          color: #a5b4fc;
          transform: translateX(3px);
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
      `}</style>

            {/* ── Background blobs ─────────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
                <div className="blob-drift absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.12]"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
                <div className="blob-drift-2 absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.10]"
                    style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
                <div className="blob-drift-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.07]"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
            </div>

            {/* ── Twinkling stars ──────────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none select-none" aria-hidden="true">
                {[
                    { cls: 'star-1', top: '8%', left: '12%', size: 2.5 },
                    { cls: 'star-2', top: '15%', left: '78%', size: 2 },
                    { cls: 'star-3', top: '32%', left: '5%', size: 1.5 },
                    { cls: 'star-4', top: '55%', left: '91%', size: 2 },
                    { cls: 'star-5', top: '72%', left: '20%', size: 1.5 },
                    { cls: 'star-1', top: '88%', left: '65%', size: 2 },
                    { cls: 'star-3', top: '20%', left: '45%', size: 1.5 },
                    { cls: 'star-2', top: '45%', left: '55%', size: 1 },
                    { cls: 'star-4', top: '62%', left: '38%', size: 1.5 },
                ].map((s, i) => (
                    <div
                        key={i}
                        className={`${s.cls} absolute rounded-full bg-white`}
                        style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
                    />
                ))}
            </div>

            {/* ── Minimal top navigation ───────────────────────────────────── */}
            <nav className="relative z-20 flex items-center justify-between max-w-7xl mx-auto w-full px-6 py-5">
                <Link href="/" className="flex items-center gap-2.5 group" aria-label="LearnHub home">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        LearnHub
                    </span>
                </Link>

                <Link
                    href="/courses"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-indigo-400/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                    <BookOpen className="h-4 w-4" />
                    Browse Courses
                </Link>
            </nav>

            {/* ── Main content ─────────────────────────────────────────────── */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        {/* ── Left: Text content ───────────────────────────────────── */}
                        <div className="order-2 lg:order-1 text-center lg:text-left">

                            {/* Error badge */}
                            <div className="fade-in-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
                                style={{
                                    background: 'rgba(99,102,241,0.12)',
                                    borderColor: 'rgba(99,102,241,0.35)',
                                    color: '#a5b4fc',
                                }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
                                Page not found
                            </div>

                            {/* 404 floating number */}
                            <div className="fade-in-2 num-float mb-4">
                                <span
                                    className="text-[7rem] sm:text-[9rem] lg:text-[10rem] font-black leading-none select-none"
                                    style={{
                                        background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 70%, #e879f9 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        textShadow: 'none',
                                        filter: 'drop-shadow(0 0 40px rgba(129,140,248,0.35))',
                                    }}
                                >
                                    404
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="fade-in-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                                You're off the{' '}
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    learning path
                                </span>
                            </h1>

                            {/* Subtext */}
                            <p className="fade-in-4 text-base sm:text-lg text-white/50 leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
                                The page or course you're looking for has{' '}
                                <span className="text-white/70 font-medium">graduated</span> or never enrolled.
                                Let's get you back to learning.
                            </p>

                            {/* ── CTA Buttons ───────────────────────────────────────── */}
                            <div className="fade-in-5 flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-8">
                                <Link
                                    href="/courses"
                                    id="cta-browse-courses"
                                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-lg"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Browse Courses
                                    <ArrowRight className="h-4 w-4 ml-0.5" />
                                </Link>

                                <Link
                                    href="/"
                                    id="cta-go-home"
                                    className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white/80 border border-white/15"
                                >
                                    <Home className="h-4 w-4" />
                                    Go Home
                                </Link>
                            </div>

                            {/* ── Quick links ───────────────────────────────────────── */}
                            <div className="fade-in-5 flex flex-col sm:flex-row items-center lg:items-start gap-1 sm:gap-4 text-sm text-white/35">
                                <span className="hidden sm:inline text-white/20 text-xs uppercase tracking-wider mr-1">Explore:</span>
                                {[
                                    { href: '/courses?cat=AI', icon: <Brain className="h-3.5 w-3.5" />, label: 'AI Courses' },
                                    { href: '/courses?cat=Development', icon: <Code2 className="h-3.5 w-3.5" />, label: 'Web Development' },
                                    { href: '/dashboard', icon: <LayoutDashboard className="h-3.5 w-3.5" />, label: 'Dashboard' },
                                ].map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="quick-link flex items-center gap-1.5 text-white/40 py-1"
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Illustration ──────────────────────────────────── */}
                        <div className="order-1 lg:order-2 flex items-center justify-center">
                            {/* Outer decorative ring */}
                            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]">

                                {/* Pulsing rings */}
                                <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping"
                                    style={{ animationDuration: '3s' }} />
                                <div className="absolute inset-4 rounded-full border border-indigo-500/15"
                                    style={{ animation: 'pulse-ring 4s ease-in-out infinite' }} />
                                <div className="absolute inset-8 rounded-full border border-purple-500/10"
                                    style={{ animation: 'pulse-ring 4s ease-in-out infinite 1s' }} />

                                {/* Glass circle backdrop */}
                                <div className="absolute inset-12 rounded-full glass-card shadow-2xl"
                                    style={{ boxShadow: '0 0 80px rgba(99,102,241,0.2), inset 0 0 40px rgba(99,102,241,0.05)' }} />

                                {/* Astronaut illustration */}
                                <div className="astronaut-float absolute inset-10 flex items-center justify-center">
                                    <AstronautIllustration />
                                </div>

                                {/* Orbit dots */}
                                {[0, 72, 144, 216, 288].map((deg, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-2 h-2 rounded-full"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `rotate(${deg}deg) translate(130px) rotate(-${deg}deg)`,
                                            background: i % 2 === 0 ? '#6366f1' : '#a78bfa',
                                            boxShadow: `0 0 8px ${i % 2 === 0 ? '#6366f1' : '#a78bfa'}`,
                                            marginTop: -4,
                                            marginLeft: -4,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom glass card — fun messages ─────────────────────── */}
                    <div className="fade-in-5 mt-12 lg:mt-16 glass-card rounded-2xl px-6 py-4 max-w-2xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/30">
                            <span className="flex items-center gap-1.5">
                                <span className="text-indigo-400">✦</span>
                                5 courses available
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-purple-400">✦</span>
                                AI-powered recommendations
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-cyan-400">✦</span>
                                Learn at your own pace
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-pink-400">✦</span>
                                Free courses available
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Minimal footer ───────────────────────────────────────────── */}
            <footer className="relative z-10 text-center py-5 text-xs text-white/20 px-4">
                © {new Date().getFullYear()} LearnHub · AI-Powered Learning Platform
            </footer>
        </div>
    );
}
