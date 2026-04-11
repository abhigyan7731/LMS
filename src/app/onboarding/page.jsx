'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { GraduationCap, BookOpen, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    subtitle: 'I want to learn',
    description: 'Browse and enroll in courses, track your progress, get AI-powered quizzes, and learn at your own pace.',
    perks: ['Access all courses', 'AI Study Assistant', 'Progress tracking', 'Earn certificates'],
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/25',
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/40',
    glowBorder: 'glow-border-blue',
    glowShadow: 'shadow-glow-blue',
  },
  {
    id: 'teacher',
    icon: BookOpen,
    title: 'Teacher',
    subtitle: 'I want to teach',
    description: 'Create and publish courses, upload lectures, manage students, and track your revenue and performance.',
    perks: ['Create courses', 'Upload lectures', 'Manage students', 'Track earnings'],
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/25',
    border: 'border-violet-500',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/40',
    glowBorder: 'glow-border-violet',
    glowShadow: 'shadow-glow-violet',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(`Welcome aboard as a ${role}!`);
        // Redirect based on role
        if (role === 'teacher') {
          router.push('/teacher');
        } else {
          router.push('/student');
        }
        router.refresh();
      } else {
        const msg = data.error || data.message || `Request failed (${res.status})`;
        toast.error(msg);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.firstName ?? 'there';

  return (
    <div className="min-h-screen gradient-mesh-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={`absolute rounded-full particle-float ${
              ['bg-violet-400', 'bg-blue-400', 'bg-cyan-400', 'bg-purple-400'][i % 4]
            }`}
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

      {/* Perspective grid */}
      <div className="fixed inset-0 perspective-grid pointer-events-none z-0" />

      {/* Background glows — 3D animated */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-3xl pointer-events-none animate-float-3d" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/8 blur-3xl pointer-events-none animate-float-3d-delayed" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header — 3D holographic */}
        <div className="text-center mb-10 tilt-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 mb-6 backdrop-blur-sm glow-border-violet">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome to LearnHub
            <span className="ml-1 flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3" style={{ filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.15))' }}>
            Hey {firstName}! 👋
          </h1>
          <p className="text-white/40 text-lg">
            How are you planning to use LearnHub?
          </p>
        </div>

        {/* Role cards — 3D tilt with depth */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8" style={{ perspective: '1000px' }}>
          {ROLES.map((r, idx) => {
            const selected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-500 group card-3d tilt-in
                  ${selected
                    ? `${r.border} ${r.bg} shadow-depth-3 ${r.glowBorder} scale-[1.03] ring-4 ${r.ring}`
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] glass-card'
                  }`}
                style={{ animationDelay: `${idx * 0.15}s`, transformStyle: 'preserve-3d' }}
              >
                {/* Selected checkmark — 3D pop */}
                {selected && (
                  <div className="absolute top-4 right-4" style={{ transform: 'translateZ(20px)' }}>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Holographic shimmer on selected */}
                {selected && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="holo-shimmer absolute inset-0" />
                  </div>
                )}

                {/* Icon — 3D floating with orbit */}
                <div className="relative mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 ${selected ? 'depth-breathe' : ''}`} style={{ transform: 'translateZ(15px)' }}>
                    <r.icon className="w-7 h-7 text-white" />
                  </div>
                  {/* Orbit ring */}
                  {selected && (
                    <div className="absolute -inset-2 rounded-2xl border border-white/15 orbit-ring" />
                  )}
                </div>

                {/* Title — 3D depth */}
                <div className="mb-1" style={{ transform: 'translateZ(8px)' }}>
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">{r.subtitle}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ transform: 'translateZ(10px)' }}>{r.title}</h2>
                <p className="text-sm text-white/40 leading-relaxed mb-5" style={{ transform: 'translateZ(5px)' }}>{r.description}</p>

                {/* Perks — 3D */}
                <ul className="space-y-1.5" style={{ transform: 'translateZ(3px)' }}>
                  {r.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-white/50">
                      <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 transition-all duration-300 ${selected ? 'text-white/80' : 'text-white/20'}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA — 3D button press */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!role || loading}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 tilt-in
            ${role
              ? 'btn-3d bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-depth-2 shadow-violet-500/30 hover:shadow-depth-3'
              : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.06] glass-card'
            }
            ${loading ? 'opacity-70' : ''}
          `}
          style={{ animationDelay: '0.3s' }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Setting up your account…
            </>
          ) : (
            <>
              {role
                ? `Continue as ${role === 'teacher' ? 'Teacher' : 'Student'}`
                : 'Select a role to continue'
              }
              {role && <ArrowRight className="w-5 h-5" />}
            </>
          )}
        </button>

        {role && (
          <p className="text-center text-xs text-white/25 mt-4 tilt-in" style={{ animationDelay: '0.4s' }}>
            {role === 'teacher'
              ? "You'll be taken to the Teacher Portal to create your first course."
              : "You'll be taken to the Course Library to start exploring."}
          </p>
        )}
      </div>
    </div>
  );
}
