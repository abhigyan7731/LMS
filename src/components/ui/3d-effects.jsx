'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════
   TiltCard — Mouse-tracked 3D tilt effect
   Wrap any card for interactive perspective rotation
═══════════════════════════════════════════════════════ */
export function TiltCard({ children, className = '', intensity = 12, glare = true, ...props }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.1s ease-out',
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card-wrapper ${className}`}
      style={{ ...style, transformStyle: 'preserve-3d', willChange: 'transform' }}
      {...props}
    >
      {glare && <div className="tilt-glare" />}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FloatingParticles — Animated cosmic particle field
═══════════════════════════════════════════════════════ */
export function FloatingParticles({ count = 30, color = 'violet' }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  const colorMap = {
    violet: 'bg-violet-400',
    blue: 'bg-blue-400',
    amber: 'bg-amber-400',
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    mixed: '',
  };

  const mixedColors = ['bg-violet-400', 'bg-blue-400', 'bg-cyan-400', 'bg-purple-400', 'bg-pink-400'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full particle-float ${
            color === 'mixed' ? mixedColors[p.id % mixedColors.length] : colorMap[color]
          }`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GlowOrb — Stat card with orbiting glow ring
═══════════════════════════════════════════════════════ */
export function GlowOrb({ children, color = 'violet', className = '' }) {
  const glowColors = {
    violet: 'shadow-violet-500/30',
    blue: 'shadow-blue-500/30',
    emerald: 'shadow-emerald-500/30',
    amber: 'shadow-amber-500/30',
    orange: 'shadow-orange-500/30',
    cyan: 'shadow-cyan-500/30',
    pink: 'shadow-pink-500/30',
  };

  const ringColors = {
    violet: 'border-violet-500/30',
    blue: 'border-blue-500/30',
    emerald: 'border-emerald-500/30',
    amber: 'border-amber-500/30',
    orange: 'border-orange-500/30',
    cyan: 'border-cyan-500/30',
    pink: 'border-pink-500/30',
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Orbiting ring */}
      <div className={`absolute -inset-1 rounded-2xl border ${ringColors[color]} orbit-ring opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      {/* Glow backdrop */}
      <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 ${glowColors[color]}`} />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HoloBanner — Holographic welcome banner with scan-line
═══════════════════════════════════════════════════════ */
export function HoloBanner({ children, color = 'violet', className = '' }) {
  const bgMap = {
    violet: 'from-violet-600/10 via-purple-600/5 to-indigo-600/10',
    blue: 'from-blue-600/10 via-cyan-600/5 to-blue-600/10',
    amber: 'from-amber-600/10 via-orange-600/5 to-amber-600/10',
  };

  const borderMap = {
    violet: 'border-violet-500/20',
    blue: 'border-blue-500/20',
    amber: 'border-amber-500/20',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${borderMap[color]} bg-gradient-to-r ${bgMap[color]} backdrop-blur-xl ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 holo-scanline pointer-events-none" />
      {/* Holographic shimmer */}
      <div className="absolute inset-0 holo-shimmer pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ProgressRing3D — Animated circular progress with glow
═══════════════════════════════════════════════════════ */
export function ProgressRing3D({ progress = 0, size = 80, strokeWidth = 6, color = 'violet', children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const colorMap = {
    violet: { stroke: '#8b5cf6', glow: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.6))' },
    blue: { stroke: '#3b82f6', glow: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' },
    emerald: { stroke: '#10b981', glow: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' },
    amber: { stroke: '#f59e0b', glow: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' },
    cyan: { stroke: '#06b6d4', glow: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <div className="relative inline-flex items-center justify-center progress-ring-3d">
      <svg width={size} height={size} className="transform -rotate-90" style={{ filter: c.glow }}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={c.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-animated"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || <span className="text-sm font-bold text-white">{progress}%</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ActivityFeed — Mock live activity ticker for admin
═══════════════════════════════════════════════════════ */
export function ActivityFeed() {
  const [activities] = useState([
    { text: 'New student enrolled in React Fundamentals', time: '2m ago', type: 'enroll' },
    { text: 'Marcus Chen published a new course', time: '5m ago', type: 'publish' },
    { text: 'Priya Sharma completed TypeScript Mastery', time: '8m ago', type: 'complete' },
    { text: 'New teacher registration: Dr. Smith', time: '12m ago', type: 'register' },
    { text: 'Quiz completed by 15 students', time: '15m ago', type: 'quiz' },
    { text: 'Course "AI Basics" reached 100 enrollments', time: '20m ago', type: 'milestone' },
  ]);

  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const typeColors = {
    enroll: 'text-blue-400',
    publish: 'text-violet-400',
    complete: 'text-emerald-400',
    register: 'text-amber-400',
    quiz: 'text-cyan-400',
    milestone: 'text-pink-400',
  };

  const typeDots = {
    enroll: 'bg-blue-400',
    publish: 'bg-violet-400',
    complete: 'bg-emerald-400',
    register: 'bg-amber-400',
    quiz: 'bg-cyan-400',
    milestone: 'bg-pink-400',
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h3 className="text-sm font-semibold text-white">Live Activity</h3>
      </div>
      <div className="space-y-3 relative" style={{ minHeight: '120px' }}>
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 transition-all duration-500 ${
              idx === visibleIndex
                ? 'opacity-100 translate-y-0'
                : idx === (visibleIndex + 1) % activities.length
                ? 'opacity-60 translate-y-0'
                : idx === (visibleIndex + 2) % activities.length
                ? 'opacity-30 translate-y-0'
                : 'opacity-0 absolute'
            }`}
            style={{
              display:
                idx === visibleIndex ||
                idx === (visibleIndex + 1) % activities.length ||
                idx === (visibleIndex + 2) % activities.length
                  ? 'flex'
                  : 'none',
            }}
          >
            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${typeDots[activity.type]}`} />
            <div className="min-w-0">
              <p className={`text-xs ${typeColors[activity.type]} truncate`}>{activity.text}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
