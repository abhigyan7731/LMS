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
            {/* Logo */}
            <div className="px-6 py-5 border-b border-white/5">
                <Link href="/college" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <School className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg">LearnHub</span>
                </Link>
                <div className="mt-1 ml-10 text-xs text-amber-400 font-medium">Dean's Portal</div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-3">Management</p>
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-amber-400' : 'text-white/30 group-hover:text-white/60'}`} />
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight className="w-3 h-3 text-amber-400" />}
                        </Link>
                    );
                })}

                <div className="pt-4 border-t border-white/5 mt-4">
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-3">Other Views</p>
                    <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                    >
                        <LayoutDashboard className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                        <span>Student Dashboard</span>
                    </Link>
                    <Link
                        href="/teacher"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                    >
                        <GraduationCap className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                        <span>Teacher Portal</span>
                    </Link>
                </div>
            </nav>

            {/* Profile */}
            <div className="px-4 py-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{dean?.full_name ?? 'Dean'}</p>
                        <p className="text-xs text-amber-400/70 truncate">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#13131f] border-r border-white/5 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#13131f] border-b border-white/5">
                <Link href="/college" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <School className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-white">LearnHub</span>
                    <span className="text-xs text-amber-400 font-medium">Dean</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-30 flex">
                    <div className="w-64 bg-[#13131f] border-r border-white/5 pt-16">
                        <SidebarContent />
                    </div>
                    <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
                </div>
            )}

            {/* Mobile content padding */}
            <div className="lg:hidden h-14" />
        </>
    );
}
