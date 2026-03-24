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
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome to LearnHub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Hey {firstName}! 👋
          </h1>
          <p className="text-white/50 text-lg">
            How are you planning to use LearnHub?
          </p>
        </div>

        {/* Role cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {ROLES.map((r) => {
            const selected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-300 group
                  ${selected
                    ? `${r.border} ${r.bg} shadow-2xl ${r.glow} scale-[1.02] ring-4 ${r.ring}`
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                  }`}
              >
                {/* Selected checkmark */}
                {selected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className={`w-5 h-5 text-white`} />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <r.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <div className="mb-1">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{r.subtitle}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{r.title}</h2>
                <p className="text-sm text-white/50 leading-relaxed mb-5">{r.description}</p>

                {/* Perks */}
                <ul className="space-y-1.5">
                  {r.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-white/80' : 'text-white/30'}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!role || loading}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300
            ${role
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-2xl shadow-violet-500/30 hover:-translate-y-0.5'
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
            }
            ${loading ? 'opacity-70' : ''}
          `}
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
          <p className="text-center text-xs text-white/30 mt-4">
            {role === 'teacher'
              ? "You'll be taken to the Teacher Portal to create your first course."
              : "You'll be taken to the Course Library to start exploring."}
          </p>
        )}
      </div>
    </div>
  );
}
