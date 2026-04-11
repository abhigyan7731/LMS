'use client';

import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { GraduationCap, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AuthButtons({ userId }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-3">
        {userId ? (
          <>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 backdrop-blur-sm"
            >
              <LayoutDashboard className="h-4 w-4 group-hover:text-violet-400 transition-colors" />
              Dashboard
            </Link>
            <SignOutButton>
              <button className="btn-3d flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </SignOutButton>
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-white/60 hover:text-white px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 backdrop-blur-sm"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="btn-3d flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden glass-card border-t border-white/[0.06] p-4 space-y-3 z-50 animate-slide-up">
          {['Features', 'How it works', 'Pricing', 'Testimonials'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, '-')}`}
              className="block text-sm text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <Link
            href="/courses"
            className="block text-sm text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(false)}
          >
            Courses
          </Link>
          <div className="border-t border-white/10 pt-3 flex gap-2">
            {userId ? (
              <>
                <Link href="/dashboard" className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white transition-all">
                  Dashboard
                </Link>
                <SignOutButton>
                  <button className="flex-1 text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                    Sign Out
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all">
                  Sign In
                </Link>
                <Link href="/sign-up" className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
