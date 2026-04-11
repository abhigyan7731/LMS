'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Menu,
    X,
    ChevronRight,
    School,
    BookOpen,
    Sparkles,
    Shield,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/college', icon: LayoutDashboard, label: 'Overview', exact: true },
    { href: '/college/teachers', icon: GraduationCap, label: 'Teachers' },
    { href: '/college/students', icon: Users, label: 'Students' },
    { href: '/college/courses', icon: BookOpen, label: 'All Courses' },
];

export function CollegeSidebar({ dean }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (item) => {
        if (item.exact) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo — 3D depth with amber glow */}
            <div className="px-6 py-5 border-b border-white/[0.04]">
                <Link href="/college" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-glow-amber group-hover:scale-110 transition-transform duration-300 depth-breathe">
                        <School className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg">LearnHub</span>
                </Link>
                <div className="mt-1 ml-11 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <Shield className="w-3 h-3" />
                    Dean's Portal
                </div>
            </div>

            {/* Navigation — 3D active states with amber glow */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">Management</p>
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${active
                                    ? 'bg-amber-600/15 text-amber-300 border border-amber-500/25 sidebar-nav-active-amber glow-border-amber'
                                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
                                }`}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <item.icon className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${active ? 'text-amber-400' : 'text-white/25 group-hover:text-white/50'}`} />
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight className="w-3 h-3 text-amber-400" />}
                        </Link>
                    );
                })}

                <div className="pt-4 border-t border-white/[0.04] mt-4">
                    <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">Switch View</p>
                    <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-300 group border border-transparent"
                    >
                        <LayoutDashboard className="w-4 h-4 text-white/25 group-hover:text-white/50" />
                        <span>Student Dashboard</span>
                    </Link>
                    <Link
                        href="/teacher"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-300 group border border-transparent"
                    >
                        <GraduationCap className="w-4 h-4 text-white/25 group-hover:text-white/50" />
                        <span>Teacher Portal</span>
                    </Link>
                </div>
            </nav>

            {/* Profile — 3D glass card with admin badge */}
            <div className="px-4 py-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass-card">
                    <div className="relative">
                        <UserButton afterSignOutUrl="/" />
                        {/* Gold glow ring */}
                        <div className="absolute -inset-0.5 rounded-full border border-amber-400/25 opacity-60" style={{ boxShadow: '0 0 8px rgba(245, 158, 11, 0.2)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{dean?.full_name ?? 'Dean'}</p>
                        <p className="text-xs text-amber-400/60 truncate flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            Administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar — 3D Glassmorphic with amber accent */}
            <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 sidebar-glass border-r border-white/[0.04] z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 sidebar-glass border-b border-white/[0.04]">
                <Link href="/college" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-glow-amber">
                        <School className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white">LearnHub</span>
                    <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" /> Dean
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all duration-200"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-30 flex">
                    <div className="w-64 sidebar-glass border-r border-white/[0.04] pt-16">
                        <SidebarContent />
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* Mobile content padding */}
            <div className="lg:hidden h-14" />
        </>
    );
}
